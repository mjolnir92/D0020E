FROM ubuntu:14.04
MAINTAINER Magnus Bjoerk <mugsan@gmail.com>

ENV DEBIAN_FRONTEND noninteractive
ENV WS /var/workspace
ENV CCNL_HOME $WS/ccn-lite
ENV PATH "$PATH:$CCNL_HOME/bin"
ENV USE_NFN 1

RUN apt-get -y update && apt-get install -y \
    build-essential \
    libssl-dev \
    nodejs \
    npm

# install node_modules
RUN ln -s /usr/bin/nodejs /usr/bin/node
ADD ./CCNJS/package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $WS/CCNJS \
    && cp -a /tmp/node_modules $WS/CCNJS

ADD ./ccn-lite $WS/ccn-lite
RUN cd $WS/ccn-lite/src \
    && make clean all

ADD . $WS
WORKDIR $WS
# compile ccn-lite

# add application files

EXPOSE 9999/udp \
    6363/tcp \
    3000/tcp

CMD ./CCNJS/bin/www
