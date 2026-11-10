import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as productController from "./products.controller.js";
import { protect, restrictTo } from "../../middlewares/protect.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import { createUpload } from "../../middlewares/upload.middleware.js";
import { mediaContext } from "../../middlewares/mediaContext.middlware.js";

import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  idParamSchema
} from "./products.validation.js";
import { MEDIA_USAGE_TYPES, NAMESPACES } from "../../constants/media.constants.js";

const router = express.Router();

router.post(
  "/",
  protect({ shop: true }),

  createUpload({
    fields: [
      {
        name: "images",
        maxCount: 10,
        required: false
      }
    ]
  }),

  mediaContext({
    fields: {
      images: {
        namespace: NAMESPACES.PRODUCT_IMAGES,
        usageType: MEDIA_USAGE_TYPES.PRODUCT_IMAGE
      }
    }
  }),

  validate(createProductSchema),
  asyncHandler(productController.createProduct)
);

/* =========================================================
   GET ALL PRODUCTS
========================================================= */
router.get(
  "/",
  validate(productQuerySchema, "query"),
  asyncHandler(productController.getProducts)
);

/* =========================================================
   MY PRODUCTS
========================================================= */
router.get(
  "/shop/me",
  protect({ shop: true }),
  asyncHandler(productController.getProductsByShop)
);

/* =========================================================
   BY CATEGORY
========================================================= */
router.get(
  "/category/:categoryId",
  asyncHandler(productController.getByCategory)
);

/* =========================================================
   SINGLE PRODUCT
========================================================= */
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(productController.getProductById)
);

/* =========================================================
   UPDATE PRODUCT
========================================================= */
router.patch(
  "/:id",
  protect({ shop: true }),
  /* =========================
     FILE UPLOAD
  ========================= */
  createUpload({
    fields: [
      {
        name: "images",
        maxCount: 10,
        required: false
      }
    ]
  }),
  mediaContext({
    ownerFrom: "user",
    fields: {
      images: {
        namespace: NAMESPACES.PRODUCT_IMAGES,
        usageType: MEDIA_USAGE_TYPES.PRODUCT_IMAGE
      }
    }
  }),

  validate(idParamSchema, "params"),
  validate(updateProductSchema, "body"),
  asyncHandler(productController.updateProduct)
);

/* =========================================================
   DELETE PRODUCT
========================================================= */
router.delete(
  "/:id",
  protect({ shop: true }),
  validate(idParamSchema, "params"),
  asyncHandler(productController.deleteProduct)
);

router.delete(
  "/admin/:id",
  protect({ shop: true }),
  restrictTo("admin"),
  validate(idParamSchema, "params"),
  asyncHandler(productController.deleteProductAdmin)
);

export default router;