import {
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import { useMyProducts } from "../../../hooks/api/products/products.hooks";

import ProductCard from "./ProductCard";

const gridSize = {
  xs: 12,
  sm: 6,
  md: 6,
  lg: 4,
  xl: 3,
};

export default function MyProducts() {

  const {
    data,
    isLoading,
    isError,
  } = useMyProducts();

  const products = data?.data || data || [];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 6,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography
        color="error"
        sx={{ py: 6, textAlign: "center" }}
      >
        Failed to load your products.
      </Typography>
    );
  }

  if (!products.length) {
    return (
      <Typography
        sx={{
          py: 6,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        No products found.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid
          key={product._id}
          size={gridSize}
        >
          <ProductCard
            product={product}
            onCardClick={handleCardClick}
            isOwn
          />
        </Grid>
      ))}
    </Grid>
  );
}