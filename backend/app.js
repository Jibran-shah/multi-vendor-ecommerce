import "./env.js";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import connectDB from "./config/db.js";
import "./config/redis.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { requestIdMiddleware } from "./middlewares/requestId.middleware.js";
import { httpLogger } from "./middlewares/httpLogger.middleware.js";
import { logger } from "./config/logger.js";
import { globalRateLimiter } from "./rateLimitors.js";
import { BASE_ROOT } from "./constants/app.constants.js";
import authRoutes from "./modules/authentication/auth.routes.js";
import mediaFileRoutes from "./modules/media/files/files.routes.js";
import mediaAssetRoutes from "./modules/media/assets/assets.routes.js";
import profileRoutes from "./modules/profiles/profiles.routes.js";
import shopRoutes from "./modules/shops/shops.routes.js";
import categoryRoutes from "./modules/categories/categories.routes.js";
import productRoutes from "./modules/products/products.routes.js";
import reviewRoutes from "./modules/reviews/reviews.routes.js";
import directChatRoutes from "./modules/chat/directChat/directChat.routes.js";
import groupChatRoutes from "./modules/chat/groupChats/groupChats.routes.js";
import messagesRoutes from "./modules/chat/messages/messages.routes.js";
import shopOrderRoutes from "./modules/orders/shopOrders/shopOrders.routes.js";
import buyerOrderRoutes from "./modules/orders/buyerOrders/buyerOrders.routes.js";
import checkoutRoutes from "./modules/orders/checkout/checkout.routes.js";
import cartRoutes from "./modules/orders/cart/cart.routes.js";
import paymentRoutes from "./modules/payments/payments.routes.js";
import walletRoutes from "./modules/finance/wallet/wallet.routes.js";
import walletTransactionRoutes from "./modules/finance/walletTransactions/walletTransactions.routes.js";
import withdrawRequestRoutes from "./modules/finance/withdrawRequests/withdrawRequests.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.options(/.*/, cors());
app.set('trust proxy', 1);

const startServer = async () => {
  try {
    await connectDB();
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    app.use(requestIdMiddleware);
    app.use(httpLogger);

    app.use(globalRateLimiter);

    app.use(
      "/uploads",
      express.static(path.join(process.cwd(), "uploads"))
    );

    app.use(BASE_ROOT + "/auth", authRoutes);
    app.use(BASE_ROOT + "/products", productRoutes);
    app.use(BASE_ROOT + "/buyerOrders", buyerOrderRoutes);
    app.use(BASE_ROOT + "/shopOrders", shopOrderRoutes);
    app.use(BASE_ROOT + "/checkout", checkoutRoutes);
    app.use(BASE_ROOT + "/cart", cartRoutes);
    app.use(BASE_ROOT + "/payments", paymentRoutes);
    app.use(BASE_ROOT + "/wallet", walletRoutes);
    app.use(BASE_ROOT + "/walletTransactions", walletTransactionRoutes);
    app.use(BASE_ROOT + "/WithdrawRequests", withdrawRequestRoutes);
    app.use(BASE_ROOT + "/chat/direct", directChatRoutes);
    app.use(BASE_ROOT + "/chat/group", groupChatRoutes);
    app.use(BASE_ROOT + "/messages", messagesRoutes);
    app.use(BASE_ROOT + "/categories", categoryRoutes);
    app.use(BASE_ROOT + "/media/files", mediaFileRoutes);
    app.use(BASE_ROOT + "/media/assets", mediaAssetRoutes);
    app.use(BASE_ROOT + "/profiles/buyers", profileRoutes);
    app.use(BASE_ROOT + "/shops", shopRoutes);
    app.use(BASE_ROOT + "/reviews", reviewRoutes);

    app.get("/", (req, res) => {
      res.send("API Running");
    });

  
    app.use(errorHandler);

  } catch (err) {
    console.log(err)
    logger.error(err);
    process.exit(1);
  }
};

startServer();

export default app;