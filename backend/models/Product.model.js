import mongoose from "mongoose";
import {
  PRODUCT_STATUSES,
  PRODUCT_STATUS_ARRAY
} from "../constants/product.constants.js";
import { MODELS } from "../constants/models.constants.js";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: MODELS.SHOP,
      required: true,
      index: true
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: MODELS.CATEGORY,
      required: true,
      index: true
    },

    categoryPath: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    description: {
      type: String,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },

    quantityAvailable: {
      type: Number,
      default: 0,
      min: 0
    },

    images: [
      {
        type: Schema.Types.ObjectId,
        ref: MODELS.MEDIA_ASSET
      }
    ],

    status: {
      type: String,
      enum: PRODUCT_STATUS_ARRAY,
      default: PRODUCT_STATUSES.AVAILABLE,
      index: true
    },

    soldCount: {
      type: Number,
      default: 0
    },

    ratingSum: {
      type: Number,
      default: 0,
      min: 0
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0
    },

    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true
    },

    /* =========================
       LOCATION (UNIFIED MODEL)
    ========================= */
    location: {
      coordinates: {
        type: [Number], // [lng, lat]
        default: undefined,
        validate: {
          validator(value) {
            if (!value || value.length === 0) return true;

            return (
              Array.isArray(value) &&
              value.length === 2 &&
              value[0] >= -180 &&
              value[0] <= 180 &&
              value[1] >= -90 &&
              value[1] <= 90
            );
          },
          message: "Invalid coordinates [lng, lat]"
        }
      },

      fullAddress: {
        type: String,
        trim: true,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

productSchema.pre("save", function () {
  if (this.quantityAvailable <= 0) {
    this.status = PRODUCT_STATUSES.SOLD_OUT;
  } else if (
    this.status === PRODUCT_STATUSES.SOLD_OUT &&
    this.quantityAvailable > 0
  ) {
    this.status = PRODUCT_STATUSES.AVAILABLE;
  }
});


productSchema.index({ shop: 1, status: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ categoryPath: 1 });
productSchema.index({ categoryPath: 1, price: 1 });
productSchema.index({ "location.coordinates": "2dsphere" });

export const Product =  mongoose.models[MODELS.PRODUCT] ||
  mongoose.model(MODELS.PRODUCT, productSchema);