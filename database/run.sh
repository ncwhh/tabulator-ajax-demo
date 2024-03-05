#!/usr/bin/env bash
bash build.sh
docker run --rm -d -p 5432:5432 --name tabulator-db tabulator-db
