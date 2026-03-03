FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

RUN printf '%s\n' \
	'server {' \
	'  listen 80;' \
	'  server_name _;' \
	'  root /usr/share/nginx/html;' \
	'  index index.html;' \
	'' \
	'  location / {' \
	'    try_files $uri $uri/ /index.html;' \
	'  }' \
	'' \
	'  location ~* \.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {' \
	'    expires 1y;' \
	'    add_header Cache-Control "public, immutable";' \
	'    try_files $uri =404;' \
	'  }' \
	'}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
