# Poll Generator

A poll service that allows clients to create or vote polls with pre-defined choices. The poll can be configured as a public poll or a private poll. Clients are able to select one choice or multiple choices at a time.

## Getting Started

The project is packed into [Vagrantfile](https://www.vagrantup.com/) which contains all the declarative configuration about software requirements, packages, operating system configuration, etc...

### Prerequisites

* **Virtual Box** (or any kind of virtual machine). Install Virtual box based on your OS System [here](https://www.virtualbox.org/wiki/Downloads)


* **Vagrant**. Install based on your OS System [here](https://www.vagrantup.com/downloads.html)

### Installing

Firstly clone this project to your local and simply run the below command and wait until it finishing

```
cd yourRepoLocation
vagrant up
```

Port ``80`` in the virtual machine is forwarded to port ```8080``` on your local. Thus, access the project from your local browser through ```localhost:8080``` or ```127.0.0.1:8080```

* You can manually adjust the port by changing this line in ```Vagrantfile``` at project directory:
```config.vm.network "forwarded_port", guest: 80, host: [your port]```

Some useful vagrant commands:

* ```vagrant status```: return the state of the machines Vagrant is managing
* ```vagrant ssh```: SSH into a running Vagrant machine and give you access to a shell
* ```vagrant halt```: shuts down the running machine Vagrant is managing
* ```vagrant destroy```: stops the running machine Vagrant is managing and destroys all resources
* ```vagrant reload --provision```: the equivalent of running a halt followed by an up and force the provisioners to run.

Other commands can be found [here](https://www.vagrantup.com/docs/cli/reload.html)

## Built With

* [Vagrant](https://www.vagrantup.com/) - Setup the development environment
* [Nginx](https://www.nginx.com/) - Reverse proxy server for more efficitently handling routes that require static files and forward dynamic routes to the proper server
* [Node.js](https://nodejs.org/en/) - Application server
* [Express.js](https://expressjs.com/) - The web framework for node.js
* [Redis](https://redis.io/) - In-memory database, responsible for high speed voting to avoid directly write to Postgresql DB which may cause losing the information due to high speed
* [Postgresql](https://www.postgresql.org/) - Relational database to store all the information
* [Socket.io](https://socket.io/) - Realtime, bi-directional communication between web clients and server, socket.io plays a crucial role in real-time updating poll result
* [React](https://reactjs.org/) - The client javascript framework
* [Redux](https://redux.js.org/introduction/getting-started) - The state management framwork for React
