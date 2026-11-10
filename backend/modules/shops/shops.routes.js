import express from "express";
import { createUpload } from "../../middlewares/upload.middleware.js";
import { mediaContext } from "../../middlewares/mediaContext.middlware.js";
import {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  bulkDeleteShops,
  getMyShop,
  deleteShopAdmin
} from "./shops.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createShopSchema,
  updateShopSchema,
  shopIdParamSchema,
  bulkDeleteShopSchema,
  getAllShopQuerySchema
} from "./shops.validation.js";
import { protect, restrictTo } from "../../middlewares/protect.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { USER_ROLES } from "../../constants/user.constants.js";
import { MEDIA_USAGE_TYPES, NAMESPACES } from "../../constants/media.constants.js";

const router = express.Router();

router.post(
  "/bulk-delete",
  protect(),
  restrictTo(USER_ROLES.ADMIN),
  validate(bulkDeleteShopSchema),
  asyncHandler(bulkDeleteShops)
);

router.post(
  "/",
  protect({ profile: true }),
  createUpload({
    fields: [
      {
        name: "logoFile",
        maxCount: 1,
        required: false
      },
      {
        name: "imageFiles",
        maxCount: 5,
        required: false,
      }
    ]
  }),
  mediaContext({
    fields: {
      logoFile: {
        namespace: NAMESPACES.SHOP_LOGO,
        usageType: MEDIA_USAGE_TYPES.SHOP_LOGO
      },
      imageFiles: {
        namespace: NAMESPACES.SHOP_IMAGES,
        usageType: MEDIA_USAGE_TYPES.SHOP_IMAGE
      }
    }
  }),
  validate(createShopSchema),
  asyncHandler(createShop)
);

router.get(
  "/",
  validate(getAllShopQuerySchema, "query"),
  asyncHandler(getAllShops)
);

router.get(
  "/me",
  protect({ shop: true }),
  asyncHandler(getMyShop)
);

router.get(
  "/:id",
  validate(shopIdParamSchema, "params"),
  asyncHandler(getShopById)
);

router.put(
  "/:id",
  protect(),
  createUpload({
    fields: [
      {
        name: "logoFile",
        maxCount: 1,
        required: false
      },
      {
        name: "imageFiles",
        maxCount: 5,
        required: false,
      }
    ]
  }),
  mediaContext({
    fields: {
      logoFile: {
        namespace: NAMESPACES.SHOP_LOGO,
        usageType: MEDIA_USAGE_TYPES.SHOP_LOGO
      },
      imageFiles: {
        namespace: NAMESPACES.SHOP_IMAGES,
        usageType: MEDIA_USAGE_TYPES.SHOP_IMAGE
      }
    }
  }),
  validate(shopIdParamSchema, "params"),
  validate(updateShopSchema, "body"),
  asyncHandler(updateShop)
);

router.delete(
  "/",
  protect(),
  asyncHandler(deleteShop)
);

router.delete(
  "/admin/:id",
  protect({profile:true}),
  restrictTo("admin"),
  validate(shopIdParamSchema,"params"),
  asyncHandler(deleteShopAdmin)
);

export default router;