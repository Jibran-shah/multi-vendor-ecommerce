import {
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

const journeys = [
  {
    title: "For Buyers",
    description: "Find and purchase products with ease.",
    icon: ShoppingBagOutlinedIcon,
    steps: [
      "Explore available products",
      "Search or browse categories",
      "Compare prices and details",
      "Add products to your cart",
      "Place your order",
      "Complete secure checkout",
    ],
  },
  {
    title: "For Sellers",
    description: "Start selling and grow your business.",
    icon: StorefrontOutlinedIcon,
    steps: [
      "Create your seller account",
      "Set up your shop profile",
      "Add products with images",
      "Set prices and availability",
      "Publish your products",
      "Start receiving orders",
    ],
  },
  {
    title: "Order Management",
    description: "A simple process from purchase to delivery.",
    icon: LocalShippingOutlinedIcon,
    steps: [
      "Receive order notifications",
      "Review order details",
      "Confirm and process orders",
      "Prepare products for shipping",
      "Ship orders to customers",
      "Complete order fulfillment",
    ],
  },
];

/** @type {import("@mui/material").SxProps} */
const sectionSx = {
  width: "100%",
};

/** @type {import("@mui/material").SxProps} */
const headerSx = {
  maxWidth: 620,
  mb: 5,
};

/** @type {import("@mui/material").SxProps} */
const eyebrowSx = {
  color: "primary.main",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.5,
  textTransform: "uppercase",
};

/** @type {import("@mui/material").SxProps} */
const titleSx = {
  fontWeight: 750,
  letterSpacing: "-1px",
  lineHeight: 1.2,
};

/** @type {import("@mui/material").SxProps} */
const descriptionSx = {
  color: "text.secondary",
  lineHeight: 1.7,
  fontSize: "0.95rem",
};

/** @type {import("@mui/material").SxProps} */
const cardSx = {
  height: "100%",
  p: { xs: 2.5, sm: 3 },
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  bgcolor: "background.paper",
  transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    borderColor: "primary.main",
    transform: "translateY(-4px)",
    boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
  },
};

/** @type {import("@mui/material").SxProps} */
const iconWrapperSx = {
  width: 46,
  height: 46,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 1.5,
  bgcolor: "action.hover",
  color: "primary.main",
};

/** @type {import("@mui/material").SxProps} */
const cardTitleSx = {
  fontWeight: 700,
  fontSize: "1.2rem",
};

/** @type {import("@mui/material").SxProps} */
const cardDescriptionSx = {
  color: "text.secondary",
  fontSize: "0.85rem",
  lineHeight: 1.5,
};

/** @type {import("@mui/material").SxProps} */
const stepSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
};

/** @type {import("@mui/material").SxProps} */
const stepNumberSx = {
  width: 29,
  height: 29,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 1,
  bgcolor: "action.hover",
  color: "text.secondary",
  fontSize: 12,
  fontWeight: 700,
};

/** @type {import("@mui/material").SxProps} */
const stepTextSx = {
  color: "text.primary",
  fontSize: "0.875rem",
  fontWeight: 500,
  lineHeight: 1.5,
};

function JourneyCard({ journey }) {
  const Icon = journey.icon;

  return (
    <Stack spacing={2.5} sx={cardSx}>
      <Stack direction="row" spacing={1.75} alignItems="center">
        <Box sx={iconWrapperSx}>
          <Icon />
        </Box>

        <Box>
          <Typography sx={cardTitleSx}>
            {journey.title}
          </Typography>

          <Typography sx={cardDescriptionSx}>
            {journey.description}
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          height: "1px",
          bgcolor: "divider",
        }}
      />

      <Stack spacing={1.5}>
        {journey.steps.map((step, index) => (
          <Stack key={step} direction="row" sx={stepSx}>
            <Box sx={stepNumberSx}>
              {String(index + 1).padStart(2, "0")}
            </Box>

            <Typography sx={stepTextSx}>
              {step}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default function HowItWorks() {
  return (
    <Box sx={sectionSx}>
      <Stack spacing={1.25} sx={headerSx}>
        <Typography sx={eyebrowSx}>
          Simple & Convenient
        </Typography>

        <Typography variant="h4" sx={titleSx}>
          How Markaz Works
        </Typography>

        <Typography sx={descriptionSx}>
          Whether you're shopping for your favorite products or
          starting your own online shop, Markaz makes buying and
          selling simple.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {journeys.map((journey) => (
          <Grid key={journey.title} size={{ xs: 12, md: 6, lg: 4 }}>
            <JourneyCard journey={journey} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}