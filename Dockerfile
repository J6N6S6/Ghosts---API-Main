# Fase de Build (para compilar o código)
FROM node:20-alpine AS builder
WORKDIR /usr/app

# Copia apenas os arquivos necessários para instalar dependências
COPY package.json package-lock.json ./

# Instala dependências exatas do package-lock.json (incluindo peerDependencies)
RUN npm ci --legacy-peer-deps

# Copia o restante do código e compila
COPY . .
RUN npm run build

# Copia o arquivo de configuração do Firebase
COPY firebase-adminsdk.json /app/firebase-adminsdk.json

# --------------------------------------------

# Fase de Produção (imagem final minimalista)
FROM node:20-alpine
WORKDIR /usr/app

# Define variáveis de ambiente para produção
ENV NODE_ENV=production

# Copia apenas as dependências de produção
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev

# Copia os arquivos compilados da fase de build
COPY --from=builder /usr/app/dist ./dist

# Cria um usuário não-root e ajusta permissões
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /usr/app
USER appuser

# Expõe a porta e define o comando de inicialização
EXPOSE 3333
CMD ["node", "dist/main.js"]