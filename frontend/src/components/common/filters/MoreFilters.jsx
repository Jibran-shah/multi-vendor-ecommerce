import {
  Button,
  Popover,
  Box,
  Stack,
} from "@mui/material";
import { useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";

import FilterSelect from "./FilterSelect";
import FilterSlider from "./FilterSlider";
import FilterNumberInput from "./FilterNumberInput";

const styles = {
  button: {
    flexShrink: 0,
    whiteSpace: "nowrap",
  },

  popover: {
    p: 2,
    width: 280,
  },
};

export default function MoreFilters({
  filters,
  onChange,
  fields = [],
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const update = (key, value) => {
    onChange(key, value);
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={<TuneIcon />}
        onClick={handleOpen}
        sx={styles.button}
      >
        More
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box sx={styles.popover}>
          <Stack spacing={1.5}>
            {fields.map((field) => {
              if (field.type === "select") {
                return (
                  <FilterSelect
                    key={field.key}
                    label={field.label}
                    value={filters[field.key]}
                    options={field.options}
                    onChange={(value) =>
                      update(field.key, value)
                    }
                  />
                );
              }

              if (field.type === "slider") {
                return (
                  <FilterSlider
                    key={field.key}
                    label={field.label}
                    value={filters[field.key]}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    onChange={(value) =>
                      update(field.key, value)
                    }
                  />
                );
              }

              if (field.type === "number") {
                return (
                  <FilterNumberInput
                    key={field.key}
                    label={field.label}
                    value={filters[field.key]}
                    onChange={(value) =>
                      update(field.key, value)
                    }
                  />
                );
              }

              return null;
            })}
          </Stack>
        </Box>
      </Popover>
    </>
  );
}