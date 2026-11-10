import mongoose from "mongoose";
import { MODELS } from "../constants/models.constants.js";

const shopSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODELS.USER,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODELS.MEDIA_ASSET
    },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.MEDIA_ASSET
      }
    ],

    description: {
      type: String,
      maxlength: 1000
    },

    location: {
      // [lng, lat]
      coordinates: {
        type: [Number], 
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
          message:
            "Coordinates must be [longitude, latitude] with valid ranges."
        }
      },

      fullAddress: {
        type: String,
        trim: true,
        default: ""
      }
    },

    isApproved: {
      type: Boolean,
      default: false
    },

    totalProducts: {
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
    }
  },
  {
    timestamps: true
  }
);

shopSchema.index({
  "location.coordinates": "2dsphere"
});

export const Shop = mongoose.models[MODELS.SHOP] || mongoose.model(MODELS.SHOP, shopSchema);