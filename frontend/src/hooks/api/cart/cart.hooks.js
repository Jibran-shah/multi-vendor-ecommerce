import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../utils/queryKeys";
import { addToCart } from "../../../services/cart/cart.service";
import { getCart } from "../../../services/cart/cart.service";
import { clearCart } from "../../../services/cart/cart.service";
import { removeCartItem } from "../../../services/cart/cart.service";
import { updateCartItem } from "../../../services/cart/cart.service";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity = 1 }) => {
      const res = await addToCart({ productId, quantity });
      return res;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.all,
      });
    }
  });
};

export const useCart = () => {
  return useQuery({
    queryKey: queryKeys.cart.detail(),
    queryFn: async () => {
      const res = await getCart();
      return res.data;
    }
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await clearCart();
      return res;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.all,
      });
    }
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId) => {
      const res = await removeCartItem(itemId);
      return res;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.all,
      });
    }
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => await updateCartItem(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.all,
      });
    }
  });
};