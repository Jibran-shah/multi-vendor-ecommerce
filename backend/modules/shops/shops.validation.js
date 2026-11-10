import Joi from "joi";
import { mongoIdSchema } from "../../validationSchemas/mongodb.schemas.js";

export const createShopSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required(),
  logo: mongoIdSchema.optional(),
  images:Joi.array().items().items(mongoIdSchema).default([]),
  description: Joi.string()
    .max(1000)
    .allow("", null)
    .optional(),
  user: Joi.forbidden()
});

export const updateShopSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).optional(),
  logo: mongoIdSchema.optional(),
  images:Joi.array().length(5).items().items(mongoIdSchema).default([]),
  description: Joi.string().max(1000).allow("", null).optional(),
  isApproved: Joi.forbidden(),
  rating: Joi.forbidden(),
  ratingCount: Joi.forbidden(),
  totalProducts: Joi.forbidden()
}).min(1);


export const shopIdParamSchema = Joi.object({
  id: mongoIdSchema.required().label("id")
});

export const bulkDeleteShopSchema = Joi.object({
  ids: Joi.array()
    .items(mongoIdSchema.required())
    .min(1)
    .required()
});

export const getAllShopQuerySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional(),
  locationLat:Joi.number().optional(),
  locationLn:Joi.number().optional(),
  locationRad:Joi.number().optional(),
  isApproved: Joi.string().trim().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  user: mongoIdSchema.optional()
});