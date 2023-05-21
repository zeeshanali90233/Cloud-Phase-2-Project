# Stage 1: Build stage
FROM node:14-alpine AS build

WORKDIR /app
COPY package*.json ./
COPY node_modules ./
# Copy the build folder from your local repository to the container
RUN npm run build

# Stage 2: Runtime stage
FROM node:14-alpine AS runtime

WORKDIR /app

# Copy the build folder from the build stage
COPY --from=build /app/build ./build

# Expose port 3000
EXPOSE 3000

# Set the command to start the development server
CMD ["npm", "start"]
