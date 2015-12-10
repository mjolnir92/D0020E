# D0020E ccn-lite on Docker.

1. Navigate to project root and run:
```
docker build .
```
This creates a Docker image from our Dockerfile.

2. List all docker images on your machine with:
```
docker images
```
Note the IMAGE_ID of the created image.

3. Create and run a container with:
```
docker run -p 3000:3000/tcp -p 6363:6363/tcp -p 9999:9999/udp IMAGE_ID
```
-p flags binds ports to VM interface.

4. Connect to the ccn-relay with a browser e.g. `http://192.168.99.100:3000`, relay info: `http://192.168.99.100:6363`
