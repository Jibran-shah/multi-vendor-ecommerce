import { Button, Stack, Typography, Box } from "@mui/material";

/** @type {import("@mui/material").SxProps} */
const sectionStyles = {
  width: "100%",
  p: { xs: 3, sm: 5, md: 7 },
  borderRadius: 3,
  bgcolor: "primary.main",
  color: "primary.contrastText",
};

/** @type {import("@mui/material").SxProps} */
const contentStyles = {
  maxWidth: 720,
};

/** @type {import("@mui/material").SxProps} */
const titleStyles = {
  fontWeight: 700,
  lineHeight: 1.2,
  fontSize: { xs: "2rem", md: "2.8rem" },
};

/** @type {import("@mui/material").SxProps} */
const descriptionStyles = {
  maxWidth: 600,
  opacity: 0.9,
  lineHeight: 1.7,
};

/** @type {import("@mui/material").SxProps} */
const buttonStyles = {
  px: 3,
  py: 1.25,
  bgcolor: "background.paper",
  color: "primary.main",
  "&:hover": {
    bgcolor: "action.hover",
  },
};

export default function VendorCTASection({ onSellClick }) {
  return (
    <Box sx={sectionStyles}>
      <Stack spacing={2.5} sx={contentStyles}>
        <Typography variant="overline" fontWeight={700}>
          GROW YOUR BUSINESS WITH BAZAR
        </Typography>

        <Typography variant="h3" sx={titleStyles}>
          Have products to sell?
          <br />
          Start selling on Bazar.
        </Typography>

        <Typography sx={descriptionStyles}>
          Bring your products to Bazar, reach more customers, and grow
          your business with a marketplace built to help you sell.
        </Typography>

        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={onSellClick}
            sx={buttonStyles}
          >
            Start Selling
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}