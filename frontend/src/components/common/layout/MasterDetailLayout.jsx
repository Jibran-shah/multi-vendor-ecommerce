import { useState } from "react";
import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function MasterDetailLayout({
  sidebar,
  main,
  hasSelection,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showMain, setShowMain] = useState(false);
  const openMain = () => setShowMain(true);
  const closeMain = () => setShowMain(false);

  const sidebarContent =
    typeof sidebar === "function" ? sidebar(openMain) : sidebar;

if (!isMobile) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "stretch",
        gap: 2,
        flex:1
      }}
    >
      {sidebarContent}
      <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden", display:"flex" }}>
        {main}
      </Box>
    </Box>
  );
}

  return (
    <Box sx={{ width: "100%", height: "100%"}}>
      {showMain && hasSelection ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ p: 1, borderBottom: 1, borderColor: "divider" }}>
            <IconButton onClick={closeMain} size="small">
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", display:"flex"}}>
            {main}
          </Box>
        </Box>
      ) : (
        sidebarContent
      )}
    </Box>
  );
}