FROM node:20
WORKDIR /app
COPY package* .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]