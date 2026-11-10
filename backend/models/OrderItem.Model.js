import mongoose from "mongoose";
import { MODELS } from "../constants/models.constants.js";

const { Schema, Types } = mongoose;

export const orderItemSchema = new Schema(
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

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);