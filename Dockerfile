# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the entire project directory into the container's working directory
COPY . .

# Build the Next.js app
RUN yarn build

# Include the Next.js production build artifacts
COPY .next ./.next

# Set the command to start the production server
CMD ["yarn", "start"]
