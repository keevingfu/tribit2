import { z } from 'zod';

/**
 * Common validation schemas for API requests
 */

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const searchSchema = z.object({
  q: z.string().optional(),
  search: z.string().optional(),
});

export const sortSchema = z.object({
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

// KOL API schemas
export const kolListSchema = z.object({
  ...paginationSchema.shape,
  ...searchSchema.shape,
  platform: z.string().optional(),
  region: z.string().optional(),
});

export const kolIdSchema = z.object({
  id: z.string(),
});

// Insight API schemas
export const insightSearchSchema = z.object({
  ...paginationSchema.shape,
  keyword: z.string().optional(),
  region: z.string().optional(),
  language: z.string().optional(),
  minVolume: z.coerce.number().optional(),
  maxVolume: z.coerce.number().optional(),
  minCPC: z.coerce.number().optional(),
  maxCPC: z.coerce.number().optional(),
});

export const videoCreatorsSchema = z.object({
  ...paginationSchema.shape,
  ...searchSchema.shape,
  minFollowers: z.coerce.number().optional(),
  maxFollowers: z.coerce.number().optional(),
  minSales: z.coerce.number().optional(),
  maxSales: z.coerce.number().optional(),
  creatorType: z.string().optional(),
  mcn: z.coerce.number().optional(),
});

export const consumerVoiceSchema = z.object({
  region: z.string().optional(),
  language: z.string().optional(),
  category: z.string().optional(),
});