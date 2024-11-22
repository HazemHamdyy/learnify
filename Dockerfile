FROM node:16 

WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .
RUN npx prisma generate --schema=./prisma/schema.prisma



EXPOSE 3000
CMD ["npm","start"]