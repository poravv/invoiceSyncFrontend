# Etapa de construcción
FROM node:16-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build --prod

# Etapa de producción - Usando servidor Angular incluido
FROM node:16-alpine

WORKDIR /app

# Instalar servidor ligero http-server
RUN npm install -g http-server

# Copiar archivos de construcción
COPY --from=build /app/dist/invoicesync-frontend /app

EXPOSE 80

# Iniciar servidor HTTP en el puerto 80
CMD ["http-server", "-p", "80", "--cors", "-a", "0.0.0.0"]
