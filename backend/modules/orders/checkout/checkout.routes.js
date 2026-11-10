import { Router } from "express";

import * as checkoutController from "./checkout.controller.js";
import { protect } from "../../../middlewares/protect.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  protect(),
  asyncHandler(checkoutController.checkout)
);

export default router;