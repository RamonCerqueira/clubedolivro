# Etapa de Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Variável de ambiente necessária durante a build do Next.js
ARG NEXT_PUBLIC_API_URL=http://187.18.1.30:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Etapa de Produção
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Arquivos necessários do standalone do Next.js
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
