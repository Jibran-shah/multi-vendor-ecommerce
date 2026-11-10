import * as checkoutService from "./checkout.service.js";

export const checkout = async (req, res) => {
  const result = await checkoutService.checkout({
    userId: req.user?.id,
  });

  res.status(201).json({
    success: true,
    message: "Checkout created successfully",
    data: result
  });
};