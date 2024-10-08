import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "note/server/api/trpc";
import { posts } from "note/server/db/schema";
import { contextProps } from "@trpc/react-query/shared";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
  }),

  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.posts.findMany();
  }),

  create: protectedProcedure
  .input(
    z.object({
      content: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    await ctx.db.insert(posts).values({
      userID: ctx.session.user.id,
      content: input.content,
    })
  }),

  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //       createdById: ctx.session.user.id,
  //     });
  //   }),

  // getLatest: publicProcedure.query(async ({ ctx }) => {
  //   const post = await ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });

  //   return post ?? null;
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
