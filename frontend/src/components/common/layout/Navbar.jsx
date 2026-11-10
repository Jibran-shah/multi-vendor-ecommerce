import {
  AppBar,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useProfile } from "../../../hooks/api/profile/profile.hooks";
import { useAvailableDashboards } from "../../../hooks/ui/useAvailableDashboards";

export default function Navbar() {
  const navigate = useNavigate();
  const [dashboardAnchor, setDashboardAnchor] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { data: profile } = useProfile({ enabled: isAuthenticated });
  const dashboards = useAvailableDashboards(user);

  const closeDashboards = () => setDashboardAnchor(null);

  return (
    <AppBar position="sticky" elevation={0} sx={appBarSx}>
      <Toolbar sx={toolbarSx}>
        <Typography
          variant="h5"
          onClick={() => navigate("/home")}
          sx={brandSx}
        >
          markaz<span>.</span>
        </Typography>

        <Box sx={navContainerSx}>
          <Button onClick={() => navigate("/products")} sx={navButtonSx}>
            Products
          </Button>

          <Button onClick={() => navigate("/chats")} sx={navButtonSx}>
            Chats
          </Button>

          {isAuthenticated && dashboards.length > 0 && (
            <>
              <Button
                onClick={(event) => setDashboardAnchor(event.currentTarget)}
                endIcon={<ArrowDropDownIcon />}
                sx={navButtonSx}
              >
                Dashboards
              </Button>

              <Menu
                anchorEl={dashboardAnchor}
                open={Boolean(dashboardAnchor)}
                onClose={closeDashboards}
              >
                {dashboards.map(({ key, label, route }) => (
                  <MenuItem
                    key={key}
                    onClick={() => {
                      closeDashboards();
                      navigate(route);
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>

        {isAuthenticated ? (
          <Avatar
            onClick={() => navigate("/profile")}
            src={profile?.avatar?.file?.url}
            sx={{ml:"auto", width:36, height:36}}
          />
        ) : (
          <Box sx={authActionsSx}>
            <Button
              size="small"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

            <Button
              size="small"
              variant="contained"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

/** @type {import("@mui/material").SxProps} */
const appBarSx = {
  bgcolor: "background.paper",
  borderBottom: 1,
  borderColor: "divider",
};

/** @type {import("@mui/material").SxProps} */
const toolbarSx = {
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  minHeight: 68,
  "& > :last-child": {
    justifySelf: "end",
  },
};

/** @type {import("@mui/material").SxProps} */
const brandSx = {
  width: "fit-content",
  fontWeight: 800,
  letterSpacing: "-1.5px",
  color: "text.primary",
  cursor: "pointer",
  "& span": {
    color: "primary.main",
  },
};

/** @type {import("@mui/material").SxProps} */
const navContainerSx = {
  display: "flex",
  alignItems: "center",
  gap: 3,
};

/** @type {import("@mui/material").SxProps} */
const navButtonSx = {
  minWidth: 0,
  px: 1,
  color: "text.primary",
  fontWeight: 500,
  textTransform: "none",
};

/** @type {import("@mui/material").SxProps} */
const authActionsSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};