import { Box } from "@mui/material";
import ShopForm from "../../components/page/shop/ShopForm";
import {useMyShop, useUpdateShop} from "../../hooks/api/shop/shop.hooks"
import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function EditShopPage() {

  const { data, isError, isLoading, error } = useMyShop()
  const {mutate} = useUpdateShop()
  const form = useForm({})

  useEffect(()=>{
    if(isError || isLoading)
      return
    form.reset({
      
    })
  },[isError, isLoading, form, data])

  if(isError){
    return(
      <Box>
        error loading shop info...
      </Box>
    )
  }

  if(isLoading){
    return(
      <Box>
        loading shop info...
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <ShopForm form={form}/>
    </Box>
  );
}