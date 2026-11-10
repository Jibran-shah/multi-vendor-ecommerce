
import {
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import ProductCard from "../../components/page/products/ProductCard";

import { useProducts } from "../../hooks/api/products/products.hooks";
import { useAddToCart } from "../../hooks/api/cart/cart.hooks";

export default function ProductSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const shop = useSelector((state) => state.auth?.user?.shop);

  const { mutate: addToCart } = useAddToCart();

  const filters = {
    search: searchParams.get("search"),
    category: searchParams.get("category"),
    minPrice: searchParams.get("minPrice"),
    maxPrice: searchParams.get("maxPrice"),
    sort: searchParams.get("sort"),
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  };

  const { data, isLoading, isError } = useProducts(filters);

  const products = data?.products ?? [];
  const meta = data?.meta ?? {};

  const currentPage = Number(meta.page || filters.page || 1);
  const totalPages = Number(meta.pages || 1);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

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

  const updatePage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));

    navigate(`/products/search?${params.toString()}`);
  };

  // ---------------------------------------------------------------------------
  // Loading & Error States
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={pageStyles}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="xl" sx={pageStyles}>
        <Typography color="error">
          Failed to load products
        </Typography>
      </Container>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Container maxWidth="xl" sx={pageStyles}>
      <Stack spacing={3} sx={{ px: 2, py: 4 }}>
        <Stack spacing={0.5} sx={headerStyles}>
          <Typography variant="h4" sx={titleStyles}>
            Search Results
          </Typography>

          <Typography variant="body2" sx={subtitleStyles}>
            {products.length}{" "}
            {products.length === 1 ? "product" : "products"} found
          </Typography>
        </Stack>

        {products.length > 0 ? (
          <Grid
            container
            spacing={{ xs: 2, sm: 2.5, md: 3 }}
            sx={productsGridStyles}
          >
            {products.map((product) => (
              <Grid
                key={product._id}
                size={productGridSize}
              >
                <ProductCard
                  product={product}
                  onCardClick={handleCardClick}
                  onAddToCart={(event) =>
                    handleAddToCart(event, product)
                  }
                  isOwn={shop === product.shop?._id}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={1} sx={emptyStyles}>
            <Typography variant="h6" fontWeight={600}>
              No products found
            </Typography>

            <Typography variant="body2">
              Try changing your search or filter options.
            </Typography>
          </Stack>
        )}

        {totalPages > 1 && (
          <Stack
            direction="row"
            spacing={2}
            sx={paginationStyles}
          >
            <Button
              variant="outlined"
              disabled={currentPage <= 1}
              onClick={() => updatePage(currentPage - 1)}
            >
              Previous
            </Button>

            <Typography sx={pageTextStyles}>
              Page {currentPage} of {totalPages}
            </Typography>

            <Button
              variant="outlined"
              disabled={currentPage >= totalPages}
              onClick={() => updatePage(currentPage + 1)}
            >
              Next
            </Button>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}



// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

/** @type {import("@mui/material").SxProps} */
const pageStyles = {
  py: { xs: 3, md: 4 },
};

/** @type {import("@mui/material").SxProps} */
const headerStyles = {
  mb: 3,
};

/** @type {import("@mui/material").SxProps} */
const titleStyles = {
  fontWeight: 700,
};

/** @type {import("@mui/material").SxProps} */
const subtitleStyles = {
  mt: 0.5,
  color: "text.secondary",
};

/** @type {import("@mui/material").SxProps} */
const productsGridStyles = {
  mb: 4,
};

/** @type {import("@mui/material").GridProps["size"]} */
const productGridSize = {
  xs: 12,
  sm: 6,
  md: 6,
  lg: 4,
  xl: 3,
};

/** @type {import("@mui/material").SxProps} */
const emptyStyles = {
  py: 8,
  textAlign: "center",
  color: "text.secondary",
};

/** @type {import("@mui/material").SxProps} */
const paginationStyles = {
  pt: 1,
  justifyContent: "center",
  alignItems: "center",
};

/** @type {import("@mui/material").SxProps} */
const pageTextStyles = {
  minWidth: 100,
  textAlign: "center",
  fontWeight: 600,
};