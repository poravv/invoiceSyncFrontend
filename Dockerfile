# Etapa de construcción
FROM node:16-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build --prod

# Etapa de producción - Usando nginx
FROM nginx:alpine

# Copiar archivos de construcción
COPY --from=build /app/dist/invoicesync-frontend /usr/share/nginx/html

# Configurar nginx para SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
