import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../utils/queryKeys";
import {
  bulkDeleteShops,
  createShop,
  deleteShop,
  getAllShops,
  getMyShop,
  getShopById,
  updateShop
} from "../../../services/shop/shop.service";
import { useDispatch } from "react-redux";
import { login } from "../../../store/slices/auth.slice";

export const useBulkDeleteShops = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteShops,
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: queryKeys.shop.all
      });
    }
  });
};

export const useCreateShop = () => {
  const dispatch = useDispatch()
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createShop,
    onSuccess: (data) => {
      dispatch(login(data.user));
      qc.invalidateQueries({
        queryKey: queryKeys.shop.me()
      });
    }
  });
};

export const useDeleteShop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteShop,
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: queryKeys.shop.all
      });
    }
  });
};

export const useMyShop = () => {
  return useQuery({
    queryKey: queryKeys.shop.me(),
    queryFn: async ()=> await getMyShop(),
    staleTime: 5 * 60 * 1000
  });
};

export const useShop = (id) => {
  return useQuery({
    queryKey: queryKeys.shop.detail(id),
    queryFn: async () => await getShopById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useShops = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.shop.list(filters),
    queryFn: async ()=> await getAllShops(filters),
    staleTime: 5 * 60 * 1000
  });
};

export const useUpdateShop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateShop,
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: queryKeys.shop.me()
      });
    }
  });
};