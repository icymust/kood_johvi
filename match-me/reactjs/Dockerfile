# Use Node.js for building
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the project files
COPY . .

# Build the project
RUN npm run build

# Use Nginx to serve the built files (production)
FROM nginx:latest AS production

# Copy build output to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# For Development Environment
FROM node:18 AS development

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the project files
COPY . .

# Expose port for development (Vite)
EXPOSE 5173

# Start development server
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'development' ]; then npm run dev -- --host 0.0.0.0; else npm run build && npm run serve; fi"]