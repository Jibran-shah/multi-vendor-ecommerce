import { apiClient } from "../apiClient";

export const createProduct = async (data) => {
  const res = await apiClient.post("/products", data );
  return res.data;
};

export const getProducts = async (params) => {
  const res = await apiClient.get("/products", { params });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await apiClient.get(`/products/${id}`);
  return res.data;
};

export const getProductsByCategory = async (categoryId) => {
  const res = await apiClient.get(`/products/category/${categoryId}`);
  return res.data;
};

export const getMyShopProducts = async () => {
  const res = await apiClient.get("/products/shop/me");
  return res.data;
};

export const updateProduct = async ({ id, data }) => {
  const res = await apiClient.patch(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await apiClient.delete(`/products/${id}`);
  return res.data;
};