FROM node:20-alpine

WORKDIR /app

# Сначала копируем только package.json для кэширования слоев
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --include=dev

# Теперь копируем остальные файлы проекта
COPY . .

# Устанавливаем переменные окружения
ARG VITE_APP_API_URL
ENV VITE_APP_API_URL=$VITE_APP_API_URL

EXPOSE 5173

# Запускаем dev-сервер
CMD ["npm", "run", "dev"]
