export const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
}
