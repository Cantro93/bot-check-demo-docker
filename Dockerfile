# syntax=docker/dockerfile:1
FROM node:22 AS base
WORKDIR /opt/bct
COPY . .
EXPOSE 3000
CMD ["node", "/opt/bct/test.js"]
