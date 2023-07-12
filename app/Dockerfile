FROM node 
WORKDIR /app 
COPY package.json . 
RUN yarn install
COPY . /app

EXPOSE 5173 
CMD ["yarn", "dev"] 