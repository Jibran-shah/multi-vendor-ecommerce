export const BUYER_ORDER_STATUS = Object.freeze({
  PENDING: "pending",
  PAID: "paid",
  PROCESSING: "processing",
  PARTIALLY_SHIPPED: "partially_shipped",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded"
});

export const BUYER_ORDER_STATUS_ARRAY = Object.freeze(
  Object.values(BUYER_ORDER_STATUS)
);

export const SHOP_ORDER_STATUS = Object.freeze({
  PENDING: "pending",
  PAID: "paid",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded"
});

export const SHOP_ORDER_STATUS_ARRAY = Object.freeze(
  Object.values(SHOP_ORDER_STATUS)
);