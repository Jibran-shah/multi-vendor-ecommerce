import {
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const styles = {
  input: {
    minWidth: 180,
  },
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={styles.input}
      slotProps={{
        input:{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }
      }}
    />
  );
}