# D0020E CCN-Lite on Docker.
1. Setup

    1. Install ```npm```

    1. Install ```bower``` from npm with
        ```
        npm install bower -g
        ```

    1. Navigate to project root.

    1. In both the ```Phone``` & ```CCNJS``` folders, run
        ```
        npm install
        ```
    as well as
        ```
        bower install
        ```

    1. Download [CCN-Lite](https://github.com/cn-uofbasel/ccn-lite) to your ```HOME``` folder and build it by running
        ```
        make clean install
        ```
        inside the ```src``` folder.

    1. Add CCN-Lite to your PATH like this:
        ```
        export CCNL_HOME="$HOME/ccn-lite"
export PATH=$PATH:"$CCNL_HOME/bin"
        ```

1. Run

    1. Go to ```ccnjs.js``` and change ```ccnjs.network_interface``` to whatever your network interface is.

        1. Your network interface can be found by running ```ifconfig```. The leftmost name of your current network is your network interface.

    1. Navigate to project root.

    1. To start the phone simulator run
        ```
        node bin/www
        ```
        in ```Phone```.

    1. To start the server run
        ```
        node bin/www
        ```
        in ```CCNJS```.

1. Use

    1. When running Ubuntu it is possible to connect via `localhost`. OSX has `192.168.99.100` as default address.

    1. Connect to ```<address>:3000``` to connect to the server.

       Connect to ```<address>:4000``` to connect to the phone simulator.

1. Connected to phone simulator

    1. Provide name for your phone.

    1. Change values.

    1. (Optional) Press next and choose which alarm to send.

1. Connected to server

    1. Search for name of phone user.

    1. Press the down button to expand the data visualization.

    1. Alarms will pop up in the top right corner.
