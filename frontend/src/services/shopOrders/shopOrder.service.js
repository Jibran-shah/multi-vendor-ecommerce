import { apiClient } from "../apiClient";

export const getMyShopOrders = (params) =>
  apiClient.get("/shopOrders/my", { params });

export const getShopOrderById = (shopOrderId) =>
  apiClient.get(`/shopOrders/${shopOrderId}`);

export const updateShopOrderStatus = (shopOrderId, data) =>
  apiClient.patch(`/shopOrders/${shopOrderId}/status`, data);

export const markAsProcessing = (shopOrderId) =>
  apiClient.patch(`/shopOrders/${shopOrderId}/process`);

export const markAsShipped = (shopOrderId) =>
  apiClient.patch(`/shopOrders/${shopOrderId}/ship`);

export const markAsDelivered = (shopOrderId) =>
  apiClient.patch(`/shopOrders/${shopOrderId}/deliver`);

export const cancelShopOrder = (shopOrderId) =>
  apiClient.patch(`/shopOrders/${shopOrderId}/cancel`);