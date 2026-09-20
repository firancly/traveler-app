FROM oven/bun:1.4.0

WORKDIR /app
COPY . .

RUN bun install --frozen-lockfile
RUN cd packages/db && bunx prisma generate
RUN cd apps/server && bun run build

WORKDIR /app/apps/server
CMD ["bun", "run", "dist/index.mjs"]