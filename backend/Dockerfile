FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

EXPOSE 3008

CMD ["npm", "run", "dev"]