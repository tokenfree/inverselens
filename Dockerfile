# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Clean up devDependencies after build to reduce image size and avoid runtime issues
RUN npm prune --production && npm cache clean --force

# Expose port (Render will override this)
EXPOSE 10000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
