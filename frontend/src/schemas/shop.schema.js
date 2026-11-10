import { z } from "zod";

export const shopSchema = z.object({
  name: z.string().default(""),
  description: z.string().default(""),
  fullAddress: z.string().default(""),
  latitude: z.number().nullable().default(null),
  longitude: z.number().nullable().default(null),
  logoFile: z.instanceof(File).nullable().default(null),
  imageFiles: z.array(z.instanceof(File)).default([]),
});