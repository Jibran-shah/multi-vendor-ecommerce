import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import HeroSection from "../../components/common/layout/HeroSection";
import ProductCard from "../../components/page/products/ProductCard";

import SearchInput from "../../components/common/filters/SearchInput";
import SortSelect from "../../components/common/filters/SortSelect";
import CategoryTreeSelect from "../../components/page/categories/CategoryTreeSelect";

import { useProducts } from "../../hooks/api/products/products.hooks";
import { useAddToCart } from "../../hooks/api/cart/cart.hooks";

const sortOptions = [
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
  { label: "Price ↑", value: "price" },
  { label: "Price ↓", value: "-price" },
  { label: "Rating", value: "-ratingAverage" },
];

/** @type {import("@mui/material").SxProps} */
const filtersStyles = {
  flexWrap: "nowrap",
  overflow: "hidden",
  alignItems: "center",
  backgroundColor: "background.paper",
  p: 1,
  px: 1.5,
  borderRadius: 1,
};

/** @type {import("@mui/material").SxProps} */
const searchButtonStyles = {
  mt: 2,
};

/** @type {import("@mui/material").SxProps} */
const productsGridStyles = {
  px: 2,
  py: 4,
};

/** @type {import("@mui/material").GridProps["size"]} */
const productGridSize = {
  xs: 12,
  sm: 6,
  md: 6,
  lg: 4,
  xl: 3,
};

export default function ProductsPage() {
  const navigate = useNavigate();

  const shop = useSelector((state) => state.auth?.user?.shop);

  const [filters, setFilters] = useState({
    search: "",
    category: null,
    sort: "-createdAt",
  });

  const { mutate: addToCart } = useAddToCart();

  const { data, isLoading, isError } = useProducts(
    {
      page: 1,
      limit: 50,
    },
    true
  );

  const products = data?.products ?? [];

  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleCardClick = (product) => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = (event, product) => {
    event?.stopPropagation();

    addToCart(
      {
        productId: product._id,
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

  const handleSearch = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        return;
      }

      if (key === "category") {
        params.set(key, value._id);
        return;
      }

      params.set(key, String(value));
    });

    navigate(`/products/search?${params.toString()}`);
  };

  if (isLoading) return null;
  if (isError) return null;

  return (
    <Box sx={{ flex: 1 }}>
      <HeroSection
        title="Discover Products"
        subtitle="Find electronics, fashion, and everything you need in one place."
        backgroundImage="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
      >
        <Stack direction="row" spacing={1} sx={filtersStyles}>
          <SearchInput
            value={filters.search}
            onChange={(value) => updateFilter("search", value)}
            placeholder="Search products..."
          />

          <CategoryTreeSelect
            value={filters.category}
            onChange={(value) => updateFilter("category", value)}
            label="Category"
          />

          <SortSelect
            value={filters.sort}
            onChange={(value) => updateFilter("sort", value)}
            options={sortOptions}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={searchButtonStyles}
          >
            Search Products
          </Button>
        </Stack>
      </HeroSection>

      <Stack spacing={3} sx={productsGridStyles}>
        <Typography variant="h5" fontWeight={700}>
          Top Products
        </Typography>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product._id} size={productGridSize}>
              <ProductCard
                product={product}
                onCardClick={handleCardClick}
                onAddToCart={(event) => handleAddToCart(event, product)}
                isOwn={shop === product.shop?._id}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}