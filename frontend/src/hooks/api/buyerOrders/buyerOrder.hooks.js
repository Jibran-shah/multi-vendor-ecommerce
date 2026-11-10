import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../utils/queryKeys";
import { getBuyerOrderById, getMyBuyerOrders, cancelBuyerOrder } from "../../../services/buyerOrders/buyerOrders.service";

/* -------------------- SINGLE ORDER -------------------- */
export const useBuyerOrder = (id) => {
  return useQuery({
    queryKey: queryKeys.buyerOrders.detail(id),
    enabled: !!id,

    queryFn: async () => {
      const { data } = await getBuyerOrderById(id);
      return data;
    },

    onError: (err) => {
      console.error("[useBuyerOrder] error:", err);
    },
  });
};

/* -------------------- CANCEL ORDER -------------------- */
export const useCancelBuyerOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (buyerOrderId) => {
      const res = await cancelBuyerOrder(buyerOrderId);
      return res;
    },

    onSuccess: (data, buyerOrderId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.buyerOrders.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.buyerOrders.detail(buyerOrderId),
      });

    },

    onError: (err) => {
      console.error("[useCancelBuyerOrder] error:", err);
    },
  });
};

/* -------------------- MY ORDERS LIST -------------------- */
export const useMyBuyerOrders = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.buyerOrders.my(filters),

    queryFn: async () => {
      const { data } = await getMyBuyerOrders(filters);
      return data;
    },

    onError: (err) => {
      console.error("[useMyBuyerOrders] error:", err);
    },
  });
};