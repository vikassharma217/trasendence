FROM node:slim

WORKDIR /app

# Install debugging tools and OpenSSL
RUN apt-get update && apt-get install -y iputils-ping dnsutils openssl

ENV NODE_ENV development

# Generate SSL/TLS keys
# RUN mkdir -p /etc/ssl/private /etc/ssl/certs && \
#     openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
#     -keyout /etc/ssl/private/backend.key \
#     -out /etc/ssl/certs/backend.crt \
#     -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=backend.local"


COPY package*.json /app
RUN npm install

COPY . /app

EXPOSE 8080

CMD ["npm", "run", "start"]