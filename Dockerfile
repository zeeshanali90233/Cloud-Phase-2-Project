# Stage 1: Build stage
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --quiet

COPY . .
RUN npm run build

# Stage 2: Runtime stage
FROM node:16-alpine AS runtime

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm ci --production --quiet

COPY --from=build /app/build ./build

EXPOSE 8080
CMD ["npm", "start"]
