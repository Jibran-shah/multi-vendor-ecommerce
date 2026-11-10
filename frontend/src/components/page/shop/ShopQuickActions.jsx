import { Paper, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ShopQuickActions() {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Button onClick={() => navigate("/products/create")}>
          Add Product
        </Button>

        <Button onClick={() => navigate("/shop/products")}>
          My Products
        </Button>

        <Button onClick={() => navigate("/shop/orders")}>
          Orders
        </Button>

        <Button onClick={() => navigate("/profile")}>
          Profile
        </Button>
      </Stack>
    </Paper>
  );
}