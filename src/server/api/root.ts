import { createTRPCRouter } from "~/server/api/trpc";
import { mainRouter } from "./routers/mainRouter";
import { exampleRouter } from "./routers/example";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  main: mainRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
