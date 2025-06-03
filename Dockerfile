# --------------------------------------------------
# Fase de Build (para compilar o código)
# --------------------------------------------------
FROM node:20-bullseye-slim AS builder
WORKDIR /usr/app

# Copia apenas os arquivos necessários para instalar dependências
COPY package.json package-lock.json ./

# Instala dependências exatas do package-lock.json (incluindo peerDependencies)
RUN npm ci --legacy-peer-deps

# Copia o restante do código e compila
COPY . .
RUN npm run build

# Copia o arquivo de configuração do Firebase (ajuste o caminho conforme a sua estrutura)
COPY firebase-adminsdk.json /usr/app/firebase-adminsdk.json

# --------------------------------------------------
# Fase de Produção (imagem final minimalista)
# --------------------------------------------------
FROM node:20-bullseye-slim
WORKDIR /usr/app

# Define variáveis de ambiente para produção
ENV NODE_ENV=production
ENV JWT_SECRET=9fG7@lP3#aD8qYxZ2nJmR5wTuV0kLcFs

# Copia apenas as dependências de produção
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev

# Copia os arquivos compilados da fase de build
COPY --from=builder /usr/app/dist ./dist

# Copia também o JSON de credenciais do Firebase para o local esperado
COPY --from=builder /usr/app/firebase-adminsdk.json ./firebase-adminsdk.json

# Cria um usuário não-root e ajusta permissões
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
RUN chown -R appuser:appgroup /usr/app

USER appuser

# Expõe a porta e define o comando de inicialização
EXPOSE 3333
CMD ["node", "dist/main.js"]
