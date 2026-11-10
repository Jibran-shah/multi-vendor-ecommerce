import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../utils/queryKeys";

// services
import {
  createProduct,
  deleteProduct,
  getMyShopProducts,
  getProductById,
  getProducts,
  getProductsByCategory,
  updateProduct
} from "../../../services/products/products.service";


/* =========================
   CREATE PRODUCT
========================= */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      console.log("[useCreateProduct] Mutation Payload:", data);
      return createProduct(data);
    },

    onSuccess: (data) => {
      console.log("[useCreateProduct] Success:", data);

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.shop()
      });
    },

    onError: (error) => {
      console.error("[useCreateProduct] Error:", error);
    }
  });
};

/* =========================
   DELETE PRODUCT
========================= */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      console.log("[useDeleteProduct] Product ID:", id);
      return deleteProduct(id);
    },

    onSuccess: (data) => {
      console.log("[useDeleteProduct] Success:", data);

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.shop()
      });
    },

    onError: (error) => {
      console.error("[useDeleteProduct] Error:", error);
    }
  });
};

/* =========================
   SELLER PRODUCTS
========================= */
export const useMyProducts = () => {
  return useQuery({
    queryKey: queryKeys.products.shop(),
    queryFn: async () => {
      console.log("[useMyProducts] Fetching...");
      const data = await getMyShopProducts();
      console.log("[useMyProducts] Response:", data);
      return data;
    },

    staleTime: 2 * 60 * 1000
  });
};

/* =========================
   PRODUCT BY ID
========================= */
export const useProductById = (id) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),

    queryFn: async () => {
      console.log("[useProductById] ID:", id);
      const data = await getProductById(id);
      console.log("[useProductById] Response:", data);
      return data;
    },

    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });
};

/* =========================
   ALL PRODUCTS (LIST)
========================= */
export const useProducts = (params = {},enabled) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: async () => await getProducts(params),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
    enabled
  });
};

/* =========================
   BY CATEGORY
========================= */
export const useProductsByCategory = (categoryId) => {
  return useQuery({
    queryKey: queryKeys.products.byCategory(categoryId),

    queryFn: async () => {
      console.log("[useProductsByCategory] Category ID:", categoryId);
      const data = await getProductsByCategory(categoryId);
      console.log("[useProductsByCategory] Response:", data);
      return data;
    },

    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000
  });
};

/* =========================
   UPDATE PRODUCT
========================= */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      console.log("[useUpdateProduct] Payload:", payload);
      return updateProduct(payload);
    },

    onSuccess: (data, variables) => {
      console.log("[useUpdateProduct] Success:", data);
      console.log("[useUpdateProduct] Variables:", variables);

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.id)
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.shop()
      });
    },

    onError: (error) => {
      console.error("[useUpdateProduct] Error:", error);
    }
  });
};