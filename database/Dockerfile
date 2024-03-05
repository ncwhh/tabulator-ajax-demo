FROM node:20-alpine as build

WORKDIR /app
COPY data_generator/ /app/

RUN npm install --no-update-notifier
RUN npm run build

FROM postgres:16-alpine

ENV POSTGRES_HOST_AUTH_METHOD=trust

COPY --from=build /app/dummy_data.csv /tmp/
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432