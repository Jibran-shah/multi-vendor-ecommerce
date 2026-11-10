import { useState } from "react";
import ReportIcon from "@mui/icons-material/Report";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Box } from "@mui/material";
import MasterDetailLayout from "../../components/common/layout/MasterDetailLayout";
import DashboardActions from "../../components/page/dashboard/DashboardActions";

export default function AdminDashboardPage() {
  const [selected, setSelected] = useState(null);

  const actions = [
    {
      label: "All Reports",
      icon: <ReportIcon />,
      description: "View all user-submitted reports",
    },
    {
      label: "Product Reports",
      icon: <StoreIcon />,
      description: "Reports related to products (fake, spam, abuse)",
    },
    {
      label: "shop Reports",
      icon: <PersonIcon />,
      description: "Reports against product shops",
    },
    {
      label: "Withdraw Requests",
      icon: <PaymentsIcon />,
      description: "Handle payout requests from shops & providers",
    },
    {
      label: "Wallet Transactions",
      icon: <AccountBalanceWalletIcon />,
      description: "All platform wallet movements & admin transfers",
    },
  ];

  return (
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
      main={
        <Box sx={{ p: 2 }}>
          {selected?.description && (
            <Box
              sx={{
                mt: 2,
                color: "text.secondary",
              }}
            >
              {selected.description}
            </Box>
          )}
        </Box>
      }
    />
  );
}