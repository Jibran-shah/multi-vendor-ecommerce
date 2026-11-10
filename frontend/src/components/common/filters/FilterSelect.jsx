import {
  TextField,
  MenuItem,
} from "@mui/material";

export default function FilterSelect({
  label,
  value,
  options = [],
  onChange,
}) {
  return (
    <TextField
      fullWidth
      size="small"
      select
      label={label}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}