import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../utils/queryKeys";
import {
  cancelShopOrder,
  markAsDelivered,
  markAsProcessing,
  markAsShipped,
  getMyShopOrders,
  getShopOrderById,
  updateShopOrderStatus,
} from "../../../services/shopOrders/shopOrder.service";

export const useCancelShopOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      console.log("[useCancelShopOrder] start:", id);

      const res = await cancelShopOrder(id);

      console.log("[useCancelShopOrder] response:", res);

      return res;
    },

    onSuccess: (data) => {
      console.log("[useCancelShopOrder] success:", data);

      queryClient.invalidateQueries({
        queryKey: queryKeys.shopOrders.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all,
      });

      console.log("[useCancelShopOrder] cache invalidated");
    },

    onError: (err) => {
      console.error("[useCancelShopOrder] error:", err);
    },
  });
};

/* -------------------- MARK DELIVERED -------------------- */
export const useMarkAsDelivered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      console.log("[useMarkAsDelivered] start:", id);

      const res = await markAsDelivered(id);

      console.log("[useMarkAsDelivered] response:", res);

      return res;
    },

    onSuccess: (data) => {
      console.log("[useMarkAsDelivered] success:", data);

      queryClient.invalidateQueries({
        queryKey: queryKeys.shopOrders.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all,
      });

      console.log("[useMarkAsDelivered] cache invalidated");
    },

    onError: (err) => {
      console.error("[useMarkAsDelivered] error:", err);
    },
  });
};

/* -------------------- MARK PROCESSING -------------------- */
export const useMarkAsProcessing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      console.log("[useMarkAsProcessing] start:", id);

      const res = await markAsProcessing(id);

      console.log("[useMarkAsProcessing] response:", res);

      return res;
    },

    onSuccess: (data) => {
      console.log("[useMarkAsProcessing] success:", data);

      queryClient.invalidateQueries({
        queryKey: queryKeys.shopOrders.all,
      });

      console.log("[useMarkAsProcessing] cache invalidated");
    },

    onError: (err) => {
      console.error("[useMarkAsProcessing] error:", err);
    },
  });
};

/* -------------------- MARK SHIPPED -------------------- */
export const useMarkAsShipped = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      console.log("[useMarkAsShipped] start:", id);

      const res = await markAsShipped(id);

      console.log("[useMarkAsShipped] response:", res);

      return res;
    },

    onSuccess: (data) => {
      console.log("[useMarkAsShipped] success:", data);

      queryClient.invalidateQueries({
        queryKey: queryKeys.shopOrders.all,
      });

      console.log("[useMarkAsShipped] cache invalidated");
    },

    onError: (err) => {
      console.error("[useMarkAsShipped] error:", err);
    },
  });
};

/* -------------------- MY SELLER ORDERS -------------------- */
export const useMyShopOrders = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.shopOrders.my(filters),

    queryFn: async () => {
      console.log("[useMyShopOrders] fetching:", filters);

      const res = await getMyShopOrders(filters);

      console.log("[useMyShopOrders] response:", res);
      console.log("[useMyShopOrders] data:", res?.data);

      return res?.data;
    },

    onError: (err) => {
      console.error("[useMyShopOrders] error:", err);
    },
  });
};

/* -------------------- SINGLE SELLER ORDER -------------------- */
export const useShopOrder = (id) => {
  return useQuery({
    queryKey: queryKeys.shopOrders.detail(id),
    enabled: !!id,

    queryFn: async () => {
      console.log("[useShopOrder] fetching id:", id);

      const res = await getShopOrderById(id);

      console.log("[useShopOrder] response:", res);
      console.log("[useShopOrder] data:", res?.data);

      return res?.data;
    },

    onError: (err) => {
      console.error("[useShopOrder] error:", err);
    },
  });
};

/* -------------------- UPDATE ORDER STATUS -------------------- */
export const useUpdateShopOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      console.log("[useUpdateShopOrderStatus] start:", { id, data });

      const res = await updateShopOrderStatus(id, data);

      console.log("[useUpdateShopOrderStatus] response:", res);

      return res;
    },

    onSuccess: (data, variables) => {
      console.log("[useUpdateShopOrderStatus] success:", data);

      queryClient.invalidateQueries({
        queryKey: queryKeys.shopOrders.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.shopOrders.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all,
      });

      console.log("[useUpdateShopOrderStatus] cache invalidated");
    },

    onError: (err) => {
      console.error("[useUpdateShopOrderStatus] error:", err);
    },
  });
};