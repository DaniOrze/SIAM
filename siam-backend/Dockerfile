# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY ./siam-backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./siam-backend/. .

# Build the TypeScript application
RUN npm run build

# Expose the port the application runs on (default for Express)
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
