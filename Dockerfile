FROM tozd/meteor:ubuntu-xenial
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD ["npm", "start"]
