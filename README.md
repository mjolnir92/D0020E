# D0020E ccn-lite on Docker.

1. Navigate to project root and run:
    ```
    docker build -t d0020e/ccn_vest:dev .
    ```
This creates a Docker image from our Dockerfile.

2. List all docker images on your machine with:
    ```
    docker images
    ```
Note the IMAGE_ID of the created image.

3. Create and run a container with:
    ```
    docker run -p 3000:3000/tcp -p 6363:6363/tcp -p 9999:9999/udp d0020e/ccn_vest:dev
    ```
      * `3000:3000/tcp` is the webserver for configuring the relay.
      * `6363:6363/tcp` is a webserver showing information about the relay.
      * `9999:9999/udp` is the relay access port.


4. When running ubuntu it is possible to connect via `localhost`. OSX has `192.168.99.100` as default address.
