FROM node:20-alpine

WORKDIR /app
COPY ./kanban-1-1.0.0.tgz .
RUN npm install kanban-1-1.0.0.tgz
COPY . .
RUN diff package.json node_modules/kanban-1/package.json || exit 1
RUN mv node_modules/kanban-1/node_modules/* node_modules
RUN rm -r node_modules/kanban-1
RUN rm kanban-1-1.0.0.tgz

RUN adduser -u 1001 -D defaultuser
USER defaultuser

CMD ["node","app.js"]