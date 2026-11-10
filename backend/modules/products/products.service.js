import { Product } from "../../models/Product.model.js";
import { Shop } from "../../models/Shop.model.js";
import { Category } from "../../models/Category.model.js";
import { NotFoundError, UnauthorizedError, BadRequestError } from "../../errors/index.js";
import { isValidId } from "../../validationSchemas/mongodb.schemas.js";
import { escapeRegex } from "../../utils/escapeRegex.utils.js";
import { CATEGORY_APPLIES_TO } from "../../constants/category.constants.js";
import { mediaService } from "../media/media.service.js";
import { buildLocation, isValidCoordinates } from "../../utils/location.utils.js";
import { mediaPopulate, shopPopulate } from "../../populates/index.js";
import { restrictTo } from "../../middlewares/protect.middleware.js";

export const createProduct = async (payload, mediaContext = {}) => {
  const {
    data,
    user,
    categoryId,
    files = [],
    fileIds = []
  } = payload;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new BadRequestError("Category doesn't exist");
  }

  if (!category.appliesTo.includes(CATEGORY_APPLIES_TO.PRODUCT)) {
    throw new BadRequestError("Must provide a product category");
  }

  const shop = await Shop.findById(user.shop);

  if (!shop) {
    throw new BadRequestError("Shop not found");
  }

  shop.totalProducts += 1;

  await shop.save();


  const images = await mediaService.resolve({
    files,
    fileIds,
    context: mediaContext,
    userId: user.id
  });

  const coords = shop?.location?.coordinates;

  const location =
    Array.isArray(coords) &&
    isValidCoordinates(coords[0], coords[1])
      ? buildLocation(coords[0], coords[1], shop?.location?.fullAddress ||"")
      : undefined;

  const productPayload = {
    ...data,
    user: user.id,
    shop: user.shop,
    category: categoryId,
    categoryPath: category.path,
    images,
    ...(location && { location })
  };

  const _product = Product.create(productPayload);

  return await _product;
};

export const syncShopProductLocations = async (
  shopId,
  session = null
) => {
  const shop = await Shop.findById(
    shopId
  ).select("location");

  const coords = shop?.location?.coordinates;

  if (
    !Array.isArray(coords) ||
    coords.length !== 2 ||
    !isValidCoordinates(coords[0], coords[1])
  ) {
    return;
  }

  const update = {
    location: buildLocation(coords[0], coords[1], shop?.location?.fullAddress || "")
  };

  const query = { shop: shopId };

  return session
    ? Product.updateMany(query, update).session(session)
    : Product.updateMany(query, update);
};

export const getProducts = async (query) => {
  let {
    page = 1,
    limit = 10,
    search,
    minPrice,
    maxPrice,
    category,
    status,
    shop,
    categoryPath,
    inStock,
    minRating,
    minRatingCount,
    createdFrom,
    createdTo,
    sort = "-createdAt"
  } = query;

  page = Math.max(Number(page), 1);
  limit = Math.min(Math.max(Number(limit), 1), 100);

  const filter = {};

  if (status) filter.status = status;

  if (shop) {
    if (!isValidId(shop)) {
      throw new BadRequestError("Invalid shop id");
    }

    filter.shop = shop;
  }

  if (inStock === true || inStock === "true") {
    filter.quantityAvailable = { $gt: 0 };
  }

  if (minRating !== undefined) {
    filter.ratingAverage = {
      $gte: Number(minRating)
    };
  }

  if (minRatingCount !== undefined) {
    filter.ratingCount = {
      $gte: Number(minRatingCount)
    };
  }

  if (createdFrom || createdTo) {
    filter.createdAt = {};

    if (createdFrom) {
      filter.createdAt.$gte = new Date(createdFrom);
    }

    if (createdTo) {
      filter.createdAt.$lte = new Date(createdTo);
    }
  }

  if (
    minPrice !== undefined ||
    maxPrice !== undefined
  ) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  if (category) {
    const cat = await Category.findById(category);

    if (!cat) {
      throw new NotFoundError(
        "Category not found"
      );
    }

    const safePath = escapeRegex(cat.path);

    filter.categoryPath = {
      $regex: `^${safePath}`
    };
  }

  if (categoryPath) {
    filter.categoryPath = {
      $regex: escapeRegex(categoryPath),
      $options: "i"
    };
  }

  if (search) {
    const tokens = search
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    filter.$or = [
      {
        name: {
          $regex: tokens.join("|"),
          $options: "i"
        }
      },
      {
        description: {
          $regex: tokens.join("|"),
          $options: "i"
        }
      },
      {
        categoryPath: {
          $regex: tokens.join("|"),
          $options: "i"
        }
      }
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate(shopPopulate)
      .populate("category")
      .populate(mediaPopulate)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter)
  ]);

  return {
    products,
    meta: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    }
  };
};

export const getProductsByShop = async (
  shop
) => {
  if (!isValidId(shop)) {
    throw new BadRequestError("Invalid shop id");
  }

  return Product.find({shop})
    .sort("-createdAt")
    .populate("category", "name")
    .populate(mediaPopulate);
};

export const getByCategory = async (
  categoryId
) => {

  if (!isValidId(categoryId)) {
    throw new BadRequestError("Invalid category id");
  }

  const category = await Category.findById(categoryId);
  
  if (!category)
    throw new NotFoundError("Category not found");

  const safePath = escapeRegex(category.path);

  return Product.find({
    categoryPath: { $regex: `^${safePath}` }
  })
    .sort("-createdAt")
    .populate("shop", "name")
    .populate(mediaPopulate);
};

export const getProductById = async (
  productId
) => {
  if (!isValidId(productId)) {
    throw new BadRequestError("Invalid product id");
  }

  const product = await Product.findById(productId)
    .populate({
      path:"shop",
      select:"name logo user",
      populate:{
        path:"logo",
        select:"file",
        populate:{
          path:"file",
          select:"url"
        }
      }
    })
    .populate("category")
    .populate({
      path:"images",
      select:"file",
      populate:{
        path:"file",
        select:"url"
      }
    });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return product;
};

export const updateProduct = async ({
  productId,
  user,
  data,
  context = {}
}) => {

  data.images = data.images||[]

  if (!isValidId(productId)) {
    throw new BadRequestError("Invalid product id");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.shop.toString() !== String(user.shop)) {
    throw new UnauthorizedError(
      "Not allowed to update this product"
    );
  }

  const forbiddenFields = [
    "shop",
    "category",
    "categoryPath",
    "soldCount",
    "ratingSum",
    "ratingCount",
    "ratingAverage",
    "fullAddress"
  ];

  for (const field of forbiddenFields) {
    if (field in data) {
      throw new BadRequestError(
        `Cannot update field: ${field}`
      );
    }
  }

  if (data.files) {
    const images = await mediaService.resolve({
      files: data.files || [],
      context,
      userId:user.id
    });

    product.images = [...images];
  }

  product.images = [...product.images,...data.images]


  Object.assign(product, data);

  const _product = await product.save();
  Product.findById(product._id).populate(mediaPopulate)
  return _product;
};

export const deleteProduct = async ({
  productId,
  user
}) => {
  if (!isValidId(productId)) {
    throw new BadRequestError("Invalid product id");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.shop.toString() !== String(user.shop) || restrictTo("admin")) {
    throw new UnauthorizedError(
      "Not allowed to delete this product"
    );
  }

  await product.deleteOne();
  return true;
};


export const deleteProductAdmin = async ({
  productId
}) => {
  if (!isValidId(productId)) {
    throw new BadRequestError("Invalid product id");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  await product.deleteOne();
  return true;
};