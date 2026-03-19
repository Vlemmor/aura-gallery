FROM nginx:alpine
COPY . /usr/share/nginx/html
# Nginx template to map Railway's dynamic $PORT variable correctly
COPY default.conf.template /etc/nginx/templates/default.conf.template
