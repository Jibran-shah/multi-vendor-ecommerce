import mongoose from "mongoose";
import { Shop } from "../../models/Shop.model.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError
} from "../../errors/Http.error.js";
import { mediaService } from "../media/media.service.js";
import { syncRole } from "../../utils/roleSync.utils.js";
import { PROFILE_ROLE } from "../../constants/profile.constants.js";
import { User } from "../../models/User.model.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../../utils/token.utils.js";
import { refreshSessionSystem } from "../../utils/session.utils.js";
import { syncShopProductLocations } from "../products/products.service.js";
import {
  buildLocation,
  buildGeoNearQuery,
} from "../../utils/location.utils.js";


export const createShop = async ({
  user,
  locationLn,
  locationLat,
  fullAddress,
  logo,
  logoFile = [],
  images,
  imageFiles,
  name,
  description,
  mediaContext
}) => {

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userDoc = await User.findById(user.id).session(session);

    if (!userDoc) {
      throw new Error("User not found");
    }

    const [logoAssetId] = await mediaService.resolve({
      files: logoFile,
      fileIds: logo ? [logo] : [],
      context: mediaContext?.logoFile,
      userId: user.id,
      session
    });

    const imageAssets = await mediaService.resolve({
      files: imageFiles,
      fileIds: images.length ? images : [],
      context: mediaContext?.imageFiles,
      userId: user.id,
      session
    });

    const location = buildLocation(
      locationLn,
      locationLat,
      fullAddress
    );

    const shop = await Shop.findOneAndUpdate(
      
      { user: user.id },
      {
        $setOnInsert: {
          user: user.id,
          name,
          description,
          logo: logoAssetId || null,
          images: imageAssets || null,
          ...(location && { location })
        }
      },
      {
        session,
        upsert: true,
        runValidators: true,
        returnDocument: "after"
      }
    );


    if (!shop) {
      throw new Error("Shop creation failed");
    }

    await syncRole({
      userId: user.id,
      role: PROFILE_ROLE.SHOP,
      Model: Shop,
      session
    });

    userDoc.shop = shop._id;

    await userDoc.save({ session });

    const sessionId = refreshSessionSystem.generateId();

    const accessToken = generateAccessToken({
      user: {
        ...(userDoc.toObject() || userDoc),
        shop: shop._id
      }
    });

    const refreshToken = generateRefreshToken({
      user: { 
        ...(userDoc.toObject() || userDoc),
        shop:shop._id},
      sessionId
    });

    await refreshSessionSystem.save(
      userDoc._id,
      sessionId,
      refreshToken
    );

    await session.commitTransaction();

    return {
      shop: shop,
      user: userDoc,
      accessToken,
      refreshToken
    };

  } catch (err) {

    await session.abortTransaction();

    const error = parseMongoDuplicateError(err);
    if (error) {
      throw new ConflictError(
        `${error.field} already exists`,
        [{ field: error.field, message: error.message }]
      );
    }

    throw err;

  } finally {
    await session.endSession();
  }
};

export const updateShop = async (id, updates, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const shop = await Shop.findById(id).session(session);

    if (!shop) {
      throw new NotFoundError("shop not found");
    }

    if (shop.user.toString() !== userId.toString()) {
      throw new UnauthorizedError("Not allowed to update this shop");
    }

    const {
      name,
      description,
      isApproved,
      logo,
      logoFile = [],
      images,
      imageFiles = [],
      locationLat,
      locationLn,
      fullAddress,
      mediaContext
    } = updates;

    if (name !== undefined) shop.name = name;
    if (description !== undefined) shop.description = description;
    if (isApproved !== undefined) shop.isApproved = isApproved;

    if (logoFile.length || logo) {
      const [newLogoId] = await mediaService.resolve({
        files: logoFile,
        fileIds: logo ? [logo] : [],
        context: mediaContext?.logoFile,
        userId,
        session
      });

      if (newLogoId && shop.logo) {
        await mediaService.remove(shop.logo, userId, session);
      }

      shop.logo = newLogoId || shop.logo;
    }

    if (imageFiles.length || images.length) {
      const newImages = await mediaService.resolve({
        files: imageFiles,
        fileIds: images.length ? [images] : [],
        context: mediaContext?.imageFiles,
        userId,
        session
      });

      if (newImages.length && shop.images) {
        await mediaService.remove(shop.images, userId, session);
      }

      shop.images = newImages || shop.images;
    }

    const newLocation = buildLocation(
      locationLn,
      locationLat,
      fullAddress
    );

    let locationChanged = false;

    if (newLocation) {
      shop.location = {
        ...shop.location,
        ...newLocation
      };
      locationChanged = true;
    }

    await shop.save({ session });

    if (locationChanged) {
      await syncShopProductLocations(shop._id, session);
    }

    await session.commitTransaction();
    return shop;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};


export const getAllShops = async (filters = {}) => {
  const {
    locationLn,
    locationLat,
    locationRad = 50000,
    name,
    isApproved,
    page = 1,
    limit = 10
  } = filters;

  const query = {};

  if (isApproved !== undefined) {
    query.isApproved = isApproved === "true";
  }

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  const geoQuery =
    locationLn !== undefined &&
    locationLat !== undefined
      ? buildGeoNearQuery(
          locationLn,
          locationLat,
          locationRad
        )
      : null;

  const finalQuery = geoQuery
    ? { ...query, ...geoQuery }
    : query;

  return Shop.find(finalQuery)
    .populate("user")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
};

export const getShopById = async(id) =>
  await Shop.findById(id)
  .populate("user")
  .populate([
    {
      path:"images",
      select:"file",
      populate:{
        path:"file",
        select:"url"
      }
    },
    {
      path:"logo",
      select:"file",
      populate:{
        path:"file",
        select:"url"
      }
    }
  ])

export const getShopByUser = async(userId) =>
  await Shop.findOne({ user: userId }).populate("user").populate([{
      path:"images",
      select:"file",
      populate:{
        path:"file",
        select:"url"
      }
    },{
      path:"logo",
      select:"file",
      populate:{
        path:"file",
        select:"url"
      }
    }
  ]);

export const deleteShopById = async (_user) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    const userDoc = await User.findById(_user.id).session(session);

    if (!userDoc) {
      throw new NotFoundError("User not found");
    }

    if (!userDoc.shop) {
      throw new BadRequestError("User is not a shop");
    }

    await Shop.findByIdAndDelete(userDoc.shop).session(session);


    userDoc.shop = null;
    await userDoc.save({ session });

    // ---------------------------
    // 5. Generate new session + tokens (same pattern as createShop)
    // ---------------------------
    const sessionId = refreshSessionSystem.generateId();

    const accessToken = generateAccessToken({
      user: {
        ...(userDoc.toObject() || userDoc),
        shop: null
      }
    });

    const refreshToken = generateRefreshToken({
      user: {
        ...(userDoc.toObject() || userDoc),
        shop: null
      },
      sessionId
    });

    // ---------------------------
    // 6. Save session
    // ---------------------------
    await refreshSessionSystem.save(
      userDoc._id,
      sessionId,
      refreshToken
    );

    // ---------------------------
    // 7. Commit
    // ---------------------------
    await session.commitTransaction();

    return {
      success: true,
      accessToken,
      refreshToken
    };

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};



export const deleteShopByIdAdmin = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Shop.findByIdAndDelete(idParamSchema).session(session);
    const user = await User.findOne({shop:id});
    user.shop = null
    const deletedProducts = await Product.deleteMany({shop:id},{session});
    await user.save({ session });
    refreshSessionSystem.deleteAll(user._id)
    await session.commitTransaction();
    return {
      success: true
    };

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};