import {
  Stack,
  Typography,
  Avatar
} from "@mui/material";

export default function ShopInfo({
  profile
}) {
  return (
    <Stack spacing={3}>
      <Avatar
        src={profile?.logo?.url}
        sx={{
          width: 100,
          height: 100
        }}
      />

      <Typography variant="h4">
        {profile?.name}
      </Typography>

      <Typography>
        {profile?.description}
      </Typography>

      <Typography>
        {profile?.fullAddress}
      </Typography>

      <Typography>
        Rating: {profile?.averageRating ?? 0}
      </Typography>

      <Typography>
        Products: {profile?.productCount ?? 0}
      </Typography>

      <Typography>
        Approved: {profile?.isApproved ? "Yes" : "No"}
      </Typography>
    </Stack>
  );
}