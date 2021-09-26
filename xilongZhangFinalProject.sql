
-- CREATE SCHEMA `nodeMySQL_db`; 

CREATE TABLE IF NOT EXISTS `images` (
  `path` varchar(255) NOT NULL,
  `imageName` varchar(255) NOT NULL,
  `uploader` varchar(255) NOT NULL,
   `username` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `likes` int DEFAULT NULL,
  PRIMARY KEY (`imageName`)

);

-- --
-- -- Insert data for table `images`
-- --

INSERT INTO `images` ( `path`, `imageName`, `uploader`, `username`, `date`, `likes`) VALUES
('/static/uploads/gringotts.jpg', 'gringotts.jpg', 'Edward Z', 'ledruo', '28/4/2021 at 12:57:35', '0'),
('/static/uploads/flag.jpg', 'flag.jpg', 'Edward Z', 'ledruo', '28/4/2021 at 12:57:35', '0'),
('/static/uploads/sunshine.jpg', 'sunshine.jpg', 'Edward Z', 'ledruo', '26/4/2021 at 12:57:35', '0'),
('/static/uploads/alley.jpg', 'alley.jpg', 'Sergio V', 'sergio', '27/4/2021 at 15:57:35', '0'),
('/static/uploads/dragon.jpg', 'dragon.jpg', 'Sergio V', 'sergio', '26/4/2021 at 15:37:35', '0'),
('/static/uploads/express.jpg','express.jpg', 'Sergio V', 'sergio', '29/4/2021 at 17:10:50', '0');


CREATE TABLE IF NOT EXISTS `likes` (
  `imageName` varchar(255) NOT NULL ,
  `username` varchar(30) NOT NULL,
  PRIMARY KEY (`imageName`, `username`)
);

CREATE TABLE IF NOT EXISTS `comments` (
  `imageName` varchar(255) NOT NULL ,
  `content` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
);

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `username` varchar(30) NOT NULL,
  `firstname` varchar(30) DEFAULT NULL,
  `surname` varchar(30) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL, 
  `hint` varchar(50) DEFAULT NULL
);

-- --
-- -- Insert data for table `users`
-- --

INSERT INTO `users` (`username`, `firstname`, `surname`, `password`, `hint`) VALUES
('sergio', 'Sergio', 'V', '1234ha', 'your favourite colour'),
('steve01', 'Steve', 'G', '1234st', 'your favourite memory'),
('vera', 'Vera', 'Y', '1234ve', 'your favourite memory'),
('ledruo', 'Edward', 'Z', '1234ed', 'the easy one');

INSERT INTO `comments` (`imageName`, `content`, `username`) VALUES
('gringotts.jpg', 'seems really cool!', 'sergio'),
('gringotts.jpg', 'i wish i could be there!', 'vera'),
('alley.jpg', 'is this diagonal alley?', 'vera'),
('express.jpg', 'i love it!', 'ledruo'),
('drag.jpg', 'i have been there too!', 'ledruo'),
('express.jpg', 'wish i could go on the train!', 'sergio');








