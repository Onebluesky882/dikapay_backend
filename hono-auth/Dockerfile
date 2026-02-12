FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

RUN bun build src/index.ts --outdir dist --target bun

ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]