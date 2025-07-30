
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastname TEXT DEFAULT NULL,
  firstname TEXT DEFAULT NULL,
  phone TEXT DEFAULT NULL,
  address TEXT DEFAULT NULL,
  avatarPath TEXT DEFAULT NULL,
  status TEXT DEFAULT 'inactive',
  last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
  jwttoken TEXT DEFAULT NULL
);

DROP TABLE IF EXISTS gameInfo;
CREATE TABLE IF NOT EXISTS gameInfo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  winTimes INTEGER DEFAULT 0,
  loseTimes INTEGER DEFAULT 0,
  drawTimes INTEGER DEFAULT 0,
  totalTimes INTEGER DEFAULT 0,
  userId INTEGER UNIQUE DEFAULT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE

);

DROP TABLE IF EXISTS details;
CREATE TABLE IF NOT EXISTS details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  opponent TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  win INTEGER DEFAULT 0,
  lose INTEGER DEFAULT 0,
  draw INTEGER DEFAULT 0,
  score TEXT DEFAULT '0',
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS friends;
CREATE TABLE IF NOT EXISTS friends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  friendName TEXT NOT NULL,
  startDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);


INSERT INTO users (username, password, email, avatarPath)
VALUES (
  'admin',
  '$2b$10$ic8hCSLIAodzUsH7BWbQyel2Gns5A8edv1E8.MN/2fFHfbLp8xIx6',
  'mingwei.wu@hotmail.com',
  '/public/df.jpeg'
);


INSERT INTO users (username, password, email, lastname, firstname, phone, address, avatarPath, status)
VALUES (
  'test',
  '$2b$10$ic8hCSLIAodzUsH7BWbQyel2Gns5A8edv1E8.MN/2fFHfbLp8xIx6',
  'john.doe@example.com',
  'Doe',
  'John',
  '1234567890',
  '123 Main St',
  '/public/df.jpeg',
  'inactive'
);



INSERT INTO users (username, password, email, lastname, firstname, phone, address, avatarPath, status)
VALUES (
  'user',
  '$2b$10$ic8hCSLIAodzUsH7BWbQyel2Gns5A8edv1E8.MN/2fFHfbLp8xIx6',
  'jdoe@example.com',
  'Dodde',
  'Johddn',
  '1234567890',
  '123 Main St',
  '/public/df.jpeg',
  'inactive'
);



INSERT INTO users (username, password, email, lastname, firstname, phone, address, avatarPath, status)
VALUES (
  'user2',
  '$2b$10$ic8hCSLIAodzUsH7BWbQyel2Gns5A8edv1E8.MN/2fFHfbLp8xIx6',
  'jdoe2@example.com',
  'Dodde2',
  'Johddn2',
  '1234567890',
  '1232 Main St',
  '/public/df.jpeg',
  'inactive'
);



INSERT INTO gameInfo (winTimes, loseTimes, drawTimes, totalTimes, userId)
VALUES (15,5,3,23,2);


INSERT INTO details (userId, opponent, startDate, endDate, win, lose, draw, score) VALUES 
(2, 'player1', '2025-04-01', '2025-04-01', 1, 0, 0, '3-1'),
(2, 'player2', '2025-03-30', '2025-03-30', 0, 1, 0, '1-2'),
(2, 'player3', '2025-03-28', '2025-03-28', 0, 0, 1, '2-2'),
(2, 'player4', '2025-03-25', '2025-03-25', 1, 0, 0, '4-0'),
(2, 'player5', '2025-03-20', '2025-03-20', 0, 1, 0, '1-3'),
(2, 'player6', '2025-03-18', '2025-03-18', 1, 0, 0, '2-1'),
(2, 'player7', '2025-03-15', '2025-03-15', 0, 0, 1, '0-0'),
(2, 'player8', '2025-03-10', '2025-03-10', 1, 0, 0, '3-2'),
(2, 'player9', '2025-03-05', '2025-03-05', 0, 1, 0, '1-3'),
(2, 'player10', '2025-02-28', '2025-02-28', 1, 0, 0, '2-0');

INSERT INTO friends (userId, friendName, startDate)
VALUES (1, 'test', '2025-04-01'),
       (1, 'user', '2025-03-30'),
       (2, 'admin', '2025-03-28'),
       (2, 'user', '2025-03-25'),
       (3, 'admin', '2025-03-20'),
       (3, 'test', '2025-03-18');

DROP TABLE IF EXISTS friend_message;
CREATE TABLE IF NOT EXISTS friend_message (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userEmail TEXT,
  sender TEXT, 
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS blocked_users;
CREATE TABLE IF NOT EXISTS blocked_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blocker_email TEXT NOT NULL,
  blocked_email TEXT NOT NULL,
  UNIQUE (blocker_email, blocked_email),
  FOREIGN KEY (blocker_email) REFERENCES users(email) ON DELETE CASCADE,
  FOREIGN KEY (blocked_email) REFERENCES users(email) ON DELETE CASCADE
);





-- CREATE DATABASE IF NOT EXISTS tr;
-- USE tr;

-- -- Create the users table first
-- CREATE TABLE IF NOT EXISTS users (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   username VARCHAR(50) NOT NULL UNIQUE,
--   password VARCHAR(255) NOT NULL,
--   email VARCHAR(100) NOT NULL UNIQUE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   lastname VARCHAR(50) DEFAULT NULL,
--   firstname VARCHAR(50) DEFAULT NULL,
--   phone VARCHAR(20) DEFAULT NULL,
--   address VARCHAR(255) DEFAULT NULL,
--   avatarPath VARCHAR(255) DEFAULT NULL,
--   status ENUM('active', 'inactive') DEFAULT 'inactive',
--   last_active TIMESTAMP DEFAULT NULL,
--   jwttoken VARCHAR(255) DEFAULT NULL
-- );

