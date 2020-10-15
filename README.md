# nordvpn

unofficial NordVPN linux client ( command line interface )

![terminal](/terminal.gif)

## Features
* easy to use interactive command line interface.
* enter your username and password only once.
* automatically find the best server for you.
* portable to linux, and doesn't require node/npm.


## System Requirements
* 64 bit linux operating system.
* openvpn installed

## Setup

Install from source:
```bash
npm i

npm run build-linux

cp dist/nordvpn /usr/local/bin/

chmod +x /usr/local/bin/nordvpn
```


## Usage
start the vpn using `nordvpn`, the first time it's going to prompt you to enter your nordvpn username and password, however it will be saved in `/home/${USER}/.nordvpn/auth.txt` to be used later and avoid writing the user/pass everytime.

now it'll sort all available servers.

it'll select the best server, download it's configurations file, append your credentials and connect to this server using the native openvpn implementation on your system.
