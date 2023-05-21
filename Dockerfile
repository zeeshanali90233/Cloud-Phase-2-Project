# Stage 1: Build stage
FROM node:14-alpine AS build

WORKDIR /app

# Clear npm cache
RUN npm cache clean --force

# Copy package.json and package-lock.json
COPY package*.json ./

# Update npm
RUN npm install --global npm@latest

# Install dependencies and ignore warnings
RUN npm install --quiet --no-warnings

# Copy the rest of the project files
COPY . .

# Build the React app (assuming it was built locally)
COPY ./build ./build

# Stage 2: Runtime stage
FROM node:14-alpine AS runtime

WORKDIR /app

# Copy the build folder from the build stage
COPY --from=build /app/build ./build

# Expose port 3000
EXPOSE 3000

# Set the command to start the development server
CMD ["npm", "start"]
