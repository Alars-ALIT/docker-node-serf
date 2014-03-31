FROM stackbrew/ubuntu:13.10

# Apt-get
RUN apt-get -y update
RUN apt-get -y upgrade 
RUN apt-get -y install python-software-properties python g++ make software-properties-common
RUN add-apt-repository ppa:chris-lea/node.js && apt-get update

# Tools
RUN apt-get -y install nano && apt-get -y install wget && apt-get -y install unzip

# Serf
ADD https://dl.bintray.com/mitchellh/serf/0.5.0_linux_amd64.zip serf0.5.zip
RUN unzip serf0.5.zip
RUN mv serf /usr/bin/
EXPOSE 7946/udp 7946/tcp

# Supervisor
RUN apt-get install -y supervisor
RUN mkdir -p /var/log/supervisor

# Node
RUN apt-get -y install nodejs