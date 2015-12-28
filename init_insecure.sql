DROP DATABASE IF EXISTS AngularChat_insecure;
CREATE DATABASE AngularChat_insecure;
GRANT ALL ON AngularChat_insecure.* TO cs4105@localhost IDENTIFIED BY "cs4105";
USE AngularChat_insecure;
CREATE TABLE messages (id INT(8) NOT NULL AUTO_INCREMENT, message VARCHAR(50) NOT NULL, user VARCHAR(12) NOT NULL, PRIMARY KEY (id));
INSERT INTO messages (message, user) VALUES ("This is a test!","testUser");