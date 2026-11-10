import { Box, Grid, Stack, Typography } from "@mui/material";
import { useProducts } from "../../../hooks/api/products/products.hooks";

import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/** @type {import("@mui/material").SxProps} */
const headerStyles = {
  mb: 4,
};

/** @type {import("@mui/material").SxProps} */
const titleStyles = {
  fontWeight: 700,
  lineHeight: 1.2,
};

/** @type {import("@mui/material").SxProps} */
const subtitleStyles = {
  color: "text.secondary",
  lineHeight: 1.6,
};

/** @type {import("@mui/material").GridProps["size"]} */
const productGridSize = {
  xs: 12,
  sm: 6,
  md: 6,
  lg: 4,
  xl: 3,
};

export default function FeaturedProducts() {

  const { data, isLoading, isError } = useProducts({
    limit: 8,
    page: 1,
  });

  const navigate = useNavigate();

  const shop = useSelector((state)=>state.auth?.user?.shop)

  if (isLoading || isError) {
    return null;
  }

  const products = data?.products ?? [];


  const handleCardClick = (product)=>navigate(`/products/${product._id}`);

  return (
    <Box>
      <Stack spacing={1} sx={headerStyles}>
        <Typography variant="h4" sx={titleStyles}>
          Featured Products
        </Typography>

        <Typography sx={subtitleStyles}>
          Top products from trusted shops
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product._id} size={productGridSize}>
            <ProductCard
              product={product}
              onCardClick={handleCardClick}
              isOwn={(shop === product?.shop?._id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}