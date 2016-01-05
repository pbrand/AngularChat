# SocketChat
Chat applications for Software Security course.
This repository contains two versions of the same chat application. The first uses the recommendations for writing secure applications, and the second  tries to intentionally introduce security vulnerabilities.

This chat application makes use of NodeJS and Socket.io. A **package.json** is added to the repository, so 
one can run:
    ```npm install```
from the root of the repository and all dependencies will get installed.  

In order to run the application: ```node server.js``` and go to localhost:3000 in your browser.

## Repository info:
A branch '**secure**' is created which should be seen as the master branch of the secure application. Deletion of this branch as wel as direct pushes to this branch are prohibited. In a similar way the insecure branch is created for the insecure application

## Virtual Machine info:
### General info:
In order to locally deploy the server in a standardized way, we created a virtualized environment which runs the server and the databases. The image is distributed amongst the members of the group.

user: cs4105 pw: cs4105
user: root pw: fedora

access the server via ssh from local machine: ssh cs4105@127.0.0.1 -p 2015  
access the application from local machine: localhost:3000.  

In order for this to work, one should forward port 3000 remote to port 3000 locally in the VM Network settings of VirtualBox and port 3000 should be allowed by the firewall. One can open the port by running: ```sudo firewall-cmd --zone=FedoraServer --add-port=3000/tcp; sudo firewall-cmd --zone=FedoraServer --add-port=3000/tcp --permanent```

The DocumentRoot of the webserver is set to: */var/www/html/SocketChat*, which is the root of the git repository.   
The local repository of the server should **only** pull from **either** the 'secure' or 'insecure' branch.

### Database info:
user: root pw: cs4105
user: cs4105 pw: cs4105

The following databases are available for user: cs4105 
* Chat_insecure
* Chat_secure

One can "reset" the database by running: ```mysql -u root -p < init_db.sql```

## Set up a machine yourself:
One can run this code locally as follows:
* Install *MariaDB* and start the database server.
* Install *node*.
* Install *npm*.
* Clone the repository and checkout either the **secure** or **insecure** branch.
* Run: ```npm install``` to install the required dependencies.
* Run: ```mysql -u root -p < init_db.sql``` to populate the database.
* Run: ```node server.js``` to start the server.
* Visit ```localhost:3000``` in your browser.
