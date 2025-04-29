# vercel does not support docker.
# so setting up docker only for development
FROM node
WORKDIR /app
COPY package* .
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]