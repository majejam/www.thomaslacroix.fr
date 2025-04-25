# Use a modern Node image
FROM node:12

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the app (for production)
RUN npm run build

# Expose the port your app listens on
EXPOSE 8080

# Start the app when the container runs
CMD ["npm", "run", "serve"]
