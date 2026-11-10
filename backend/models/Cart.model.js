import mongoose from "mongoose";
import { cartItemSchema } from "./CartItem.model.js";
import { MODELS } from "../constants/models.constants.js";

const { Schema, Types, model } = mongoose;

const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: MODELS.USER,
      required: true,
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("save", function () {
  if (!this.items?.length) {
    this.subtotal = 0;
    return;
  }

  this.items.forEach((item) => {
    item.total = item.price * item.quantity;
  });

  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
});

export const Cart =
  mongoose.models[MODELS.CART] || model(MODELS.CART, cartSchema);