import { Typography, Stack, Box } from "@mui/material";

import ShopOrderCard from "./ShopOrderCard";

import { useMyShopOrders } from "../../../../hooks/api/shopOrders/shopOrders.hooks";

export default function ShopOrders({
  onSelectOrder,
}) {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useMyShopOrders();

  if (isLoading) {
    return (
      <Box sx={containerSx}>
        <Typography>
          Loading orders...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={containerSx}>
        <Typography>
          Error loading orders.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={containerSx}>
      {orders.length === 0 ? (
        <Typography color="text.secondary">
          No shop orders found.
        </Typography>
      ) : (
        orders.map((order) => (
          <ShopOrderCard
            key={order._id}
            order={order}
            onClick={() =>
              onSelectOrder(order._id)
            }
          />
        ))
      )}
    </Stack>
  );
}


/**@type {import("@mui/material").SxProps}*/
const containerSx = {
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  width:"100%",
  height:"100%"
}