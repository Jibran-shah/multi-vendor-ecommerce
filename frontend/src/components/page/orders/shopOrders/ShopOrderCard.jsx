import { Paper, Typography, Stack, Button } from "@mui/material";

export default function ShopOrderCard({ order }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <div>
          <Typography fontWeight={600}>
            shop Order #{order?._id}
          </Typography>

          <Typography variant="body2">
            Status: {order?.status}
          </Typography>

          <Typography variant="body2">
            Total: {order?.totalAmount}
          </Typography>

          <Typography variant="body2">
            Items: {order?.items?.length || 0}
          </Typography>
        </div>

        <Button variant="outlined">Manage</Button>
      </Stack>
    </Paper>
  );
}