-- CREATE TABLE IF NOT EXISTS gameInfo (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   winTimes INT DEFAULT 0,
--   loseTimes INT DEFAULT 0,
--   drawTimes INT DEFAULT 0,
--   totalTimes INT DEFAULT 0,
--   userId INT UNIQUE DEFAULT NULL
-- );


-- ALTER TABLE gameInfo ADD CONSTRAINT fk_gameInfo_userId FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;


-- CREATE TABLE IF NOT EXISTS details (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   userId INT NOT NULL,
--   opponent VARCHAR(255) NOT NULL,
--   startDate VARCHAR(255) NOT NULL,
--   endDate VARCHAR(255) NOT NULL,
--   win INT DEFAULT 0,
--   lose INT DEFAULT 0,
--   draw INT DEFAULT 0,
--   score VARCHAR(100) DEFAULT 0,
--   FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS friends (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   userId INT NOT NULL,
--   friendName VARCHAR(255) NOT NULL,
--   startDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

--   FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
-- );



-- INSERT INTO users (username, password, email, avatarPath)
-- VALUES ('admin', '$2b$10$ic8hCSLIAodzUsH7BWbQyel2Gns5A8edv1E8.MN/2fFHfbLp8xIx6', 'mingwei.wu@hotmail.com',   '/public/df.jpeg');

-- INSERT INTO users (username, password, email, lastname, firstname, phone, address, avatarPath, status)
-- VALUES (
--   'test',
--   '$2b$10$ic8hCSLIAodzUsH7BWbQyel2Gns5A8edv1E8.MN/2fFHfbLp8xIx6',
--   'john.doe@example.com',
--   'Doe',
--   'John',
--   '1234567890',
--   '123 Main St',
--   '/public/df.jpeg',
--   'inactive'
-- );

-- INSERT INTO users (username, password, email, lastname, firstname, phone, address, avatarPath, status)
-- VALUES (
--   'user',
--   '$2b$10$ic8hCSLIAodzUsH7BWbQyel2Gns5A8edv1E8.MN/2fFHfbLp8xIx6',
--   'jdoe@example.com',
--   'Dodde',
--   'Johddn',
--   '1234567890',
--   '123 Main St',
--   '/public/df.jpeg',
--   'inactive'
-- );

-- INSERT INTO users (username, password, email, lastname, firstname, phone, address, avatarPath, status)
-- VALUES (
--   'user2',
--   '$2b$10$ic8hCSLIAodzUsH7BWbQyel2Gns5A8edv1E8.MN/2fFHfbLp8xIx6',
--   'jdoe2@example.com',
--   'Dodde2',
--   'Johddn2',
--   '1234567890',
--   '1232 Main St',
--   '/public/df.jpeg',
--   'inactive'
-- );

-- INSERT INTO gameInfo (winTimes, loseTimes, drawTimes, totalTimes, userId)
-- VALUES (15,5,3,23,2);


-- INSERT INTO details (userId, opponent, startDate, endDate, win, lose, draw, score) VALUES 
-- (2, 'player1', '2025-04-01', '2025-04-01', 1, 0, 0, '3-1'),
-- (2, 'player2', '2025-03-30', '2025-03-30', 0, 1, 0, '1-2'),
-- (2, 'player3', '2025-03-28', '2025-03-28', 0, 0, 1, '2-2'),
-- (2, 'player4', '2025-03-25', '2025-03-25', 1, 0, 0, '4-0'),
-- (2, 'player5', '2025-03-20', '2025-03-20', 0, 1, 0, '1-3'),
-- (2, 'player6', '2025-03-18', '2025-03-18', 1, 0, 0, '2-1'),
-- (2, 'player7', '2025-03-15', '2025-03-15', 0, 0, 1, '0-0'),
-- (2, 'player8', '2025-03-10', '2025-03-10', 1, 0, 0, '3-2'),
-- (2, 'player9', '2025-03-05', '2025-03-05', 0, 1, 0, '1-3'),
-- (2, 'player10', '2025-02-28', '2025-02-28', 1, 0, 0, '2-0');



-- INSERT INTO friends (userId, friendName, startDate)
-- VALUES (1, 'test', '2025-04-01'),
--        (1, 'user', '2025-03-30'),
--        (2, 'admin', '2025-03-28'),
--        (2, 'user', '2025-03-25'),
--        (3, 'admin', '2025-03-20'),
--        (3, 'test', '2025-03-18');


-- CREATE TABLE IF NOT EXISTS friend_message (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   userEmail VARCHAR(100),
--   sender VARCHAR(50) , 
--   message VARCHAR(255),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--   );

-- -- block user feature
-- -- CREATE TABLE IF NOT EXISTS blocked_users (
-- --   id INT AUTO_INCREMENT PRIMARY KEY,
-- --   blocker VARCHAR(50) NOT NULL,
-- --   blocked VARCHAR(50) NOT NULL,
-- --   UNIQUE KEY (blocker, blocked)
-- -- );

-- CREATE TABLE IF NOT EXISTS blocked_users (
--   id              INT AUTO_INCREMENT PRIMARY KEY,
--   blocker_email   VARCHAR(100) NOT NULL,
--   blocked_email   VARCHAR(100) NOT NULL,
--   UNIQUE KEY (blocker_email, blocked_email),
--   FOREIGN KEY (blocker_email) REFERENCES users(email) ON DELETE CASCADE,
--   FOREIGN KEY (blocked_email)  REFERENCES users(email) ON DELETE CASCADE
-- );
