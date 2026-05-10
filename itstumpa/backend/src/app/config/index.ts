import dotenv from "dotenv";
import path from "path";

// Load .env
dotenv.config({ path: path.join(process.cwd(), ".env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

const config = {
  node_env: process.env.NODE_ENV || "development",
  app_name: process.env.APP_NAME || "LiveChat",
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  database_url: process.env.DATABASE_URL || "",
  frontend_url: process.env.FRONTEND_URL || "http://localhost:5000",
  backend_url: process.env.BACKEND_URL || "http://localhost:5000",


  accessSecret: process.env.JWT_ACCESS_SECRET!,
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  accessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
  refreshExpires: process.env.JWT_REFRESH_EXPIRES || "7d",

  auto_seed_super_admin: process.env.AUTO_SEED_SUPER_ADMIN || "true",
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  customer_one_email: process.env.CUSTOMER_ONE_EMAIL,
  customer_one_password: process.env.CUSTOMER_ONE_PASSWORD,
  customer_two_email: process.env.CUSTOMER_TWO_EMAIL,
  customer_two_password: process.env.CUSTOMER_TWO_PASSWORD,

};

export default config;