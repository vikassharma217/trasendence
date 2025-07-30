FROM node:slim

WORKDIR /app

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl

COPY package*.json /app

# Generate SSL/TLS keys
# RUN openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
#     -out /etc/ssl/certs/localhost.crt \
#     -keyout /etc/ssl/certs/localhost.key \
#     -subj "/C=AT/ST=W/L=W/O=42/OU=42/CN=localhost"
RUN npm install

COPY . /app

RUN npm run build

# FROM nginx:slim

# # Copy the built files to the Nginx web root
# COPY --from=build /app/dist /usr/share/nginx/html
# COPY --from=build /app/public /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80
# Yes, exposing port 80 is typically used when you are serving your frontend using a web server like Nginx. In your original setup, you are exposing port 3000 because your frontend is being served directly by a Node.js development server (e.g., npm run start).
# 1. If You Are Using Nginx
# If you want to serve your built frontend files using Nginx, you need to:

# Use Nginx in your Dockerfile.
# Expose port 80 (the default HTTP port).
# Example Dockerfile for Nginx:

# Build stage
# FROM node:slim AS build

# WORKDIR /app

# COPY package*.json /app
# RUN npm install

# COPY . /app
# RUN npm run build

# # Serve stage
# FROM nginx:alpine

# # Copy built files to Nginx web root
# COPY --from=build /app/dist /usr/share/nginx/html

# # Expose port 80 for Nginx
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]


#  EXPOSE 3000

CMD ["npm", "run", "start"]
