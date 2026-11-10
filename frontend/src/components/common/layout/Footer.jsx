import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  GitHub,
} from "@mui/icons-material";

const socialLinks = [
  { label: "Facebook", icon: Facebook },
  { label: "Twitter", icon: Twitter },
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: LinkedIn },
  { label: "GitHub", icon: GitHub },
];

/** @type {import("@mui/material").SxProps} */
const footerStyles = {
  px: { xs: 2, sm: 3, md: 4 },
  py: 4,
  borderTop: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
};

/** @type {import("@mui/material").SxProps} */
const contentStyles = {
  width: "100%",
  maxWidth: 1440,
  mx: "auto",
};

/** @type {import("@mui/material").SxProps} */
const brandStyles = {
  fontWeight: 800,
  letterSpacing: "-1.5px",
  "& span": {
    color: "primary.main",
  },
};

/** @type {import("@mui/material").SxProps} */
const taglineStyles = {
  maxWidth: 500,
  color: "text.secondary",
  lineHeight: 1.7,
};

/** @type {import("@mui/material").SxProps} */
const socialStyles = {
  alignItems: "center",
};

/** @type {import("@mui/material").SxProps} */
const socialButtonStyles = {
  color: "text.secondary",
  "&:hover": {
    color: "primary.main",
    bgcolor: "action.hover",
  },
};

/** @type {import("@mui/material").SxProps} */
const copyrightStyles = {
  color: "text.secondary",
};

export default function Footer() {
  return (
    <Box component="footer" sx={footerStyles}>
      <Stack spacing={2.5} sx={contentStyles}>
        <Typography variant="h5" sx={brandStyles}>
          markaz<span>.</span>
        </Typography>

        <Typography variant="body2" sx={taglineStyles}>
          Discover products, connect with people, and find
          everything you need in one place.
        </Typography>

        <Stack direction="row" spacing={0.5} sx={socialStyles}>
          {socialLinks.map(({ label, icon: Icon }) => (
            <IconButton
              key={label}
              aria-label={label}
              size="small"
              sx={socialButtonStyles}
            >
              <Icon fontSize="small" />
            </IconButton>
          ))}
        </Stack>

        <Divider />

        <Typography variant="body2" sx={copyrightStyles}>
          © {new Date().getFullYear()} Markaz. All rights reserved.
        </Typography>
      </Stack>
    </Box>
  );
}