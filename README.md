# AngularChat
Chat applications for Software Security course.
This repository contains two versions of the same chat application. The first uses the recommendations for writing secure applications, and the second  tries to intentionally introduce security vulnerabilities.

## Repository info:
A branch '**insecure**' is created which should be seen as the master branch of the insecure application. Deletion of this branch as wel as direct pushes to this branch are prohibited. Please create a new branch with this branch as a base for each feature and submit a pull request to get your changes into the 'insecure' branch.
Later a '**secure**' branch should be created in a similar way.


## Virtual Machine info:
In order to locally deploy the server in a standardized way, we created a virtualized environment which runs the server and the databases. The image is distributed amongst the members of the group.

user: cs4105 pw: cs4105
user: root pw: fedora

access the server via ssh from local machine: ssh cs4105@127.0.0.1 -p 2015  
access the webserver from local machine: localhost:2016

The DocumentRoot of the webserver is set to: */var/www/html/AngularChat*, which is the root of the git repository.   
The local repository of the server should **only** pull from **either** the 'secure' or 'insecure' branch.

The following databases are available for user: cs4105 pw: cs4105 
* AngularChat_insecure
* AngularChat_secure