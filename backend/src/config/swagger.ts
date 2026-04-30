import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import authDoc from "../docs/auth.docs.json";
import categoryDoc from "../docs/category.docs.json";
import commentsDoc from "../docs/comment.doc.json";
import orderDoc from "../docs/order.docs.json";
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
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          in: "header",
          name: "secret-api-key",
        },
      },
    },

    security: [{ apiKey: [] }],
  },
  apis: [],
};

export const swaggerSpec = {
  ...swaggerJSDoc(options),
  paths: {
    ...authDoc,
    ...categoryDoc,
    ...commentsDoc,
    ...orderDoc,
  },
};

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
