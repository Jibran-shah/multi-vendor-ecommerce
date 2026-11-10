import mongoose from "mongoose";
import { MODELS } from "../constants/models.constants.js";

const { Schema, Types, model } = mongoose;

export const cartItemSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: MODELS.PRODUCT,
      required: true
    },

    shop: {
      type: Types.ObjectId,
      ref: MODELS.SHOP,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    total: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);