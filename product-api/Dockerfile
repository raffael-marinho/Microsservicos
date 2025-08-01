# Imagem base do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que a aplicação Express irá escutar
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "index.js"]