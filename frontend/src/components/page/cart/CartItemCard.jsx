import { useEffect, useState } from "react";

import {
  Box,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

import {
  useRemoveCartItem,
  useUpdateCartItem,
} from "../../../hooks/api/cart/cart.hooks";

const cardSx = {
  p: 2,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  transition: "0.2s ease",
  opacity: (theme) => theme.transitions.create("opacity"),
  "&:hover": {
    borderColor: "primary.main",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  },
};

const contentSx = {
  display: "flex",
  alignItems: "center",
  gap: 2,
};

const imageSx = {
  width: 72,
  height: 72,
  flexShrink: 0,
  objectFit: "contain",
  borderRadius: 1.5,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.default",
};

const infoSx = {
  flex: 1,
  minWidth: 0,
};

const nameSx = {
  fontSize: 15,
  fontWeight: 600,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const shopSx = {
  fontSize: 12,
  color: "text.secondary",
  mt: 0.25,
};

const priceSx = {
  fontSize: 13,
  color: "text.secondary",
  mt: 0.75,
};

const rightSx = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  flexShrink: 0,
};

const quantitySx = {
  display: "flex",
  alignItems: "center",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  overflow: "hidden",
};

const quantityButtonSx = {
  width: 30,
  height: 30,
  borderRadius: 0,
  color: "text.secondary",
  "&:hover": {
    bgcolor: "action.hover",
  },
};

const quantityValueSx = {
  minWidth: 32,
  textAlign: "center",
  fontSize: 14,
  fontWeight: 600,
};

const totalSx = {
  minWidth: 100,
  textAlign: "right",
  fontSize: 15,
  fontWeight: 700,
};

const actionsSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
};

export default function CartItemCard({ item }) {
  const { mutate: removeItem, isPending: isRemoving } =
    useRemoveCartItem();
  const { mutate: updateItem, isPending: isUpdating } =
    useUpdateCartItem();

  const [quantity, setQuantity] = useState(item.quantity);

  const isDirty = quantity !== item.quantity;
  const isDisabled = isRemoving || isUpdating;

  useEffect(() => {
    if (!isDirty) {
      setQuantity(item.quantity);
    }
  }, [item.quantity, isDirty]);

  const handleUpdate = () => {
    updateItem({
      productId: item.product._id,
      quantity,
    });
  };

  const product = item.product;
  const productName = product?.name || item.name || "Product";
  const productImage = product?.images?.[0]?.file?.url;
  const shopName = product?.shop?.name;

  const price = Number(item.price) || 0;
  const total = price * quantity;

  return (
    <Paper
      elevation={0}
      sx={{
        ...cardSx,
        opacity: isRemoving ? 0.5 : 1,
      }}
    >
      <Box sx={contentSx}>
        {productImage && (
          <Box
            component="img"
            src={productImage}
            alt={productName}
            sx={imageSx}
          />
        )}

        <Box sx={infoSx}>
          <Typography sx={nameSx}>
            {productName}
          </Typography>

          {shopName && (
            <Typography sx={shopSx}>
              {shopName}
            </Typography>
          )}

          <Typography sx={priceSx}>
            Rs. {price.toLocaleString()} × {quantity}
          </Typography>
        </Box>

        <Box sx={rightSx}>
          <Box sx={quantitySx}>
            <IconButton
              size="small"
              onClick={() =>
                setQuantity((prev) => Math.max(1, prev - 1))
              }
              disabled={isDisabled || quantity <= 1}
              sx={quantityButtonSx}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <Typography sx={quantityValueSx}>
              {quantity}
            </Typography>

            <IconButton
              size="small"
              onClick={() =>
                setQuantity((prev) => prev + 1)
              }
              disabled={isDisabled}
              sx={quantityButtonSx}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography sx={totalSx}>
            Rs. {total.toLocaleString()}
          </Typography>

          {isDirty ? (
            <IconButton
              size="small"
              color="primary"
              onClick={handleUpdate}
              disabled={isDisabled}
              title="Update quantity"
            >
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {isUpdating ? "..." : "Save"}
              </Typography>
            </IconButton>
          ) : (
            <IconButton
              size="small"
              color="error"
              onClick={() => removeItem(item.product)}
              disabled={isDisabled}
              sx={actionsSx}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Paper>
  );
}