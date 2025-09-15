
# --- Build Stage ---
FROM node:20-alpine AS runner-builder

ENV NODE_ENV=production
ENV PORT=4002


WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4002

CMD ["node", "app.mjs"]
