import * as shopOrdersService from "./shopOrders.service.js";

export const getMyShopOrders = async (req, res) => {

  const shopId = req.user?.shop;

  if (!shopId) {
    throw new Error("Unauthorized: Shop not found");
  }

  const result = await shopOrdersService.getMyShopOrders({
    shopId,
    ...req.validated.query
  });

  res.status(200).json({
    success: true,
    message: "Shop orders fetched successfully",
    data: result
  });
};


export const getShopOrderById = async (req, res) => {
  const shopId = req.user?.shop;

  if (!shopId) {
    throw new Error("Unauthorized: Shop profile not found");
  }

  const result = await shopOrdersService.getShopOrderById({
    shopOrderId: req.validated.params.shopOrderId,
    shopId
  });

  res.status(200).json({
    success: true,
    message: "Shop order fetched successfully",
    data: result
  });
};

export const updateShopOrderStatus = async (req, res) => {
  const shopId = req.user?.shop;

  if (!shopId) {
    throw new Error("Unauthorized: Shop profile not found");
  }

  const result = await shopOrdersService.updateShopOrderStatus({
    shopOrderId: req.validated.params.shopOrderId,
    shopId,
    status: req.validated.body.status
  });

  res.status(200).json({
    success: true,
    message: "Shop order status updated successfully",
    data: result
  });
};

export const markAsProcessing = async (req, res) => {
  const shopId = req.user?.shop;

  const result = await shopOrdersService.markAsProcessing({
    shopOrderId: req.validated.params.shopOrderId,
    shopId
  });

  res.status(200).json({
    success: true,
    message: "Shop order marked as processing",
    data: result
  });
};

export const markAsShipped = async (req, res) => {
  const shopId = req.user?.shop;

  const result = await shopOrdersService.markAsShipped({
    shopOrderId: req.validated.params.shopOrderId,
    shopId
  });

  res.status(200).json({
    success: true,
    message: "Shop order marked as shipped",
    data: result
  });
};

export const markAsDelivered = async (req, res) => {
  const buyerId = req.user?.id; // ✅ buyer, not shop

  const result = await shopOrdersService.markAsDelivered({
    shopOrderId: req.validated.params.shopOrderId,
    buyerId
  });

  res.status(200).json({
    success: true,
    message: "Order marked as delivered by buyer confirmation",
    data: result
  });
};

/* =========================
   CANCEL ORDER
========================= */
export const cancelShopOrder = async (req, res) => {
  const shopId = req.user?.shop;

  if (!shopId) {
    throw new Error("Unauthorized: Shop profile not found");
  }

  const result = await shopOrdersService.cancelShopOrder({
    shopOrderId: req.validated.params.shopOrderId,
    shopId
  });

  res.status(200).json({
    success: true,
    message: "Shop order cancelled successfully",
    data: result
  });
};

