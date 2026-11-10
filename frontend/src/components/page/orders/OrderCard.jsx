import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

const cardSx = {
  p: 2,
  cursor: "pointer",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  transition: "0.2s ease",
  "&:hover": {
    borderColor: "primary.main",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  },
};

const summarySx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  pb: 1.5,
  borderBottom: "1px solid",
  borderColor: "divider",
};

const summaryItemSx = {
  display: "flex",
  alignItems: "baseline",
  gap: 0.5,
};

const labelSx = {
  fontSize: 12,
  color: "text.secondary",
};

const valueSx = {
  fontSize: 15,
  fontWeight: 600,
};

const statusSx = {
  height: 26,
  px: 1,
  fontSize: 12,
  fontWeight: 600,
  textTransform: "capitalize",
  bgcolor: "action.hover",
};

const itemsSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  pt: 1.5,
};

const itemSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  minWidth: 0,
};

const imageSx = {
  width: 48,
  height: 48,
  flexShrink: 0,
  objectFit: "contain",
  borderRadius: 1,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
};

const itemInfoSx = {
  flex: 1,
  minWidth: 0,
};

const itemNameSx = {
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const secondarySx = {
  fontSize: 12,
  color: "text.secondary",
};

const itemPriceSx = {
  fontSize: 14,
  fontWeight: 600,
  flexShrink: 0,
};

const moreItemsSx = {
  pt: 0.25,
  fontSize: 12,
  color: "primary.main",
  fontWeight: 500,
};

export default function OrderCard({ order, onClick }) {
  const items = order.items || [];

  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={cardSx}
    >
      {/* SUMMARY */}
      <Box sx={summarySx}>
        <Box sx={summaryItemSx}>
          <Typography sx={labelSx}>
            Total Items  
          </Typography>

          <Typography sx={valueSx}>
            {items.length}
          </Typography>
        </Box>

        <Box sx={summaryItemSx}>
          <Typography sx={labelSx}>
            Total Cost  
          </Typography>

          <Typography sx={valueSx}>
            ${Number(order.totalAmount || 0).toLocaleString()}
          </Typography>
        </Box>

        <Chip
          label={order.status}
          size="small"
          sx={statusSx}
        />
      </Box>

      {/* ITEMS */}
      <Box sx={itemsSx}>
        {items.map((item, index) => {
          const quantity = item.quantity || 0;
          const price = Number(item.price) || 0;
          const subtotal = price * quantity;
          const image = item.product?.images?.[0]?.file?.url;

          return (
            <Box key={item._id || index} sx={itemSx}>
              {image && (
                <Box
                  component="img"
                  src={image}
                  alt={item.product?.name || "Product"}
                  sx={imageSx}
                />
              )}

              <Box sx={itemInfoSx}>
                <Typography sx={itemNameSx}>
                  {item.product?.name || "Product"}
                </Typography>

                <Typography sx={secondarySx}>
                  {item.shop?.name || "shop"}
                </Typography>

                <Typography sx={secondarySx}>
                  {quantity} × ${price.toLocaleString()}
                </Typography>
              </Box>

              <Typography sx={itemPriceSx}>
                ${subtotal.toLocaleString()}
              </Typography>
            </Box>
          );
        })}

        {items.length > 2 && (
          <Typography sx={moreItemsSx}>
            +{items.length - 2} more{" "}
            {items.length - 2 === 1 ? "item" : "items"}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}