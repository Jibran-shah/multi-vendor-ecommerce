import * as shopService from "./shops.service.js";
import { NotFoundError } from "../../errors/Http.error.js";
import { parseExpiresToSeconds } from "../../utils/token.utils.js";
import { setCookie } from "../../utils/cookie.js";
import { AUTH_CONFIG } from "../../config/auth.config.js";

export const createShop = async (req, res) => {

  const {
    shop,
    user,
    refreshToken,
    accessToken
  } = await shopService.createShop({
    ...req.validated?.body,
    user: req.user,
    logoFile: req.media?.logoFile,
    imageFiles:req.media?.imageFiles,
    mediaContext: req.mediaContext
  });

  const refreshTtlSeconds = parseExpiresToSeconds(
    AUTH_CONFIG.REFRESH_TOKEN.EXPIRY
  );

  setCookie(
    res,
    AUTH_CONFIG.REFRESH_TOKEN.COOKIE_NAME,
    refreshToken,
    refreshTtlSeconds
  );

  const accessTtlSeconds = parseExpiresToSeconds(
    AUTH_CONFIG.ACCESS_TOKEN.EXPIRY
  );

  setCookie(
    res,
    AUTH_CONFIG.ACCESS_TOKEN.COOKIE_NAME,
    accessToken,
    accessTtlSeconds
  );

  return res.status(201).json({
    success: true,
    data: {
      user,
      shop
    }
  });
};

// READ ALL
export const getAllShops = async (req, res) => {
  const shops = await shopService.getAllShops(req.validated?.query || {});

  return res.status(200).json({
    success: true,
    shops: shops
  });
};

// READ ONE
export const getShopById = async (req, res) => {
  const shop = await shopService.getShopById(req.validated?.params.id);

  if (!shop) {
    throw new NotFoundError("shop not found");
  }

  return res.status(200).json({
    success: true,
    data:{
      shop
    }
  });
};

export const getMyShop = async(req,res) =>{
  const shop = await shopService.getShopByUser(req.user?.id);

  if (!shop) {
    throw new NotFoundError("shop not found");
  }
  
  return res.status(200).json({
    success:true,
    data:{
      shop
    }
  });
}


export const updateShop = async (req, res) => {
  const updated = await shopService.updateShop(
    req.validated?.params.id,
    {
      ...req.validated?.body,
      logoFile: req.media?.logoFile,
      logoId: req.validated?.body?.logoId,
      mediaContext: req.mediaContext
    },
    req.user?.id
  );

  return res.status(200).json({
    success: true,
    shop: updated
  });
};


// DELETE
export const deleteShop = async (req, res) => {
  const {refreshToken,accessToken} = await shopService.deleteShopById(
    req.user
  );
    
  const refreshTtlSeconds = parseExpiresToSeconds(AUTH_CONFIG.REFRESH_TOKEN.EXPIRY);
  setCookie(res, AUTH_CONFIG.REFRESH_TOKEN.COOKIE_NAME, refreshToken, refreshTtlSeconds);
    
  const accessTtlSeconds = parseExpiresToSeconds(AUTH_CONFIG.ACCESS_TOKEN.EXPIRY);
  setCookie(res, AUTH_CONFIG.ACCESS_TOKEN.COOKIE_NAME, accessToken, accessTtlSeconds);

  return res.status(200).json({
    success: true,
    message: "shop deleted successfully"
  });
};


// DELETE
export const deleteShopAdmin = async (req, res) => {
  const id = req.validated?.params.id;
  await shopService.deleteShopByIdAdmin(id);
  return res.status(200).json({
    success: true,
    message: "shop deleted successfully"
  });
};

// BULK DELETE
export const bulkDeleteShops = async (req, res) => {
  await shopService.bulkDeleteShops(
    req.validated?.body.ids,
    req.user?.id
  );

  return res.status(200).json({
    success: true,
    message: "Bulk delete successful"
  });
};

