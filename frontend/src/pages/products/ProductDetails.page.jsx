
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { toast } from "react-toastify";

import {
  useProductById,
  useDeleteProduct,
} from "../../hooks/api/products/products.hooks";

import { useAddToCart } from "../../hooks/api/cart/cart.hooks";

import ImageCarousel from "../../components/common/ImageCarousel";
import ReviewBox from "../../components/page/reviews/ReviewBox";
import ChatButton from "../../components/page/chat/ChatButton";

import { REVIEW_ENTITYS } from "../../../../backend/constants/review.constants";

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useSelector((state) => state.auth);

  const [openDelete, setOpenDelete] = useState(false);

  const {
    data,
    isLoading,
    isError,
  } = useProductById(id);

  const {
    mutate: deleteProduct,
    isPending: isDeleting,
  } = useDeleteProduct();

  const {
    mutate: addToCart,
    isPending: isAddingToCart,
  } = useAddToCart();


  if (isLoading) {
    return (
      <Box sx={loadingStyles}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data?.product) {
    return (
      <Box sx={errorStyles}>
        <Typography color="error">
          Failed to load product
        </Typography>
      </Box>
    );
  }

  const product = data.product;
  const shop = product.shop;

  const productId = product._id || product.id;

  const shopUserId =
    typeof shop?.user === "object"
      ? shop.user?._id
      : shop?.user;

  const currentUserId = user?.id || user?._id;

  const isMyProduct =
    Boolean(currentUserId) &&
    String(currentUserId) === String(shopUserId);

  const isAvailable =
    product.status === "available" &&
    product.quantityAvailable > 0;

  const imageUrls =
    product.images
      ?.map((image) => image?.file?.url)
      .filter(Boolean) || [];

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleEdit = () => {
    navigate(`/products/update/${productId}`);
  };

  const handleDelete = () => {
    deleteProduct(productId, {
      onSuccess: () => {
        toast.success("Product deleted successfully");
        setOpenDelete(false);
        navigate("/products");
      },
      onError: () => {
        toast.error("Failed to delete product");
      },
    });
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;

    addToCart(
      {
        productId,
        quantity: 1,
      },
      {
        onSuccess: () => {
          toast.success("Added to cart");
        },
        onError: () => {
          toast.error("Failed to add product to cart");
        },
      }
    );
  };


  return (
    <Box sx={pageStyles}>
      <Paper elevation={0} sx={cardStyles}>
        <Stack spacing={3} sx={contentStyles}>

          <ProductImages images={imageUrls} />

          <ProductHeader
            product={product}
            isAvailable={isAvailable}
          />

          <ProductPrice price={product.price} />

          <ProductInformation product={product} />

          <Divider />

          {shop && (
            <ProductShop
              shop={shop}
              shopUserId={shopUserId}
              isMyProduct={isMyProduct}
              onClick={() => navigate(`/shop/${shop._id}`)}
            />
          )}

          <ProductActions
            isMyProduct={isMyProduct}
            isAvailable={isAvailable}
            isAddingToCart={isAddingToCart}
            onAddToCart={handleAddToCart}
            onEdit={handleEdit}
            onDelete={() => setOpenDelete(true)}
          />

        </Stack>

        <ProductReviews productId={productId} />
      </Paper>

      <DeleteProductDialog
        open={openDelete}
        isDeleting={isDeleting}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}

// -----------------------------------------------------------------------------
// Product Images
// -----------------------------------------------------------------------------

function ProductImages({ images }) {
  return (
    <ImageCarousel
      images={images}
      imageStyles={{
        aspectRatio: "2/1",
      }}
    />
  );
}

// -----------------------------------------------------------------------------
// Product Header
// -----------------------------------------------------------------------------

function ProductHeader({ product, isAvailable }) {
  return (
    <Box sx={headerStyles}>
      <Box>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={titleStyles}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body1"
          sx={descriptionStyles}
        >
          {product.description}
        </Typography>
      </Box>

      <Chip
        label={product.status}
        color={isAvailable ? "success" : "default"}
        sx={{ textTransform: "capitalize" }}
      />
    </Box>
  );
}

function ProductPrice({ price }) {
  return (
    <Box sx={priceStyles}>
      <Typography
        component="span"
        sx={priceAmountStyles}
      >
        {price?.toLocaleString()}
      </Typography>

      <Typography
        component="span"
        sx={currencyStyles}
      >
        PKR
      </Typography>
    </Box>
  );
}

function ProductInformation({ product }) {
  return (
    <Box sx={infoGridStyles}>
      <ProductInfoItem
        icon={<CategoryOutlinedIcon />}
        label="Category"
        value={product.category?.name || "Uncategorized"}
      />

      <ProductInfoItem
        icon={<Inventory2OutlinedIcon />}
        label="Availability"
        value={
          product.quantityAvailable > 0
            ? `${product.quantityAvailable} available`
            : "Out of stock"
        }
      />

      <ProductInfoItem
        icon={<LocationOnOutlinedIcon />}
        label="Location"
        value={product.location?.fullAddress || "Not specified"}
      />
    </Box>
  );
}

function ProductInfoItem({ icon, label, value }) {
  return (
    <Box sx={infoItemStyles}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems:"center"
        }}
      >
        <Box sx={infoIconStyles}>
          {icon}
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {label}
          </Typography>

          <Typography fontWeight={600}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function ProductShop({
  shop,
  shopUserId,
  isMyProduct,
  onClick,
}) {
  const shopLogoUrl = shop?.logo?.file?.url;

  return (
    <Paper
      elevation={0}
      sx={shopCardStyles}
      onClick={onClick}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          alignItems:{
            xs: "flex-start",
            sm: "center",
          },
          justifyContent:"space-between"
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems:"center"
          }}
        >
          <Avatar
            src={shopLogoUrl || ""}
            alt={shop.name}
            sx={{
              width: 48,
              height: 48,
            }}
          >
            {shop.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Sold by
            </Typography>

            <Typography fontWeight={600}>
              {shop.name}
            </Typography>
          </Box>
        </Stack>

        {!isMyProduct && shopUserId && (
          <Box onClick={(event) => event.stopPropagation()}>
            <ChatButton id={shopUserId} />
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

function ProductActions({
  isMyProduct,
  isAvailable,
  isAddingToCart,
  onAddToCart,
  onEdit,
  onDelete,
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={actionsStyles}
    >
      {!isMyProduct ? (
        <Button
          variant="contained"
          startIcon={<ShoppingCartOutlinedIcon />}
          onClick={onAddToCart}
          disabled={!isAvailable || isAddingToCart}
        >
          {isAddingToCart
            ? "Adding..."
            : isAvailable
              ? "Add to Cart"
              : "Out of Stock"}
        </Button>
      ) : (
        <>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<EditOutlinedIcon />}
            onClick={onEdit}
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={onDelete}
          >
            Delete
          </Button>
        </>
      )}
    </Stack>
  );
}

function ProductReviews({ productId }) {
  return (
    <Box sx={reviewsStyles}>
      <Divider sx={reviewDividerStyles} />

      <ReviewBox
        entityId={productId}
        entityType={REVIEW_ENTITYS.PRODUCT}
      />
    </Box>
  );
}

function DeleteProductDialog({
  open,
  isDeleting,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
    >
      <DialogTitle>
        Delete Product
      </DialogTitle>

      <DialogContent>
        Are you sure you want to delete this product?
        This action cannot be undone.
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          disabled={isDeleting}
          onClick={onConfirm}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** @type {import("@mui/material").SxProps} */
const pageStyles = {
  minHeight: "100%",
  px: { xs: 1, sm: 2 },
  py: { xs: 2, md: 4 },
  display: "flex",
  alignSelf:"center",
  justifyContent: "center",
  flex:1
};

/** @type {import("@mui/material").SxProps} */
const loadingStyles = {
  minHeight: "60vh",
  display: "grid",
  placeItems: "center",
};

/** @type {import("@mui/material").SxProps} */
const errorStyles = {
  p: 4,
};

/** @type {import("@mui/material").SxProps} */
const cardStyles = {
  width: "100%",
  maxWidth: 1100,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  overflow: "hidden",
};

/** @type {import("@mui/material").SxProps} */
const contentStyles = {
  p: { xs: 2, sm: 3, md: 4 },
};

/** @type {import("@mui/material").SxProps} */
const headerStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", sm: "center" },
  gap: 2,
  flexDirection: { xs: "column", sm: "row" },
};

/** @type {import("@mui/material").SxProps} */
const titleStyles = {
  fontSize: { xs: "1.75rem", sm: "2.25rem" },
};

/** @type {import("@mui/material").SxProps} */
const descriptionStyles = {
  mt: 1,
  maxWidth: 750,
  color: "text.secondary",
  lineHeight: 1.7,
};

/** @type {import("@mui/material").SxProps} */
const priceStyles = {
  display: "flex",
  alignItems: "baseline",
  gap: 0.75,
};

/** @type {import("@mui/material").SxProps} */
const priceAmountStyles = {
  fontSize: { xs: "1.8rem", sm: "2.2rem" },
  fontWeight: 800,
  color: "primary.main",
};

/** @type {import("@mui/material").SxProps} */
const currencyStyles = {
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "text.secondary",
};

/** @type {import("@mui/material").SxProps} */
const infoGridStyles = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(3, 1fr)",
  },
  gap: 1.5,
};

/** @type {import("@mui/material").SxProps} */
const infoItemStyles = {
  p: 1.5,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
};

/** @type {import("@mui/material").SxProps} */
const infoIconStyles = {
  color: "text.secondary",
  fontSize: 20,
};

/** @type {import("@mui/material").SxProps} */
const shopCardStyles = {
  p: 2,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  cursor:"pointer"
};

/** @type {import("@mui/material").SxProps} */
const actionsStyles = {
  flexWrap: "wrap",
};

/** @type {import("@mui/material").SxProps} */
const reviewsStyles = {
  px: { xs: 2, sm: 3, md: 4 },
  pb: { xs: 2, sm: 3, md: 4 },
};

/** @type {import("@mui/material").SxProps} */
const reviewDividerStyles = {
  mb: 3,
};