import { Router } from "express";

import * as shopOrdersController from "./shopOrders.controller.js";

import {
  paramsShopOrderIdSchema,
  updateShopOrderStatusSchema,
  getShopOrdersQuerySchema
} from "./shopOrders.validation.js";

import { protect } from "../../../middlewares/protect.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const router = Router();

/* =========================
   GET MY SHOP ORDERS
========================= */
router.get(
  "/my",
  protect(),
  validate(getShopOrdersQuerySchema, "query"),
  asyncHandler(shopOrdersController.getMyShopOrders)
);

/* =========================
   GET SHOP ORDER BY ID
========================= */
router.get(
  "/:shopOrderId",
  protect(),
  validate(paramsShopOrderIdSchema, "params"),
  asyncHandler(shopOrdersController.getShopOrderById)
);

/* =========================
   UPDATE ORDER STATUS (SOURCE OF TRUTH)
========================= */
router.patch(
  "/:shopOrderId/status",
  protect(),
  validate(paramsShopOrderIdSchema, "params"),
  validate(updateShopOrderStatusSchema, "body"),
  asyncHandler(shopOrdersController.updateShopOrderStatus)
);

/* =========================
   LIFECYCLE SHORTCUTS (WRAPPERS ONLY)
   MUST MAP TO STATUS FLOW IN SERVICE
========================= */

router.patch(
  "/:shopOrderId/process",
  protect(),
  validate(paramsShopOrderIdSchema, "params"),
  asyncHandler(shopOrdersController.markAsProcessing)
);

router.patch(
  "/:shopOrderId/ship",
  protect(),
  validate(paramsShopOrderIdSchema, "params"),
  asyncHandler(shopOrdersController.markAsShipped)
);

router.patch(
  "/:shopOrderId/deliver",
  protect(),
  validate(paramsShopOrderIdSchema, "params"),
  asyncHandler(shopOrdersController.markAsDelivered)
);

/* =========================
   CANCEL ORDER
========================= */
router.patch(
  "/:shopOrderId/cancel",
  protect(),
  validate(paramsShopOrderIdSchema, "params"),
  asyncHandler(shopOrdersController.cancelShopOrder)
);

export default router;