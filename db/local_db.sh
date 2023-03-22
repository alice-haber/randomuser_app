#!/bin/bash

docker pull postgres

docker kill erLocalPostgres || true
docker rm erLocalPostgres || true

docker run \
    --name erLocalPostgres \
    -p 5432:5432 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=entity_resolution \
    -d \
    postgres

RETRIES=10

export PGPASSWORD=postgres

until psql -h localhost -U postgres -w -d entity_resolution -c "select 1" > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "Waiting for postgres server, $((RETRIES--)) remaining attempts..."
  sleep 1
done