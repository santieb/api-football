import dotenv from 'dotenv'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config()

export const __dirname = dirname(fileURLToPath(import.meta.url));
export default {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_USER: process.env.DB_USER,
}

