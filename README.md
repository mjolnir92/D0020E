# D0020E ccn-lite on Docker.

1. Navigate to project root and run:
```
> docker build .
```
This will create a Docker image from our Dockerfile.

2. Check the id of created image with:
```
> docker images
```
3. Run the container with:
```
> docker run -p 3000:3000/tcp -p 6363:6363/tcp -p 9999:9999/udp CONTAINER_ID
```
-p flags binds ports to VM interface.
4. Connect to the ccn-relay with a browser e.g. `http://192.168.99.100:3000`, relay info: `http://192.168.99.100:6363`
