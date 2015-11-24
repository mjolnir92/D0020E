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
RUN cd /var/workspace/CCNJS && npm install

EXPOSE 9999/udp
EXPOSE 6363/tcp
EXPOSE 3000/tcp
