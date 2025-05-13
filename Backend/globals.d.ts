declare namespace NodeJS {
  interface ProcessEnv {
    CORS_ORIGIN: string;
    MONGO_URI: string;
    PORT: string;
    JWT_SECRET: string;
    NODE_ENV: "development" | "production" | "test";
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRY_TIME: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRY_TIME: string;
    CLOUDINARY_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    RESEND_API_KEY: string;
    PASSWORD_RESET_SECRET: string;
  }
}
