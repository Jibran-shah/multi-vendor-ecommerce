import { z } from "zod";

const fileSchema = z
  .array(z.instanceof(File))
  .max(10, "Maximum 10 files allowed");

const baseProductSchema = z.object({
  name: z.string().min(2).max(100),

  description: z.string().min(5).max(1000),

  price: z.coerce.number().min(0),

  quantityAvailable: z.coerce.number().min(0),

  category: z.any(),
});

export const createProductSchema = baseProductSchema.extend({
  images: fileSchema.min(1, "At least 1 image is required"),
});

export const updateProductSchema = baseProductSchema.extend({
  images: fileSchema.default([]),

  imageIds: z.array(z.string()).default([]),

  oldImages: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        url: z.string().optional(),
      })
    )
    .default([]),
});