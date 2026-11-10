import mongoose from "mongoose";

import { SHOP_ORDER_STATUS, SHOP_ORDER_STATUS_ARRAY } from "../constants/order.constants.js";
import { orderItemSchema } from "./OrderItem.Model.js";
import { MODELS } from "../constants/models.constants.js";

const { Schema, Types, model } = mongoose;

const shopOrderSchema = new Schema(
  {
    buyerOrder: {
      type: Types.ObjectId,
      ref: MODELS.BUYER_ORDER,
      required: true,
      index: true
    },

    shop: {
      type: Types.ObjectId,
      ref: MODELS.SHOP,
      required: true,
      index: true
    },

    buyer: {
      type: Types.ObjectId,
      ref: MODELS.USER,
      required: true,
      index: true
    },

    /* 🔥 IMPORTANT: link to payment transaction */
    paymentTransaction: {
      type: Types.ObjectId,
      ref: MODELS.PAYMENT_TRANSACTION,
      required: true,
      index: true
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: SHOP_ORDER_STATUS_ARRAY,
      default: SHOP_ORDER_STATUS.PENDING,
      index: true
    }
  },
  {
    timestamps: true
  }
);

/* useful compound indexes */
shopOrderSchema.index({ shop: 1, createdAt: -1 });
shopOrderSchema.index({ buyerOrder: 1, shop: 1 });

export const ShopOrder = model(MODELS.SHOP_ORDER, shopOrderSchema);