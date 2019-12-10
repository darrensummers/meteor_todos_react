FROM tozd/meteor:ubuntu-xenial
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD ["npm", "start"]
