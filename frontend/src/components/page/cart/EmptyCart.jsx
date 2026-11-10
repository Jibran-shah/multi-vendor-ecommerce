import {
  Box,
  Typography,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex:1
      }}
    >
      <Typography variant="h5">
        Your cart is empty
      </Typography>

      <Button
        sx={{ mt: 2 }}
        variant="contained"
        onClick={() => navigate("/products")}
      >
        Browse Products
      </Button>
    </Box>
  );
}