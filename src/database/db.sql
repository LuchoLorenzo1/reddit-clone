DROP DATABASE IF EXISTS reddit;
CREATE DATABASE reddit;
use reddit;

CREATE TABLE reddits (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(21) NOT NULL UNIQUE,
	description VARCHAR(1000) NOT NULL,
	member_count INT NOT NULL DEFAULT 0,
	image_link VARCHAR(100),
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(21) NOT NULL UNIQUE,
	email VARCHAR(50) NOT NULL,
	provider VARCHAR(50) NOT NULL,
	provider_id VARCHAR(200) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	UNIQUE KEY (provider, provider_id)
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
	title VARCHAR(200) NOT NULL,
	content VARCHAR(20000) NOT NULL,
	upvotes INT NOT NULL DEFAULT 0,
	downvotes INT NOT NULL DEFAULT 0,
	num_comments INT DEFAULT 0,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	FOREIGN KEY(author_id) REFERENCES users(id),
	FOREIGN KEY(reddit_id) REFERENCES reddits(id)
);

CREATE TABLE votes (
	user_id INT NOT NULL,
	post_id INT NOT NULL,
	is_upvote BOOLEAN NOT NULL,
	FOREIGN KEY(user_id) REFERENCES users(id),
	FOREIGN KEY(post_id) REFERENCES posts(id),
	PRIMARY KEY(user_id, post_id)
);

DELIMITER $$
CREATE TRIGGER joining_a_reddit AFTER INSERT ON members
FOR EACH ROW
BEGIN
	UPDATE reddits SET member_count = member_count + 1
	WHERE id = NEW.reddit_id;
END $$

CREATE TRIGGER quiting_a_reddit AFTER DELETE ON members
FOR EACH ROW
BEGIN
	UPDATE reddits SET member_count = member_count - 1
	WHERE id = OLD.reddit_id;
END $$

CREATE TRIGGER update_vote AFTER UPDATE ON votes
FOR EACH ROW
BEGIN
		IF (NEW.is_upvote = false AND OLD.is_upvote = true) THEN
			UPDATE posts SET downvotes = downvotes + 1, upvotes = upvotes - 1 WHERE id = NEW.post_id;
		ELSEIF (NEW.is_upvote = true AND OLD.is_upvote = false) THEN
			UPDATE posts SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.post_id;
		END IF;
END $$

CREATE TRIGGER insert_vote AFTER INSERT ON votes
FOR EACH ROW
BEGIN
		IF (NEW.is_upvote = false) THEN
			UPDATE posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
		ELSE
			UPDATE posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
		END IF;
END $$

CREATE TRIGGER delete_vote AFTER DELETE ON votes
FOR EACH ROW
BEGIN
		IF (OLD.is_upvote = false) THEN
			UPDATE posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
		ELSE
			UPDATE posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
		END IF;
END $$
DELIMITER ;

INSERT INTO reddits (name, description) VALUES
	("devsarg", "Publica tus proyectos, dudas o busca inspiracion para acercarte a cualquier lenguaje de programacion!"),
	("compus", "Nos encantan las compus."),
	("viajes", "Conoceremos el mundo.");

INSERT INTO users (name, email, provider, provider_id) VALUES
	("juanceto01", "juanceto01@gmail.com", "google", "1"),
	("momo", "momorelojero@yahoo.com", "google", "2"),
	("goku", "songoku@gmail.com", "google", "3");

INSERT INTO members (user_id, reddit_id) VALUES
	(1, 1),
	(1, 2),
	(2, 1),
	(2, 3),
	(3, 1);

INSERT INTO posts (author_id, reddit_id, title, content) VALUES
	(2, 2, "que grafica me recomiendan", "quiero una grafica potente para jugar minecraft"),
	(3, 2, "se me rompio la compu", "como puedo arreglarla? alguno me ayuda pls"),
	(1, 3, "Alguno estuvo en roma?", "Quiero viajar a italia este 2023, pero no se donde hospedarme"),
	(1, 1, "y esos auris de virgo momo?", "solo quiero saber cuales son los auris");

INSERT INTO votes (user_id, post_id, is_upvote) VALUES
	(1, 1, true),
	(1, 2, true),
	(2, 1, false);
