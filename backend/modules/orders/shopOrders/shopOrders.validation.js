import Joi from "joi";
import { mongoIdSchema } from "../../../validationSchemas/mongodb.schemas.js";
import { SHOP_ORDER_STATUS_ARRAY } from "../../../constants/order.constants.js";

export const paramsShopOrderIdSchema = Joi.object({
  shopOrderId: mongoIdSchema.required().label("shopOrderId")
});

export const updateShopOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...SHOP_ORDER_STATUS_ARRAY)
    .required()
    .label("status")
    .messages({
      "any.only": "Invalid shop order status",
      "any.required": "Status is required"
    })
});

export const getShopOrdersQuerySchema = Joi.object({
  status: Joi.string()
    .valid(...SHOP_ORDER_STATUS_ARRAY)
    .optional()
    .label("status"),

  page: Joi.number().min(1).optional().label("page"),
  limit: Joi.number().min(1).max(50).optional().label("limit")
});