FROM node:14-alpine


WORKDIR /app

COPY . /app/

RUN yarn

RUN yarn global add pm2

RUN yarn build

EXPOSE 9000
ENTRYPOINT [ "pm2-runtime" ]
CMD ["bin/app.js", "-i", "0"]