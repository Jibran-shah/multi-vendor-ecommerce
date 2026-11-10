import { apiClient } from "../apiClient";

export const createShop = async (data) => {
  const res = await apiClient.post("/shops", data);
  return res?.data ?? null;
};

export const getAllShops = async (params) => {
  const res = await apiClient.get("/shops", { params });
  return res?.data?.Shops ?? [];
};

export const getShopById = async (id) => {
  const res = await apiClient.get(`/shops/${id}`);
  return res?.data ?? null;
};

export const getMyShop = async () => {
  const res = await apiClient.get("/shops/me"); // fixed typo
  return res?.data ?? null;
};

export const updateShop = async ({ id, data }) => {
  const res = await apiClient.put(`/shops/${id}`, data);
  return res?.data?.shop ?? null;
};

export const deleteShop = async () => {
  const res = await apiClient.delete(`/shops`);
  return res?.data ?? null;
};

export const bulkDeleteShops = async (data) => {
  const res = await apiClient.post("/shops/bulk-delete", data);
  return res?.data ?? null;
};