FROM node:18.20-alpine

RUN mkdir -p /app

WORKDIR /app

COPY /package.json /app

RUN npm i -f

COPY . /app

EXPOSE 8000

CMD ["sh","-c","npm run start:production"]