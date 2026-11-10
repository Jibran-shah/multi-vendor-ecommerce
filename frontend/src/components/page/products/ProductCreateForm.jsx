import { Box, Paper, Typography, Stack, CircularProgress } from "@mui/material";
import ProductForm from "./ProductForm";
import { useProductForm } from "../../../hooks/form/product/useProduct.form.js"
import { useCreateProduct } from "../../../hooks/api/products/products.hooks";
import { toFormData } from "../../../utils/form/toFromData";
import { createProductSchema } from "../../../schemas/product.schema";

export default function ProductCreateForm() {
  const form = useProductForm(createProductSchema);
  const mutation = useCreateProduct();
  const handleSubmit = form.handleSubmit(
    (values) => {

      const files = {
        images: values.images,
      };

      const payload = toFormData({...values,category:values?.category?._id}, files);

      mutation.mutate(payload, {
        onSuccess: () => {
          form.reset();
        },
        onError: (err) => {
          console.error("Create Product Error:", err);
        },
      });
    },
    (errors) => {
      console.log("[VALIDATION FAILED]", errors);
    }
  );

  const isLoading = mutation.isPending;

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 900,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        p:3
      }}
    >
    {isLoading ? (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Creating product...
        </Typography>
      </Box>
    ) : (
      <ProductForm
        mode="create"
        onSubmit={handleSubmit}
        register={form.register}
        control={form.control}
        errors={form.formState.errors}
        loading={isLoading}
      />
    )}
    </Paper>
  );
}