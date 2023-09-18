import { prisma } from "db/lib/prisma";
import * as z from "zod";

import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  postList: publicProcedure.query(async () => {
    const posts = await prisma.post.findMany();
    return posts;
  }),
  addPost: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async (opts) => {
      const { title, content } = opts.input;
      const post = await prisma.post.create({
        data: {
          title,
          content,
        },
      });
      return post;
    }),
});

export type AppRouter = typeof appRouter;
