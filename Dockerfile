FROM ubuntu:14.04
MAINTAINER Magnus Bjoerk <mugsan@gmail.com>

ENV DEBIAN_FRONTEND noninteractive
ENV CCNL_HOME /var/workspace/ccn-lite
ENV PATH "$PATH:$CCNL_HOME/bin"
ENV USE_NFN 1

RUN apt-get -y update && apt-get install -y \
    build-essential \
    openjdk-7-jre \
    libssl-dev \
    nodejs \
    wget \
    npm

ADD . /var/workspace
WORKDIR /var/workspace
RUN cd ccn-lite/src && make clean all
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN cd /var/workspace/CCNJS && npm rebuild node-sass && npm install

EXPOSE 9999/udp 6363/tcp 3000/tcp

CMD /var/workspace/CCNJS/bin/www