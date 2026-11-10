import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/Login.page";
import RegisterPage from "../pages/auth/Register.page";
import ForgotPasswordPage from "../pages/auth/ForgotPassword.page";
import VerifyOtpPage from "../pages/auth/VerifyOtp.page";
import ResetPasswordPage from "../pages/auth/ResetPassword.page";
import VerifyEmailPage from "../pages/auth/VerifyEmail.page";
import UnauthorizedPage from "../pages/Unauthorized.page";

import BuyerDashboard from "../pages/dashboard/BuyerDashboard.page";
import ShopDashboard from "../pages/dashboard/ShopDashboard.page";

import ProfilePage from "../pages/profile/Profile.page";
import EditProfilePage from "../pages/profile/EditProfile.page";

import HomePage from "../pages/Home.page";

import ProductsPage from "../pages/products/Products.page";
import ProductDetailsPage from "../pages/products/ProductDetails.page";

import CreateProfilePage from "../pages/profile/CreateProfile.page";

import ChatsPage from "../pages/chat/Chats.page"

import CreateShop from "../pages/shop/CreateShop.page"
import EditShop from "../pages/shop/EditShop.page"

import EmailVerificationGate from "../pages/auth/EmailVerificationGate.page";
import EmailNotVerifiedGate from "../pages/auth/EmailNotVerifiedGate.page";
import Layout from "./layout";

import CategoryCreatePage from "../pages/categories/CreateCategory.page";
import ProductSearchPage from "../pages/products/ProductsSearchPage";
import ProductUpdatePage from "../pages/products/ProductUpdate.page";

import ShopPage from "../pages/shop/Shop.page";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/emailVerificationGate" element={<EmailVerificationGate />} />
      <Route path="/emailNotVerifiedGate" element={<EmailNotVerifiedGate />} />
      <Route path="/profile/create" element={<CreateProfilePage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/shop/dashboard" element={<ShopDashboard />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/update/:id" element={<ProductUpdatePage/>}/>
        <Route path="/products/search" element={<ProductSearchPage/>}/>
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/shop/create" element={<CreateShop/>} />
        <Route path="/shop/edit" element={<EditShop />} />
        <Route path="/shop/:id" element={<ShopPage/>} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/category/create" element={<CategoryCreatePage/>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}