import { Box, Grid, Stack, Typography } from "@mui/material";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

const trustBadges = [
  {
    icon: SecurityOutlinedIcon,
    title: "Secure Payments",
    description:
      "Shop with confidence through secure and protected transactions.",
  },
  {
    icon: VerifiedUserOutlinedIcon,
    title: "Trusted Sellers",
    description:
      "Discover shops and sellers you can feel confident buying from.",
  },
  {
    icon: ShieldOutlinedIcon,
    title: "Buyer Protection",
    description:
      "Enjoy a safer shopping experience with added purchase protection.",
  },
  {
    icon: SupportAgentOutlinedIcon,
    title: "Customer Support",
    description:
      "Get assistance whenever you need help with your shopping experience.",
  },
];

const reviews = [
  {
    text: "I found exactly what I was looking for. Browsing products and placing an order was simple and convenient.",
    name: "Happy Customer",
  },
  {
    text: "A great place to discover products from different sellers. The shopping experience is smooth and straightforward.",
    name: "Verified Customer",
  },
];

/** @type {import("@mui/material").SxProps} */
const headerStyles = {
  mb: 5,
  maxWidth: 600,
};

/** @type {import("@mui/material").SxProps} */
const titleStyles = {
  fontWeight: 700,
  lineHeight: 1.2,
};

/** @type {import("@mui/material").SxProps} */
const descriptionStyles = {
  color: "text.secondary",
  lineHeight: 1.6,
};

/** @type {import("@mui/material").SxProps} */
const badgeStyles = {
  height: "100%",
  p: 3,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    borderColor: "primary.main",
    boxShadow: 2,
  },
};

/** @type {import("@mui/material").SxProps} */
const iconStyles = {
  fontSize: 30,
  color: "primary.main",
};

/** @type {import("@mui/material").SxProps} */
const badgeTitleStyles = {
  fontWeight: 600,
};

/** @type {import("@mui/material").SxProps} */
const badgeDescriptionStyles = {
  color: "text.secondary",
  lineHeight: 1.6,
};

/** @type {import("@mui/material").SxProps} */
const reviewStyles = {
  height: "100%",
  p: 3,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
};

/** @type {import("@mui/material").SxProps} */
const reviewTextStyles = {
  color: "text.secondary",
  lineHeight: 1.7,
};

/** @type {import("@mui/material").SxProps} */
const reviewNameStyles = {
  fontWeight: 600,
};

function TrustBadge({ icon: Icon, title, description }) {
  return (
    <Stack spacing={1.5} sx={badgeStyles}>
      <Icon sx={iconStyles} />

      <Typography sx={badgeTitleStyles}>
        {title}
      </Typography>

      <Typography variant="body2" sx={badgeDescriptionStyles}>
        {description}
      </Typography>
    </Stack>
  );
}

function Review({ text, name }) {
  return (
    <Stack spacing={1.5} sx={reviewStyles}>
      <Typography sx={reviewTextStyles}>
        "{text}"
      </Typography>

      <Typography variant="body2" sx={reviewNameStyles}>
        — {name}
      </Typography>
    </Stack>
  );
}

export default function TrustSafety() {
  return (
    <Box>
      <Stack spacing={1} sx={headerStyles}>
        <Typography variant="h4" sx={titleStyles}>
          Shop with Confidence
        </Typography>

        <Typography sx={descriptionStyles}>
          Discover products, connect with trusted sellers, and enjoy
          a smooth shopping experience on Markaz.
        </Typography>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {trustBadges.map((badge) => (
          <Grid
            key={badge.title}
            size={{ xs: 12, sm: 6, md: 3 }}
          >
            <TrustBadge {...badge} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid
            key={review.name}
            size={{ xs: 12, md: 6 }}
          >
            <Review {...review} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}