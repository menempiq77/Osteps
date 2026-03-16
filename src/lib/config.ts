// src/lib/config.ts
const isProduction = process.env.NODE_ENV === 'production';

export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	(isProduction ? 'https://dashboard.osteps.com/api' : 'http://localhost:8000/api');

export const IMG_BASE_URL =
	process.env.NEXT_PUBLIC_IMG_BASE_URL ||
	(isProduction ? 'https://dashboard.osteps.com' : 'http://localhost:8000');
