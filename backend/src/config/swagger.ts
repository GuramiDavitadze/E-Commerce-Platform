import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import authDoc from "../docs/auth.docs.json";
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "E-Commerce REST API documentation",
    },
    servers: [
      { url: "http://localhost:3008", description: "Development server" },
      {
        url: "https://e-commerce-full-stack-production-2d56.up.railway.app",
        description: "Production server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = {
  ...swaggerJSDoc(options),
  paths: {
    ...authDoc,
  },
};

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
