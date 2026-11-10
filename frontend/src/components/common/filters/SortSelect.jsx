import {
  Box,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const defaultOptions = [
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
];

/** @type {import("@mui/material").SxProps} */
const containerStyles = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  height: 40,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  backgroundColor: "background.paper",
  transition: "border-color 0.15s ease",
  pl:2,
  "&:hover": {
    borderColor: "text.secondary",
  },

  "&:focus-within": {
    borderColor: "primary.main",
  },
};

/** @type {import("@mui/material").SxProps} */
const labelStyles = {
  color: "text.secondary",
  fontSize: 14,
  whiteSpace: "nowrap",
};

/** @type {import("@mui/material").SxProps} */
const selectStyles = {
  minWidth: 0,

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "& .MuiSelect-select": {
    px: 0,
    py: 0,
  },
};

export default function SortSelect({
  value,
  onChange,
  options = defaultOptions,
}) {
  return (
    <Box sx={containerStyles}>
      <Typography sx={labelStyles}>
        Sort by
      </Typography>

      <Select
        size="small"
        value={value || "-createdAt"}
        onChange={(e) => onChange(e.target.value)}
        sx={selectStyles}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}