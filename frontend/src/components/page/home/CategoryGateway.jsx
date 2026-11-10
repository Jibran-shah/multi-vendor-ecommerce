import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

/** @type {import("@mui/material").SxProps} */
const containerStyles = {
  maxWidth: 600,
};

/** @type {import("@mui/material").SxProps} */
const headingStyles = {
  fontWeight: 700,
};

/** @type {import("@mui/material").SxProps} */
const descriptionStyles = {
  color: "text.secondary",
  maxWidth: 520,
};

/** @type {import("@mui/material").SxProps} */
const actionsStyles = {
  alignItems: "flex-start",
};

export default function CategoryGateway() {
  const navigate = useNavigate();

  return (
    <Stack spacing={2} sx={containerStyles}>
      <Typography variant="h4" sx={headingStyles}>
        Find What You Need
      </Typography>

      <Typography variant="body1" sx={descriptionStyles}>
        Explore products to buy or discover skilled professionals
        offering services that match your needs.
      </Typography>

      <Stack direction="row" spacing={2} sx={actionsStyles}>
        <Button
          variant="contained"
          onClick={() => navigate("/products")}
        >
          Search Products
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/services")}
        >
          Search Services
        </Button>
      </Stack>
    </Stack>
  );
}