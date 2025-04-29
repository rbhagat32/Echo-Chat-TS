FROM node
WORKDIR /app
COPY package* .
RUN npm install
COPY . .

#prod
# RUN npm run build

EXPOSE 3000

#prod
# CMD ["npm", "start"]

#dev
CMD ["npm", "run", "dev"]