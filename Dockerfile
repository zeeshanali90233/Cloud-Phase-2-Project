# Base image
FROM node:14

# Set working directory
WORKDIR /app


# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project directory into the container's working directory
COPY . .

# Build the React app for production
RUN npm run build



# Expose the desired port (e.g., 3000) for the React app
EXPOSE 3000

# Start the React app using the built files
CMD ["npm", "start"]