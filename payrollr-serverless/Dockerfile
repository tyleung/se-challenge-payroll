FROM amaysim/serverless:1.36.3

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["serverless", "offline", "--host", "0.0.0.0", "--port", "3001"]