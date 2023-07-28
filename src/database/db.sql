DROP DATABASE IF EXISTS reddit;
CREATE DATABASE reddit;
use reddit;

CREATE TABLE reddits (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	description VARCHAR(50) NOT NULL,
	member_count INT NOT NULL DEFAULT 0,
	image_link VARCHAR(100)
);

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL
);

CREATE TABLE members (
	user_id INT NOT NULL,
	reddit_id INT NOT NULL,
	join_date TIMESTAMP NOT NULL DEFAULT NOW(),
	FOREIGN KEY(user_id) REFERENCES users(id),
	FOREIGN KEY(reddit_id) REFERENCES reddits(id),
	PRIMARY KEY(user_id, reddit_id)
);

CREATE TABLE posts (
	id INT AUTO_INCREMENT PRIMARY KEY,
	author_id INT NOT NULL,
	reddit_id INT NOT NULL,
	title VARCHAR(50) NOT NULL,
	content VARCHAR(250) NOT NULL,
	upvotes INT NOT NULL DEFAULT 0,
	downvotes INT NOT NULL DEFAULT 0,
	num_comments INT DEFAULT 0,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	FOREIGN KEY(author_id) REFERENCES users(id),
	FOREIGN KEY(reddit_id) REFERENCES reddits(id)
);

DELIMITER $$
CREATE TRIGGER joining_a_reddit
	AFTER INSERT ON members
	FOR EACH ROW
	BEGIN
		UPDATE reddits SET member_count = member_count + 1
		WHERE id = NEW.reddit_id;
	END $$

CREATE TRIGGER quiting_a_reddit
	AFTER DELETE ON members
	FOR EACH ROW
	BEGIN
		UPDATE reddits SET member_count = member_count - 1
		WHERE id = OLD.reddit_id;
	END $$
DELIMITER ;

INSERT INTO reddits (name, description) VALUES
	("tortas", "Apasionados por la pasteleria."),
	("compus", "Nos encantan las compus."),
	("viajes", "Conoceremos el mundo.");

INSERT INTO users (name, email) VALUES
	("juanceto01", "juanceto01@gmail.com"),
	("momo", "momorelojero@yahoo.com"),
	("goku", "songoku@gmail.com");

INSERT INTO members (user_id, reddit_id) VALUES
	(1, 1),
	(1, 2),
	(2, 1),
	(2, 3),
	(3, 1);
