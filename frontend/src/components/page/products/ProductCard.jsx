import {
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

export default function ProductCard({
  product,
  onCardClick,
  onAddToCart,
  isOwn,
}) {
  const isAvailable = product.status === "available";
  const image = product.images?.[0]?.file?.url;

  return (
    <Card onClick={() => onCardClick(product)} sx={cardSx}>
      {/* Product Image */}
      <Box sx={imageWrapperSx}>
        <Box
          component="img"
          src={image}
          alt={product.name}
          sx={imageSx}
        />

        <Box
          sx={{
            ...statusSx,
            color: isAvailable ? "success.dark" : "error.dark",
            bgcolor: isAvailable ? "success.light" : "error.light",
          }}
        >
          <Box
            sx={{
              ...statusDotSx,
              bgcolor: isAvailable ? "success.main" : "error.main",
            }}
          />
          {isAvailable ? "In Stock" : "Out of Stock"}
        </Box>
      </Box>

      {/* Product Details */}
      <Box sx={contentSx}>
        <Stack spacing={1.5}>
          <Box>
            <Typography sx={nameSx} title={product.name}>
              {product.name}
            </Typography>

            <Typography sx={descriptionSx}>
              {product.description}
            </Typography>
          </Box>

          <Divider />

          {/* Price and Rating */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography sx={priceSx}>
                {Number(product.price).toLocaleString()}
              </Typography>

              <Typography sx={currencySx}>
                PKR
              </Typography>
            </Box>

            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography sx={starSx}>★</Typography>
              <Typography sx={ratingSx}>
                {Number(product.ratingAverage || 0).toFixed(1)}
              </Typography>
            </Stack>
          </Stack>

          {!isOwn && (
            <Button
              fullWidth
              variant="contained"
              disabled={!isAvailable}
              onClick={(event) => {
                event.stopPropagation();
                onAddToCart(product);
              }}
              sx={cartButtonSx}
            >
              {isAvailable ? "Add to Cart" : "Unavailable"}
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
}

/** @type {import("@mui/material").SxProps} */
const cardSx = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  cursor: "pointer",
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  boxShadow: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
  "&:hover": {
    borderColor: "primary.main",
    boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
    transform: "translateY(-3px)",
    "& .product-image": {
      transform: "scale(1.05)",
    },
  },
};

/** @type {import("@mui/material").SxProps} */
const imageWrapperSx = {
  position: "relative",
  width: "100%",
  overflow: "hidden",
  bgcolor: "action.hover",
  aspectRatio: "1.15 / 1",
};

/** @type {import("@mui/material").SxProps} */
const imageSx = {
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover",
  transition: "transform 0.35s ease",
  ".MuiCard-root:hover &": {
    transform: "scale(1.05)",
  },
};

/** @type {import("@mui/material").SxProps} */
const statusSx = {
  position: "absolute",
  top: 12,
  left: 12,
  display: "flex",
  alignItems: "center",
  gap: 0.75,
  px: 1.25,
  py: 0.75,
  borderRadius: 1,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.2px",
};

/** @type {import("@mui/material").SxProps} */
const statusDotSx = {
  width: 6,
  height: 6,
  borderRadius: "50%",
};

/** @type {import("@mui/material").SxProps} */
const contentSx = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  p: 2,
};

/** @type {import("@mui/material").SxProps} */
const nameSx = {
  fontSize: "1rem",
  fontWeight: 650,
  color: "text.primary",
  lineHeight: 1.4,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

/** @type {import("@mui/material").SxProps} */
const descriptionSx = {
  mt: 0.5,
  fontSize: "0.8rem",
  color: "text.secondary",
  lineHeight: 1.5,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  minHeight: "2.4em",
};

/** @type {import("@mui/material").SxProps} */
const priceSx = {
  fontSize: "1.3rem",
  fontWeight: 750,
  color: "text.primary",
  letterSpacing: "-0.6px",
  lineHeight: 1.2,
};

/** @type {import("@mui/material").SxProps} */
const currencySx = {
  mt: 0.25,
  fontSize: "0.7rem",
  fontWeight: 600,
  color: "text.secondary",
};

/** @type {import("@mui/material").SxProps} */
const starSx = {
  color: "#F5A623",
  fontSize: 17,
  lineHeight: 1,
};

/** @type {import("@mui/material").SxProps} */
const ratingSx = {
  fontSize: "0.8rem",
  fontWeight: 650,
  color: "text.primary",
};

/** @type {import("@mui/material").SxProps} */
const cartButtonSx = {
  py: 1,
  borderRadius: 1.5,
  fontSize: "0.85rem",
  fontWeight: 650,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none",
  },
};