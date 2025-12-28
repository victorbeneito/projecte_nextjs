// prisma.config.ts
import { defineConfig } from "@prisma/client";

export default defineConfig({
  datasource: {
    // Opción 1 -> conexión directa
    adapter: {
      provider: "mysql", // o "postgresql", según lo que uses
      url: process.env.DATABASE_URL!,
    },
    // Opción 2 -> si usas Prisma Accelerate
    // accelerateUrl: process.env.PRISMA_ACCELERATE_URL!,
  },
});
