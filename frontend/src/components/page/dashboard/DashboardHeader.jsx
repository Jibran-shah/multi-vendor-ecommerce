import { Paper, Typography, Stack, Chip } from "@mui/material";

export default function DashboardHeader({
  title,
  name,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
        <Typography variant="h5" fontWeight={700} sx={{
          mb:1
        }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back, {name}
        </Typography>
    </Paper>
  );
}