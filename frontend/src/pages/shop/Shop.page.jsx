import {
  Avatar,
  Box,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { useParams } from "react-router-dom";

import { useShop } from "../../hooks/api/shop/shop.hooks";
import { useProducts } from "../../hooks/api/products/products.hooks";

import ImageCarousel from "../../components/common/ImageCarousel";
import ChatButton from "../../components/page/chat/ChatButton";
import ProductCard from "../../components/page/products/ProductCard";
import ReviewBox from "../../components/page/reviews/ReviewBox";
import { REVIEW_ENTITYS } from "../../../../backend/constants/review.constants";

/** @type {import("@mui/material").SxProps} */
const pageSx = {
  width: "100%",
  maxWidth: 1200,
  mx: "auto",
  px: { xs: 2, sm: 3 },
  py: { xs: 2, md: 4 },
  display: "flex",
  flexDirection: "column",
  gap: { xs: 4, md: 5 },
};

/** @type {import("@mui/material").SxProps} */
const headerSx = {
  p: { xs: 2, sm: 3 },
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
};

/** @type {import("@mui/material").SxProps} */
const headerContentSx = {
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", sm: "center" },
};

/** @type {import("@mui/material").SxProps} */
const shopInfoSx = {
  alignItems: "center",
  minWidth: 0,
};

/** @type {import("@mui/material").SxProps} */
const logoSx = {
  width: { xs: 64, sm: 80 },
  height: { xs: 64, sm: 80 },
  flexShrink: 0,
  border: "1px solid",
  borderColor: "divider",
};

/** @type {import("@mui/material").SxProps} */
const shopNameSx = {
  fontSize: { xs: "1.4rem", sm: "1.75rem" },
  fontWeight: 700,
};

/** @type {import("@mui/material").SxProps} */
const ratingSx = {
  mt: 0.5,
  alignItems: "center",
};

/** @type {import("@mui/material").SxProps} */
const locationSx = {
  mt: 0.75,
  alignItems: "center",
};

/** @type {import("@mui/material").SxProps} */
const detailsSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "2fr 1fr",
  },
  gap: { xs: 3, md: 4 },
};

/** @type {import("@mui/material").SxProps} */
const detailsCardSx = {
  p: { xs: 2, sm: 3 },
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
};

/** @type {import("@mui/material").SxProps} */
const descriptionSx = {
  mt: 1,
  color: "text.secondary",
  lineHeight: 1.7,
};

/** @type {import("@mui/material").SxProps} */
const statSx = {
  mt: 3,
  pt: 2,
  borderTop: "1px solid",
  borderColor: "divider",
  alignItems: "center",
};

/** @type {import("@mui/material").SxProps} */
const sectionHeaderSx = {
  mb: 2.5,
  justifyContent: "space-between",
  alignItems: "baseline",
};

/** @type {import("@mui/material").SxProps} */
const productGridSx = {
  "& .MuiGrid-item": {
    display: "flex",
  },
};

/** @type {import("@mui/material").SxProps} */
const emptyProductsSx = {
  py: 5,
  px: 3,
  textAlign: "center",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
};

const ShopPage = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useShop(id);

  const shop = data?.shop;

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts(
    {
      shop: shop?._id,
    },
    !!shop && !isError
  );

  if (isLoading) {
    return (
      <Box sx={pageSx}>
        <Typography color="text.secondary">
          Loading shop...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={pageSx}>
        <Typography color="error">
          {error?.message || "Failed to load shop"}
        </Typography>
      </Box>
    );
  }

  if (!shop) {
    return (
      <Box sx={pageSx}>
        <Typography color="text.secondary">
          Shop not found.
        </Typography>
      </Box>
    );
  }

  const images =
    shop.images
      ?.map((image) => image?.file?.url)
      .filter(Boolean) || [];

  const logo = shop.logo?.file?.url;

  const shopUserId =
    typeof shop.user === "object"
      ? shop.user?._id
      : shop.user;

  const products = productsData?.products || [];

  return (
    <Box sx={pageSx}>
      <Paper elevation={0} sx={headerSx}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={headerContentSx}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={shopInfoSx}
          >
            <Avatar
              src={logo}
              alt={shop.name}
              sx={logoSx}
            >
              {shop.name?.charAt(0)}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={shopNameSx}>
                {shop.name}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={ratingSx}
              >
                <Rating
                  value={shop.ratingAverage || 0}
                  precision={0.1}
                  size="small"
                  readOnly
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {shop.ratingCount || 0} reviews
                </Typography>
              </Stack>

              {shop.location?.fullAddress && (
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={locationSx}
                >
                  <LocationOnOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: "text.secondary",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                  >
                    {shop.location.fullAddress}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>

          {shopUserId && <ChatButton id={shopUserId} />}
        </Stack>
      </Paper>

      <Box sx={detailsSx}>
        <ImageCarousel
          images={images}
          imageStyles={{
            aspectRatio: "2/1",
          }}
        />

        <Paper elevation={0} sx={detailsCardSx}>
          <Typography variant="h6" fontWeight={700}>
            About the Shop
          </Typography>

          <Typography sx={descriptionSx}>
            {shop.description || "No description available."}
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            sx={statSx}
          >
            <Inventory2OutlinedIcon color="action" />

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Products
              </Typography>

              <Typography fontWeight={700}>
                {shop.totalProducts || 0}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Box>
        <Stack
          direction="row"
          spacing={2}
          sx={sectionHeaderSx}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Products
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Browse products from {shop.name}
            </Typography>
          </Box>

          {shop.totalProducts > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {shop.totalProducts} products
            </Typography>
          )}
        </Stack>

        {productsLoading ? (
          <Typography color="text.secondary">
            Loading products...
          </Typography>
        ) : productsError ? (
          <Typography color="error">
            Failed to load products.
          </Typography>
        ) : products.length === 0 ? (
          <Paper elevation={0} sx={emptyProductsSx}>
            <Typography color="text.secondary">
              This shop has no products yet.
            </Typography>
          </Paper>
        ) : (
          <Grid
            container
            spacing={3}
            sx={productGridSx}
          >
            {products.map((product) => (
              <Grid
                key={product._id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <ReviewBox
        entityId={shop._id}
        entityType={REVIEW_ENTITYS.SHOP}
      />
    </Box>
  );
};

export default ShopPage;