import { TextField } from "@mui/material";

export default function FilterNumberInput({
  label,
  value,
  onChange,
}) {
  return (
    <TextField
      fullWidth
      size="small"
      type="number"
      label={label}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}