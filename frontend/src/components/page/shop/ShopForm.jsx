import {
  Paper,
  Stack,
  Button,
  Typography,
} from "@mui/material";

import { InputField } from "../../common/InputField";
import FileInputField from "../../common/FileInputField";

export default function ShopForm({
  form,
  onSubmit,
  submitText = "Save",
  isLoading = false,
  locationStatus,
  locationError,
}) {
  
  const logoFile = form.watch("logoFile");
  const imageFiles = form.watch("imageFiles");

  return (
    <Paper
      component="form"
      onSubmit={form.handleSubmit(onSubmit)}
      sx={{
        p: 4,
        width: "100%",
        maxWidth: 600,
      }}
    >
      <Stack spacing={2}>
        {locationStatus === "requesting" && (
          <Typography variant="body2" color="text.secondary">
            Detecting your location...
          </Typography>
        )}

        {locationStatus === "granted" && (
          <Typography variant="body2" color="success.main">
            Location detected successfully
          </Typography>
        )}

        {locationError && (
          <Typography variant="body2" color="error">
            {locationError}
          </Typography>
        )}

        <InputField
          label="Shop Name"
          name="name"
          register={form.register}
          error={form.formState.errors.name}
        />

        <InputField
          label="Shop Description"
          name="description"
          register={form.register}
          error={form.formState.errors.description}
        />

        <FileInputField
          label="Logo"
          value={logoFile ? [logoFile] : []}
          onChange={(files) =>
            form.setValue("logoFile", files[0] ?? null, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          accept="image/*"
          maxSizeMB={5}
        />

        <FileInputField
          label="ImageFiles"
          value={imageFiles ?? []}
          onChange={(files) =>
            form.setValue("imageFiles", files, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          multiple
          maxFiles={5}
          maxSizeMB={5}
          accept="image/*"
        />

        <InputField
          label="Full Address"
          name="fullAddress"
          register={form.register}
          error={form.formState.errors.fullAddress}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          {submitText}
        </Button>
      </Stack>
    </Paper>
  );
}