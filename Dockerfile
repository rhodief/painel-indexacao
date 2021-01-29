FROM node:14.15

WORKDIR /usr/app

COPY ./ /usr/app

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

RUN npm install -g @angular/cli

EXPOSE 4200

CMD ["npm", "run","dev"]