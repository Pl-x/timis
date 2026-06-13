#!/bin/sh
# Run both API and worker in one container
timis-worker &
exec timis-api
