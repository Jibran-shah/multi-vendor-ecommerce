import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import NavBar from "../components/common/layout/Navbar";
import Footer from "../components/common/layout/Footer";

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Box component="main" sx={{ flex: 1, display:"flex" }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}