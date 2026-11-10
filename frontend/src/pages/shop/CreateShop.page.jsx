import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ShopForm from "../../components/page/shop/ShopForm";

import { useCreateShop } from "../../hooks/api/shop/shop.hooks";
import { shopSchema } from "../../schemas/shop.schema";
import { useGeoLocation } from "../../hooks/ui/useGeoLocation";
import { buildShopFormData } from "../../utils/form/shopFormData";

export default function CreateShopPage() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: shopSchema.parse({}),
  });

  const createMutation = useCreateShop();

  const {
    status: locationStatus,
    error: locationError,
  } = useGeoLocation(form.setValue);

  const onSubmit = (values) => {
    if (createMutation.isPending) return;
    console.log(values);
    const payload = buildShopFormData(values);
    createMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/profile");
      },
    });
  };

  return (
    <Box sx={{ p: 4, display:"flex", justifyContent:"center", alignItems:"center" }}>
      <ShopForm
        form={form}
        onSubmit={onSubmit}
        isLoading={createMutation.isPending}
        submitText="Create Shop Profile"
        locationStatus={locationStatus}
        locationError={locationError}
      />
    </Box>
  );
}