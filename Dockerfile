FROM node:20

WORKDIR /usr/app

COPY package.json package-lock.json ./

# Ensure dependencies are installed exactly as specified in package-lock.json
RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 3333

# Print node and npm versions for debugging
RUN node -v
RUN npm -v

RUN npm run build

CMD ["npm", "run", "start:prod"]
