import { useState } from "react";
import { Box } from "@mui/material";

import MasterDetailLayout from "../../components/common/layout/MasterDetailLayout";

import DashboardActions from "../../components/page/dashboard/DashboardActions";
import Wallet from "../../components/page/wallet/Wallet";
import ProductCreateForm from "../../components/page/products/ProductCreateForm";
import MyProducts from "../../components/page/products/MyProducts";
import ShopOrders from "../../components/page/orders/shopOrders/ShopOrders";

export default function ShopDashboardPage() {

  const [selected, setSelected] = useState(null);

  const actions = [
    {
      label: "home",
      component: <DashboardHomeMain/>
    },
    {
      label: "Add Product",
      component:<ProductCreateForm/>
    },
    {
      label: "My Products",
      component: <MyProducts/>,
    },
    {
      label: "Orders",
      component: <ShopOrders 
        onSelectOrder={(id) => setSelectedOrderId(id) } />
    },
    {
      label: "Wallet",
      component: <Wallet/>,
    }
  ];

  return (
  <Box sx={{p:1}}>
    <MasterDetailLayout
      hasSelection={!!selected}
      sidebar={(openMain) => (
        <DashboardActions
          actions={actions}
          onSelectAction={(item) => {
            setSelected(item);
            openMain?.();
          }}
        />
      )}
      main={ selected?.component ?? null }
    />
  </Box>
  );
}