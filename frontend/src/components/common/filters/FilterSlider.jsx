import {
  Box,
  Slider,
  Typography,
} from "@mui/material";

const styles = {
  container: {
    width: "100%",
  },
};

export default function FilterSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}) {
  const currentValue = Number(value ?? min);

  return (
    <Box sx={styles.container}>
      <Typography variant="caption">
        {label}: {currentValue}
      </Typography>

      <Slider
        value={currentValue}
        min={min}
        max={max}
        step={step}
        onChange={(_, value) => onChange(value)}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}