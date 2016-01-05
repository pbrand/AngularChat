DROP DATABASE IF EXISTS Chat_secure;
CREATE DATABASE Chat_secure;
GRANT ALL ON Chat_secure.* TO cs4105@localhost IDENTIFIED BY "cs4105";
USE Chat_secure;
CREATE TABLE messages (id INT(8) NOT NULL AUTO_INCREMENT, message VARCHAR(50) NOT NULL, user VARCHAR(100) NOT NULL, PRIMARY KEY (id));
INSERT INTO messages (message, user) VALUES ("Welcome to the chatroom!","Team SP");
INSERT INTO messages (message, user) VALUES ("Feel free to use Markdown, if you wish =)!","Team SP");
CREATE TABLE users (id INT(8) NOT NULL AUTO_INCREMENT, username VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, PRIMARY KEY (id));
