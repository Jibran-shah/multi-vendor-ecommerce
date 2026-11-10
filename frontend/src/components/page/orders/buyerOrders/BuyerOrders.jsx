import { Typography, Grid, Box } from "@mui/material";

import OrderCard from "../OrderCard";

import { useMyBuyerOrders } from "../../../../hooks/api/buyerOrders/buyerOrder.hooks";

export default function BuyerOrders({
  onSelectOrder,
}) {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useMyBuyerOrders();

  if (isLoading) {
    return <Typography>Loading orders...</Typography>;
  }

  if (error) {
    return <Typography>Error loading orders</Typography>;
  }

  return (
    <Box sx={{
      display:"flex",
      flex:1,
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center"
    }}>
      <Grid container spacing={2}>
        {orders.length === 0 ? (
          <Typography>No orders found</Typography>
        ) : (
          orders.map((order) => (
            <Grid size={12}>
              <OrderCard
                key={order._id}
                order={order}
                onClick={() =>
                  onSelectOrder(order._id)
                }
              />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}