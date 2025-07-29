# ---- Etapa 1: Build da Aplicação ----
# Usamos uma imagem base para o processo de build.
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container.
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (ou yarn.lock) para instalar dependências.
COPY package.json yarn.lock* package-lock.json* ./

# Instala as dependências.
RUN npm install --legacy-peer-deps --frozen-lockfile

# Copia todo o restante do código da aplicação.
COPY . .

# Constrói a aplicação Next.js para produção.
# NEXT_TELEMETRY_DISABLED=1 desabilita o envio de telemetria da Next.js.
RUN NEXT_TELEMETRY_DISABLED=1 npm run build

# ---- Etapa 2: Execução (Runtime) da Aplicação ----
# Usamos uma imagem base menor e otimizada para execução.
FROM node:20-alpine AS runner

# Define o diretório de trabalho.
WORKDIR /app

# Define variáveis de ambiente para a Next.js.
# Isso é importante para que ela saiba que está em produção.
ENV NODE_ENV production

# Copia apenas os arquivos necessários da etapa de build.
# Isso ajuda a criar uma imagem final menor e mais segura.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static/
COPY --from=builder /app/public ./public

# Expõe a porta que a aplicação Next.js irá escutar.
EXPOSE 3000

# Comando para iniciar a aplicação Next.js em produção.
CMD ["node", "server.js"]