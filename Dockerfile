# Stage 1: Build stage
FROM node:14-alpine AS build

WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --production --quiet --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Build the React app
RUN yarn build

# Stage 2: Runtime stage
FROM node:14-alpine AS runtime

WORKDIR /app

# Copy the build folder from the build stage
COPY --from=build /app/build ./build

# Expose port 3000
EXPOSE 3000

# Set the command to start the development server
CMD ["yarn", "start"]
