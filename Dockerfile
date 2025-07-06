# React 앱 빌드용 Node 환경
FROM node:18 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Nginx로 정적 파일 서비스
FROM nginx:alpine

# React 빌드 파일 복사
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
