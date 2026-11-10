import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import EmptyCart from "../cart/EmptyCart";
import CartItemCard from "../cart/CartItemCard";

import {
  useClearCart,
  useCart,
} from "../../../hooks/api/cart/cart.hooks";

import { useCheckout } from "../../../hooks/api/checkout/useCheckout";

export default function Cart() {
  const { data: cart, isLoading } = useCart();

  const { mutate: clearCart, isPending: isClearing } = useClearCart();
  const { mutate: checkout, isPending: isCheckingOut } = useCheckout();

  const isProcessing = isClearing || isCheckingOut;

  if (isLoading) {
    return <Typography>Loading cart...</Typography>;
  }

  if (!cart?.items?.length) {
    return <EmptyCart />;
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        {cart.items.map((item) => (
          <CartItemCard key={item.product} item={item} />
        ))}
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography color="text.secondary">
              Subtotal
            </Typography>

            <Typography variant="h5" fontWeight={700}>
              Rs. {Number(cart.subtotal || 0).toLocaleString()}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              onClick={() => clearCart()}
              disabled={isProcessing}
              sx={{ flex: 1, fontWeight: 600, textTransform: "none" }}
            >
              {isClearing ? <CircularProgress size={18} /> : "Clear Cart"}
            </Button>

            <Button
              variant="contained"
              onClick={() => checkout()}
              disabled={isProcessing}
              sx={{ flex: 1, fontWeight: 600, textTransform: "none" }}
            >
              {isCheckingOut ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Checkout"
              )}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}