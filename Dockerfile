# Stage 1: Build stage
FROM node:14-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --quiet

# Copy the rest of the project files
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Runtime stage
FROM node:14-alpine AS runtime

WORKDIR /app

# Copy package.json and package-lock.json
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --production --quiet 

# Copy the build folder
COPY --from=build /app/build ./build

# Expose port 3000
EXPOSE 3000

# Set the command to start the app
CMD ["npm", "start"]
