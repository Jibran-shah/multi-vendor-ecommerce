import { useState } from "react";

import MasterDetailLayout from "../../components/common/layout/MasterDetailLayout";
import DashboardActions from "../../components/page/dashboard/DashboardActions";
import BuyerOrderDetailDashboardView from "../../components/page/orders/buyerOrders/BuyerDashboardOrderDetailView";
import Cart from "../../components/page/dashboard/Cart";
import BuyerOrders from "../../components/page/orders/buyerOrders/BuyerOrders";

const actions = [
    {
      label: "Cart",
      description: "Items in your cart",
      component: <Cart />,
    },
    {
      label: "Orders",
      description: "Your order history",
      component: <BuyerOrders onSelectOrder={(orderId) => setSelectedOrderId(orderId)}/>
    }
  ];


export default function BuyerDashboardPage() {
  const [selected, setSelected] = useState(null);
  const [selectedOrderId, setSelectedOrderId] =
    useState(null)

  return (
    <MasterDetailLayout
      hasSelection={
        !!selected || !!selectedOrderId
      }
      sidebar={(openMain) => (
        <DashboardActions
          actions={actions}
          onSelectAction={(item) => {
            setSelectedOrderId(null);
            setSelected(item);
            openMain?.();
          }}
        />
      )}
      main={
        selectedOrderId ? (
          <BuyerOrderDetailDashboardView
            orderId={selectedOrderId}
            onBack={() =>
              setSelectedOrderId(null)
            }
          />
        ) : selected?.component && (
          selected.component
        )
      }
    />
  );
}