# Stage 1: Build stage
FROM node:14-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --quiet

COPY . .
RUN npm run build

# Stage 2: Runtime stage
FROM node:14-alpine AS runtime

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm ci --production --quiet

COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["npm", "start"]
