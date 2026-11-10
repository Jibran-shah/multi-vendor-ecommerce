import mongoose from "mongoose";
import { orderItemSchema } from "./OrderItem.Model.js";
import {
  BUYER_ORDER_STATUS,
  BUYER_ORDER_STATUS_ARRAY,
} from "../constants/order.constants.js";
import { MODELS } from "../constants/models.constants.js";

const { Schema, Types, model } = mongoose;

const buyerOrderSchema = new Schema(
  {
    buyer: {
      type: Types.ObjectId,
      ref: MODELS.USER,
      required: true,
    },

    // Snapshot of purchased items
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    
    shopOrders: [
      {
        type: Types.ObjectId,
        ref: MODELS.SHOP_ORDER,
      },
    ],

    // One order ↔ one payment transaction
    paymentTransaction: {
      type: Types.ObjectId,
      ref: MODELS.PAYMENT_TRANSACTION,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: BUYER_ORDER_STATUS_ARRAY,
      default: BUYER_ORDER_STATUS.PENDING,
    },

    paidAt: {
      type: Date,
    },

    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

buyerOrderSchema.index({ buyer: 1, createdAt: -1 });
buyerOrderSchema.index({ status: 1, createdAt: -1 });
buyerOrderSchema.index({ paymentTransaction: 1 });

export const BuyerOrder = model(MODELS.BUYER_ORDER, buyerOrderSchema);