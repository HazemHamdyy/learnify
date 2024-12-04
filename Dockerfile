# Stage 1: Build the application
FROM node:18 AS builder
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's cache for faster builds
COPY package*.json ./

# Install dependencies, including Prisma CLI
RUN npm install

# Copy the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Run the build command for NestJS
RUN npm run build

# Stage 2: Production image
FROM node:18
WORKDIR /app

# Copy over the built application and Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Expose the port your app will run on
EXPOSE 3000

# Command to start the app
CMD ["npm", "run", "start:prod"]
