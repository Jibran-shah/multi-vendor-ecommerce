import { Box, Paper, CircularProgress, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useGetFullProfile } from "../../hooks/api/profile/profile.hooks";
import { useLogout } from "../../hooks/api/auth/auth.hooks";
import { logout } from "../../store/slices/auth.slice";

import ProfileHeader from "../../components/page/profile/ProfileHeader";
import ProfileInfoCard from "../../components/page/profile/ProfileInfoCard";
import ShopCard from "../../components/page/profile/ShopCard";
import ProfileActionsBar from "../../components/page/profile/ProfileActionsBar";

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);
  const targetUserId = userId || currentUser?.id;
  const isOwnProfile = currentUser?.id === targetUserId;

  const { data, isLoading, isError } = useGetFullProfile(targetUserId);
  const { mutate: logoutUser, isPending } = useLogout();

  if (isLoading) return <CircularProgress />;

  if (isError || !data) {
    return <Typography>Error loading profile</Typography>;
  }

  const { profile, user, shop } = data;

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        dispatch(logout());
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4, flex:1, alignSelf:"center" }}>
      <Paper
        sx={{
          maxWidth: 900,
          mx: "auto",
          overflow: "hidden",
        }}
      >
        <ProfileHeader
          coverUrl={profile?.cover?.file?.url}
          avatarUrl={profile?.avatar?.file?.url}
          profile={profile}
          user={user}
          shop={shop}
        />

        <Box
          sx={{
            p: 3,
            pt: 10,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <ProfileInfoCard profile={profile} />

          <ShopCard
            shop={shop}
            isOwnProfile={isOwnProfile}
            onEdit={() => navigate("/shop/edit")}
            onDelete={() => navigate("/shop/delete")}
            onCreate={() => navigate("/shop/create")}
          />

          <ProfileActionsBar
            isOwnProfile={isOwnProfile}
            userId={user?.id}
            currentUserId={currentUser?.id}
            isLoggingOut={isPending}
            onMessage={() => navigate(`/chats/new/${user.id}`)}
            onLogout={handleLogout}
            onDelete={() => {
              dispatch(logout());
              navigate("/profile/delete");
            }}
            onEdit={
              ()=>{
                navigate("/profile/edit");
              }
            }
          />
        </Box>
      </Paper>
    </Box>
  );
}