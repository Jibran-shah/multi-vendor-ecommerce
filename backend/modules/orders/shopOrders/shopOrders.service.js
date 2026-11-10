import { ShopOrder } from "../../../models/ShopOrder.model.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError
} from "../../../errors/Http.error.js";

import { SHOP_ORDER_STATUS } from "../../../constants/order.constants.js";
import { releaseWalletEarning } from "../../finance/wallet/wallet.service.js";
import { MODELS } from "../../../constants/models.constants.js";
import { Shop } from "../../../models/Shop.model.js";

export const getMyShopOrders = async ({
  shopId,
  status,
  page = 1,
  limit = 10
}) => {


  const query = { shop: shopId };

  if (status) query.status = status;

  const shopOrders = await ShopOrder.find(query)
    .populate("buyer")
    .populate("paymentTransaction")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return shopOrders;
};

export const getShopOrderById = async ({
  shopOrderId,
  shopId
}) => {
  const order = await ShopOrder.findById(shopOrderId)
    .populate("buyer")
    .populate("buyerOrder")
    .populate("paymentTransaction");

  if (!order) {
    throw new NotFoundError("Shop order not found");
  }

  if (order.shop.toString() !== shopId.toString()) {
    throw new ForbiddenError("Not allowed to access this shop order");
  }

  return order;
};

/* =========================================================
   OWNERSHIP CHECK
========================================================= */
const assertOwnership = (order, shopId) => {
  if (order.shop.toString() !== shopId.toString()) {
    throw new ForbiddenError("Not allowed to modify this order");
  }
};

/* =========================================================
   UPDATE STATUS (STATE MACHINE ONLY)
   ❌ BLOCK DELIVERY HERE (ESCROW SAFETY)
========================================================= */
export const updateShopOrderStatus = async ({
  shopOrderId,
  shopId,
  status
}) => {
  const order = await ShopOrder.findById(shopOrderId);

  if (!order) {
    throw new NotFoundError("Shop order not found");
  }

  assertOwnership(order, shopId);

  // 🚨 ESCROW PROTECTION: prevent bypassing delivery flow
  if (status === SHOP_ORDER_STATUS.DELIVERED) {
    throw new BadRequestError(
      "Use markAsDelivered for delivery (escrow settlement required)"
    );
  }

  const validTransitions = {
    [SHOP_ORDER_STATUS.PAID]: [SHOP_ORDER_STATUS.PROCESSING],
    [SHOP_ORDER_STATUS.PROCESSING]: [SHOP_ORDER_STATUS.SHIPPED],
    [SHOP_ORDER_STATUS.SHIPPED]: [SHOP_ORDER_STATUS.DELIVERED]
  };

  if (
    !validTransitions[order.status]?.includes(status) &&
    order.status !== status
  ) {
    throw new BadRequestError("Invalid status transition");
  }

  order.status = status;
  await order.save();

  return order;
};

export const markAsDelivered = async ({
  shopOrderId,
  buyerId
}) => {
  const order = await ShopOrder.findById(shopOrderId);

  if (!order) {
    throw new NotFoundError("Shop order not found");
  }

  // ✅ MUST be the buyer of this order
  if (String(order.buyer) !== String(buyerId)) {
    throw new ForbiddenError("Only the buyer can confirm delivery");
  }

  if (order.status !== SHOP_ORDER_STATUS.SHIPPED) {
    throw new BadRequestError("Order must be shipped before delivery confirmation");
  }

  order.status = SHOP_ORDER_STATUS.DELIVERED;
  await order.save();


  const shop = await Shop.findById(order.shop);

  await releaseWalletEarning({
    userId: shop.user,
    amount: order.totalAmount,
    referenceId: order._id,
    referenceModel: MODELS.SHOP_ORDER
  });

  return order;
};
/* =========================================================
   CANCEL ORDER
========================================================= */
export const cancelShopOrder = async ({
  shopOrderId,
  shopId
}) => {
  const order = await ShopOrder.findById(shopOrderId);

  if (!order) {
    throw new NotFoundError("Shop order not found");
  }

  assertOwnership(order, shopId);

  if (
    order.status === SHOP_ORDER_STATUS.SHIPPED ||
    order.status === SHOP_ORDER_STATUS.DELIVERED
  ) {
    throw new BadRequestError("Cannot cancel after shipping");
  }

  order.status = SHOP_ORDER_STATUS.CANCELLED;
  await order.save();

  return order;
};

export const createShopOrdersFromBuyerOrder = async ({
  buyerOrder,
  paymentTransaction,
  session
}) => {
  const existing = await ShopOrder.findOne({
    buyerOrder: buyerOrder._id
  }).session(session);

  if (existing) return [existing];

  const shopMap = new Map();

  for (const item of buyerOrder.items) {
    const shopId = item.shop?.toString();

    if (!shopId) {
      throw new BadRequestError("Cart item missing shop reference");
    }

    if (!shopMap.has(shopId)) {
      shopMap.set(shopId, []);
    }

    shopMap.get(shopId).push(item);
  }

  const created = [];

  for (const [shopId, items] of shopMap.entries()) {
    const totalAmount = items.reduce(
      (sum, item) =>
        sum + (item.price || 0) * (item.quantity || 0),
      0
    );

    const [order] = await ShopOrder.create(
      [
        {
          buyerOrder: buyerOrder._id,
          buyer: buyerOrder.buyer,
          shop: shopId,
          items,
          totalAmount,
          status: SHOP_ORDER_STATUS.PAID,
          paymentTransaction
        }
      ],
      { session }
    );

    created.push(order);
  }

  return created;
};

export const markAsProcessing = async ({
  shopOrderId,
  shopId
}) => {
  const order = await ShopOrder.findById(shopOrderId);

  if (!order) {
    throw new NotFoundError("Shop order not found");
  }

  assertOwnership(order, shopId);

  if (order.status !== SHOP_ORDER_STATUS.PAID) {
    throw new BadRequestError("Order must be paid before processing");
  }

  order.status = SHOP_ORDER_STATUS.PROCESSING;
  await order.save();

  return order;
};


export const markAsShipped = async ({
  shopOrderId,
  shopId
}) => {
  const order = await ShopOrder.findById(shopOrderId);

  if (!order) {
    throw new NotFoundError("Shop order not found");
  }

  assertOwnership(order, shopId);

  if (order.status !== SHOP_ORDER_STATUS.PROCESSING) {
    throw new BadRequestError("Order must be processing before shipping");
  }

  order.status = SHOP_ORDER_STATUS.SHIPPED;
  await order.save();

  return order;
};


