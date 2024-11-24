# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY ./siam-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY ./siam-frontend/. .

# Expose the Angular development server port
EXPOSE 4200

# Start the Angular application in development mode
CMD ["npm", "start"]
