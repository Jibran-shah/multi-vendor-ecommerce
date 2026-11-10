import { Box, Stack } from "@mui/material";

import HeroSection from "../components/common/layout/HeroSection";
import CategoryGateway from "../components/page/home/CategoryGateway";
import FeaturedProducts from "../components/page/products/FeaturedProducts";
import HowItWorks from "../components/page/home/HowItWorks";
import TrustSafety from "../components/page/home/TrustAndSafety";
import VendorCTASection from "../components/page/home/VendorCTA";

import marketplaceImg from "../assets/images/marketplace.jpg";

/** @type {import("@mui/material").SxProps} */
const contentStyles = {
  width: "100%",
  maxWidth: 1440,
  mx: "auto",
  px: { xs: 2, sm: 3, md: 4 },
  py: { xs: 4, md: 6 },
};

export default function HomePage() {
  return (
    <Box sx={{
      flex:1
    }}>
      <HeroSection
        title="Discover Everything You Need"
        subtitle="Buy products"
        backgroundImage={marketplaceImg}
      />

      <Stack spacing={{ xs: 6, md: 8 }} sx={contentStyles}>
        <FeaturedProducts />
        <HowItWorks />
        <TrustSafety />
        <VendorCTASection />
      </Stack>
    </Box>
  );
}