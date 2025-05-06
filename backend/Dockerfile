FROM node
WORKDIR /app
COPY package* .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]