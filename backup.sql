-- MySQL dump 10.13  Distrib 9.0.1, for macos14.4 (x86_64)
--
-- Host: localhost    Database: Registration
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `description` text NOT NULL,
  `due_date` date NOT NULL,
  `title` varchar(255) NOT NULL,
  `total_points` int NOT NULL DEFAULT '100',
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,6,'Page 258 #3-29','2025-04-11','',100),(2,7,'Page 200 #23-30','2025-04-25','Chapter 8',100),(3,7,'HW # 2000','2025-04-26','Chapter 9',100),(4,7,'temp','2025-04-30','temp',100),(5,15,'this is a test','2025-04-19','Math',100),(6,9,'#1-20','2025-05-01','Assessment #17',100),(7,3,'Chapter 10','2024-04-28','Read Chapter 10',100),(8,3,'Chapter 10','2025-04-28','Read Chapter 10',100),(9,15,'Test','2025-05-09','Test',100),(10,15,'Test','2025-05-24','Later Test',100),(11,6,'This is to test Message sending system','2025-05-24','Test Messages',100),(12,6,'This is to test messages','2025-05-16','Message Tester',100),(13,6,'This is to test messages','2025-05-16','Message Tester',100),(14,6,'This is to test messages','2025-05-23','Testing Messages',100),(15,6,'Messages','2025-05-23','Implementing Messages',100),(16,7,'Test','2025-05-23','New Assignment Message Test',100),(17,9,'Slave away 12 weeks of your life working for a scuffed assignment system.','2025-06-22','The Horrible Assignment Creating System',100),(18,9,'','2025-06-12','',100),(19,9,'10 AME problems','2025-05-11','Ame Problems 1',100),(20,6,'testing real assignment google.com','2025-05-19','Real Assignment',100),(21,9,'Demonstrate physics by jumping off a suitable height for death','2025-05-24','KYS',100),(22,7,'usuyasydhasdg','2025-12-03','hsdhshsh',100),(23,7,'usuyasydhasdg','2025-12-03','hsdhshsh',100),(24,7,'usuyasydhasdg','2025-12-03','hsdhshsh',100),(25,7,'usuyasydhasdg','2044-12-03','hsdhshsh',100),(26,7,'usuyasydhasdg','2025-12-03','hsdhshsh',100),(27,7,'usuyasydhasdg','2044-12-03','hsdhshsh',100),(28,7,'Create and solve 10 different addition problems. Each problem should include two numbers, and the sum should not exceed 100. Write down the problems and their solutions on a piece of paper.','2025-06-18','Addition Problem Assignment',100),(29,7,'Create and solve 10 different addition problems. Each problem should include two numbers, and the sum should not exceed 100. Write down the problems and their solutions on a piece of paper.','2025-06-18','Addition Problem Assignment',100),(30,7,'Solve the following two digital addition problems. Ensure to show all your work and write the final answer in the space provided.\n\n1. 123 + 456 = ?\n2. 789 + 321 = ?','2023-04-10','Digital Addition Problems',100),(31,7,'Solve the following single digit addition problem: 5 + 3 = ?','2023-04-10','Single Digit Addition Problem',100),(32,6,'Create a C++ program that demonstrates the use of different types of loops (for, while, and do-while) to solve a problem. The program should include at least one example of each loop type. The problem to solve is calculating the sum of the first N natural numbers, where N is input by the user. For the for loop, calculate the sum. For the while loop, calculate the factorial of N. For the do-while loop, print all even numbers up to N. Ensure your program is well-commented to explain each part of the code.','2023-04-15','C++ Loops Demonstration Assignment',100),(33,15,'Complete the following exercises on dividing fractions. For each problem, show all your work and simplify your answers to the lowest terms. Use the \'Keep, Change, Flip\' method to divide the fractions. 1) 3/4 ÷ 2/3, 2) 5/6 ÷ 1/2, 3) 7/8 ÷ 3/4, 4) 9/10 ÷ 3/5, 5) Create your own fraction division problem and solve it.','2025-11-10','Mastering Fraction Division',100),(34,15,'This assignment is designed to introduce students to the concept of logarithms, their properties, and how they are applied in various mathematical and real-world contexts. Students will be required to solve logarithmic equations, understand the relationship between exponential and logarithmic functions, and apply logarithmic properties to simplify expressions. Additionally, students will explore the use of logarithms in calculating pH levels in chemistry, measuring earthquake intensity (Richter scale), and in the decibel scale for sound intensity. The assignment includes a mix of theoretical questions and practical problems to ensure a comprehensive understanding of logarithms.','2023-06-15','Exploring Logarithms: Understanding and Application',100),(36,15,'Simplify the following fractions to their lowest terms. Show all your work to receive full credit. 1) 8/12 2) 15/25 3) 9/27 4) 20/45 5) 16/24 6) 18/36 7) 14/21 8) 10/30 9) 22/33 10) 28/42','2023-04-15','Fraction Simplification Practice',100),(37,15,'Simplify the following fractions to their lowest terms. Show all your work to receive full credit. 1) 8/12 2) 15/25 3) 9/27 4) 20/45 5) 16/24 6) 18/36 7) 14/21 8) 10/30 9) 22/33 10) 28/42','2023-04-15','Fraction Simplification Practice',100),(39,15,'Simplify the following fractions to their lowest terms. Show all your work to receive full credit. 1) 8/12 2) 15/25 3) 9/27 4) 20/45 5) 16/24 6) 18/36 7) 14/21 8) 10/30 9) 22/33 10) 28/42','2023-04-15','Fraction Simplification Practice',100),(42,15,'Simplify the following fractions to their lowest terms. Show all your work to receive full credit. 1) 8/12 2) 15/25 3) 9/27 4) 20/45 5) 16/24 6) 18/36 7) 14/21 8) 10/30 9) 22/33 10) 28/42','2023-04-15','Fraction Simplification Practice',100),(43,15,'Simplify the following fractions to their lowest terms. Show all your work to receive full credit. 1) 8/12 2) 15/25 3) 9/27 4) 20/45 5) 16/24 6) 18/36 7) 14/21 8) 10/30 9) 22/33 10) 28/42','2023-04-15','Fraction Simplification Practice',100),(44,15,'Research and present a detailed report on one of the Seven Wonders of the Ancient World or the New Seven Wonders of the World. Your report should include the history, significance, and current status of the wonder you choose. Additionally, include why you selected this wonder and what makes it stand out to you. Be creative and include images or drawings to enhance your presentation.','2025-06-15','Exploring the Wonders of the World',100),(45,15,'Research and present a detailed report on one of the Seven Wonders of the Ancient World or the New Seven Wonders of the World. Your report should include the history, significance, and current status of the wonder you choose. Additionally, include a creative element such as a drawing, model, or digital presentation to visually represent your chosen wonder. This assignment encourages creativity, research skills, and presentation abilities.','2025-07-15','Exploring the Wonders of the World',100);
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auths`
--

DROP TABLE IF EXISTS `auths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auths` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `auths_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auths`
--

LOCK TABLES `auths` WRITE;
/*!40000 ALTER TABLE `auths` DISABLE KEYS */;
INSERT INTO `auths` VALUES (2,3,'password',NULL),(3,4,'password',NULL),(6,7,'$2b$12$IkGXAWYIyPVAhtqh81XQFOCYvSgZj0ieau0NsLwfoA33RPILRRoYO',NULL),(7,8,'$2b$12$6ASxVKQmcQxRhsCWGhfRduCl8j.cQo9gg5X2S4kFoJFM1PSyLGWMq',NULL),(8,9,'$2b$12$xryQhU5GYXu.VbuyuZsC6e1pAR.mG8Ph7oN29OGojPGejiaaSB2Im',NULL),(9,10,'$2b$12$hrEgdHXCrtMVZMs30jXnAeMYXAOa4bLXQjwVTumqAOA2kyqKlMpiO',NULL),(11,15,'$2b$12$abIB9r7fDIa1udhh7JyvtewjNOVDi1S0xe0UQf6pYz4DDzq3cvHhS',NULL),(13,17,'$2b$12$X1kRiAq2VdbZMOqCPMFcIu6Agb1Y2yPem7AZ5gORpsNtX2iP3KwBi',NULL),(14,22,'$2b$12$wG6zZprBZLg5rwO1jpBPwepcILOXquqylabQLg4u9tg7g9fA8hsEa',NULL),(16,48,'$2b$12$qxaQOeRxR1FnXI88idikqOBUk6MNa30M.GO41q22/ES7/vC6w4946',NULL),(17,49,'$2b$12$0O6CMtOi2DDIfx6UmCMNsuQtIufr88XQrph2VYw63iV1WTRRbUJ8a',NULL),(18,50,'$2b$12$.KYDcvr127jUDgLJzuIVrOB3JtKnp1EcSVFRWld8fyHUjONGvbb.e',NULL),(19,51,'$2b$12$nVfi.TmIghRf/oZCKq83YeVdYKaykPirKOp/EaUI3SI22DXeiLMZO',NULL),(20,52,'$2b$12$QRXUIafUbznV9DB1vUxBNOQdn3zsYcMHkWxNyo9PxmCmIFBDOSE1u',NULL),(21,53,'$2b$12$LvlMBpwWuIdKgzXm5/OHru/g9XDGkYFxqzk9khEfkWSLcB9HuqvHW',NULL),(23,55,'$2b$12$lodbm6w3o4VhzaJAqujKk.mHKxpMBgqyATgjXaj0jpssTrpBQhDQa',NULL),(24,56,'$2b$12$aMwtkQXcf0R6a/EenUg9zORSR/ZyBb9WEkvSTCb4Bdi3AJ5xYkIMe',NULL),(27,60,'$2b$12$tcTCXMdy5JvCe.6uerjHX.xcLxb6c.edMtIyIbupBJpCTUB2ezRuW',NULL);
/*!40000 ALTER TABLE `auths` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_students`
--

DROP TABLE IF EXISTS `class_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_students` (
  `class_id` int NOT NULL,
  `user_id` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`class_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `class_students_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `class_students_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_students`
--

LOCK TABLES `class_students` WRITE;
/*!40000 ALTER TABLE `class_students` DISABLE KEYS */;
INSERT INTO `class_students` VALUES (3,7,1),(3,10,1),(3,17,1),(5,10,1),(5,48,1),(7,17,1),(7,48,1),(8,48,1),(12,7,1),(12,50,1),(13,7,1),(13,17,1),(15,7,1),(15,51,1),(18,1,1),(19,7,1);
/*!40000 ALTER TABLE `class_students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int DEFAULT NULL,
  `class_name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `semester_id` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `day` varchar(20) NOT NULL,
  `rate` int NOT NULL DEFAULT '14',
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `semester_id` (`semester_id`),
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (3,2,'Algebra 2','Catch up',1,'05:00:00','08:00:00','Sunday',14),(4,2,'Geometry','Geometry',1,'00:00:00','00:00:00','Friday',14),(5,2,'Engineering','Engineering',1,'00:00:00','00:00:00','Sunday',14),(6,8,'Elite Engineering','Elite engineering',1,'00:00:00','00:01:00','Tuesday',1),(7,8,'Geometry','Geometry',1,'00:00:00','00:00:00','Saturday',14),(8,2,'Algebra','Algebra',1,'00:00:00','00:00:00','Friday',14),(9,8,'Algebra','Algebra',1,'00:00:00','00:00:00','Saturday',14),(11,2,'Geometry Catch up','Geometry',1,'09:00:00','11:50:00','Sunday',14),(12,2,'Geometry Catch up','Geometry',1,'10:00:00','00:50:00','Saturday',14),(13,3,'Algebra Catch up','Algebra',1,'11:00:00','12:50:00','Saturday',14),(14,8,'Basic Math','Basic Math',1,'15:00:00','16:50:00','Saturday',14),(15,8,'Catch up Beginner Math','Math',1,'09:00:00','10:50:00','Saturday',14),(17,22,'Elite Engineering','Engineering',1,'09:00:00','22:50:00','Sunday',14),(18,22,'Cyber Security','Cyber Security',1,'11:00:00','12:50:00','Sunday',14),(19,22,'C++','C++',1,'13:30:00','15:20:00','Sunday',14),(20,22,'MIT Engineering','Engineering (middle school)',1,'15:30:00','17:20:00','Sunday',14),(21,22,'Algebra 2','Algebra 2',2,'09:00:00','10:50:00','Saturday',14),(22,13,'Physics 1','Physics 1',2,'09:00:00','10:50:00','Saturday',14),(23,13,'Geometry','Geometry',2,'11:00:00','12:50:00','Saturday',14),(24,3,'Algebra Catch up','Algebra',2,'13:30:00','15:20:00','Saturday',14),(25,2,'Geometry Catch up','Geometry',2,'15:30:00','17:20:00','Saturday',14),(26,8,'Basic Math','Basic Math',2,'17:30:00','19:20:00','Saturday',14),(27,2,'Engineering','Engineering',2,'15:30:00','17:20:00','Friday',14),(28,22,'Elite Engineering','Engineering',2,'17:30:00','19:20:00','Friday',14),(29,22,'Cyber Security','Cyber Security',2,'09:00:00','10:50:00','Sunday',14),(30,22,'C++','C++',2,'11:00:00','12:50:00','Sunday',14),(31,22,'MIT Engineering','Engineering (middle school)',2,'13:30:00','15:20:00','Sunday',14),(32,2,'Algebra 2','Catch up',2,'15:30:00','17:20:00','Sunday',14),(33,2,'Geometry Catch up','Geometry',2,'17:30:00','19:20:00','Sunday',14),(35,15,'temp','temp',1,'10:10:00','13:00:00','Friday',14),(37,13,'temp','temp',1,'10:00:00','13:00:00','Friday',14),(38,3,'temp','temp',2,'10:10:00','13:00:00','Sunday',10),(39,3,'temp','temp',1,'10:00:00','13:00:00','Tuesday',1),(40,3,'test','test tried',2,'10:10:00','12:03:00','Thursday',14),(41,22,'test','test try',1,'10:10:00','22:12:00','Friday',14),(42,3,'test tr','tes',2,'10:10:00','12:11:00','Tuesday',14),(43,3,'Algebra Catch up','Algebra',4,'09:00:00','10:50:00','Saturday',14),(44,2,'Geometry Catch up','Geometry',4,'11:00:00','12:50:00','Saturday',14),(45,8,'Basic Math','Basic Math',4,'13:30:00','15:20:00','Saturday',14),(46,2,'Geometry Catch up','Geometry',4,'15:30:00','17:20:00','Saturday',14),(47,22,'Cyber Security','Cyber Security',4,'09:00:00','10:50:00','Sunday',14),(48,22,'C++','C++',4,'11:00:00','12:50:00','Sunday',14),(49,22,'MIT Engineering','Engineering (middle school)',4,'13:30:00','15:20:00','Sunday',14),(50,2,'Algebra 2','Catch up',4,'15:30:00','17:20:00','Sunday',14),(51,2,'Engineering','Engineering',4,'15:30:00','17:20:00','Friday',14),(52,22,'Elite Engineering','Engineering',4,'17:30:00','19:20:00','Friday',14),(53,8,'C12','Math',1,'13:00:00','14:50:00','Thursday',14),(54,8,'C13','Math or something',1,'17:00:00','18:50:00','Monday',14),(56,13,'M12','Math',2,'14:00:00','16:00:00','Monday',14),(57,3,'123','tesm',4,'22:00:00','23:00:00','Tuesday',14);
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `message` text,
  `class_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feedback_ibfk_1` (`class_id`),
  KEY `feedback_ibfk_2` (`user_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (3,'2025-05-30 07:43:39','**Feedback for Student Guy:**  \n\nStudent Guy, I notice that you did not submit the first two assignments, \"Math\" and \"Test,\" which resulted in scores of 0. It’s important to complete and turn in all assignments to stay on track in Catch Up Beginner Math. For the \"Later Test,\" you scored 40 out of 100, and the feedback provided was minimal (\"a\"). Let’s work on improving your understanding of the material—I’d be happy to help clarify any concepts you find challenging. Moving forward, make sure to submit all assignments on time and reach out if you need additional support. You’ve got this!',15,7);
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_user_id` int NOT NULL,
  `class_id` int NOT NULL,
  `message` text NOT NULL,
  `receiver_user_id` int NOT NULL,
  `sent_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(255) NOT NULL,
  `has_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `sender_user_id` (`sender_user_id`),
  KEY `receiver_user_id` (`receiver_user_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (4,8,7,'Assignment created for 7: New Assignment Message Test that is due on 2025-05-23',48,'2025-05-09 15:45:06','New assignment created: New Assignment Message Test',0),(11,7,7,'false\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',8,'2025-05-09 17:21:22','Re: New assignment created: New Assignment Message Test',1),(20,8,6,'Assignment created for 6: Real Assignment that is due on 2025-05-19',7,'2025-05-12 14:16:33','New assignment created: Real Assignment',1),(22,9,15,'You have received a new grade for Later Test.',7,'2025-05-16 17:36:58','New Grade Received for Later Test',1),(23,8,7,'no\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:25','Re: Re: New assignment created: New Assignment Message Test',1),(24,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:27','Re: Re: New assignment created: New Assignment Message Test',1),(25,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:27','Re: Re: New assignment created: New Assignment Message Test',1),(26,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:29','Re: Re: New assignment created: New Assignment Message Test',1),(27,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:29','Re: Re: New assignment created: New Assignment Message Test',1),(28,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:29','Re: Re: New assignment created: New Assignment Message Test',1),(29,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:30','Re: Re: New assignment created: New Assignment Message Test',1),(33,8,15,'You have received new feedback for your performance in Catch up Beginner Math. Please check your dashboard for details.',7,'2025-05-30 00:43:39','New Feedback for Catch up Beginner Math',1),(34,8,15,'New assignment created: Fraction Simplification Practice',51,'2025-06-01 03:37:04','Fraction Simplification Practice',0),(35,8,15,'New assignment created: Fraction Simplification Practice',7,'2025-06-01 03:37:04','Fraction Simplification Practice',0),(36,8,15,'You have received a new grade for Fraction Simplification Practice.',7,'2025-06-01 03:37:42','New Grade Received for Fraction Simplification Practice',0),(37,8,15,'New assignment created: Exploring the Wonders of the World',7,'2025-06-01 04:01:40','Exploring the Wonders of the World',0),(38,8,15,'New assignment created: Exploring the Wonders of the World',51,'2025-06-01 04:01:40','Exploring the Wonders of the World',0),(39,8,15,'New assignment created: Exploring the Wonders of the World',51,'2025-06-01 05:47:52','Exploring the Wonders of the World',0),(40,8,15,'New assignment created: Exploring the Wonders of the World',7,'2025-06-01 05:47:52','Exploring the Wonders of the World',0);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('Complete','Refund','Balance') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_method` enum('Check','Cash','Online') DEFAULT 'Cash',
  `payment_type` enum('Tuition','Donation','Misc') DEFAULT 'Misc',
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,500.00,'Complete','Tuition for Spring 2025','2025-03-23 07:00:00','Cash','Misc'),(3,10,800.00,'Complete','Parent came to make donation','2025-05-02 07:00:00','Cash','Misc'),(6,7,1010.00,'Complete','101','2025-04-23 07:00:00','Cash','Misc'),(7,-1,500.00,'Complete','Wang, Michael','2025-05-02 07:00:00','Cash','Misc'),(8,-1,100.00,'Balance','Testing','2025-06-04 07:00:00','Check','Misc'),(9,-1,50.00,'Refund','blah','2025-06-05 07:00:00','Cash','Donation'),(10,-1,199.00,'Complete','','2025-04-30 07:00:00','Cash','Misc'),(17,-1,123.00,'Refund','','2025-05-07 07:00:00','Cash','Misc'),(19,1,1200.00,'Refund','Testing','2025-06-26 07:00:00','Cash','Misc'),(20,1,90.00,'Complete','Testing from original page','2025-06-17 07:00:00','Cash','Misc'),(21,-1,102.00,'Complete','Temp','2025-07-02 07:00:00','Check','Tuition'),(22,-1,100.00,'Complete','Note','2025-07-01 07:00:00','Cash','Tuition');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scores`
--

DROP TABLE IF EXISTS `scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `feedback` varchar(255) DEFAULT NULL,
  `grade` int DEFAULT '0',
  `assignment_id` int NOT NULL,
  `student_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `submission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `student_id` (`student_id`),
  KEY `scores_ibfk_3_idx` (`submission_id`),
  CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `scores_ibfk_3` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scores`
--

LOCK TABLES `scores` WRITE;
/*!40000 ALTER TABLE `scores` DISABLE KEYS */;
INSERT INTO `scores` VALUES (15,'',80,1,7,'2025-05-03 21:12:29',2),(17,'',90,2,7,'2025-05-04 00:09:03',1),(19,'',80,2,48,'2025-05-09 22:42:20',6),(20,'',90,11,7,'2025-05-10 20:59:24',7),(22,'This is good',90,12,7,'2025-05-10 21:02:07',9),(23,'',89,13,7,'2025-05-10 21:04:42',10),(24,'',29,14,7,'2025-05-10 21:05:00',11),(26,'',90,15,7,'2025-05-10 21:08:32',13),(27,'bing',5,20,7,'2025-05-12 21:20:29',14),(29,'a',40,10,7,'2025-05-17 00:36:58',17),(31,'',47,43,7,'2025-06-01 10:37:42',27);
/*!40000 ALTER TABLE `scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semesters`
--

DROP TABLE IF EXISTS `semesters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semesters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('Upcoming','Ongoing','Complete') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rate` int DEFAULT '14',
  PRIMARY KEY (`id`),
  CONSTRAINT `semesters_chk_1` CHECK ((`start_date` < `end_date`))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semesters`
--

LOCK TABLES `semesters` WRITE;
/*!40000 ALTER TABLE `semesters` DISABLE KEYS */;
INSERT INTO `semesters` VALUES (1,'Spring 2025','2025-01-09','2025-06-15','Ongoing','2025-03-23 15:55:08',14),(2,'Fall 2025','2025-08-19','2025-12-15','Upcoming','2025-03-23 15:55:28',14),(4,'Winter 2025','2025-12-21','2026-02-07','Upcoming','2025-05-18 22:59:22',14);
/*!40000 ALTER TABLE `semesters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `assignment_id` int NOT NULL,
  `submission_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `content` text,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
INSERT INTO `submissions` VALUES (1,7,2,'2025-04-18 12:43:40','Temp submission'),(2,7,1,'2025-04-18 15:45:24','test'),(6,48,2,'2025-05-09 15:42:20','Manually Graded'),(7,7,11,'2025-05-10 13:59:24','Manually Graded'),(9,7,12,'2025-05-10 14:02:07','Manually Graded'),(10,7,13,'2025-05-10 14:04:42','Manually Graded'),(11,7,14,'2025-05-10 14:05:00','Manually Graded'),(13,7,15,'2025-05-10 14:08:32','Manually Graded'),(14,7,20,'2025-05-12 14:19:37','google.com'),(16,7,7,'2025-05-12 17:19:35','google.com'),(17,7,10,'2025-05-16 17:36:58','Manually Graded'),(18,48,16,'2025-05-17 10:10:48','link'),(19,7,10,'2025-05-18 10:46:53','google.com'),(21,7,2,'2025-05-25 10:14:35','google.com'),(22,7,2,'2025-05-25 10:15:39','https://docs.google.com/presentation/d/1b_TIIESFLzz6ofwwHJ8tcF8_umc4J8_S5Rv-xQlvrGQ/edit?slide=id.p#slide=id.p'),(23,7,9,'2025-05-30 12:02:00','blah'),(24,7,7,'2025-06-01 02:19:28','New submission'),(25,7,5,'2025-06-01 02:29:52','woo tests'),(26,7,9,'2025-06-01 02:30:04','New submissions'),(27,7,43,'2025-06-01 03:37:42','Manually Graded'),(28,7,44,'2025-06-01 05:47:09','help\n');
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_invites`
--

DROP TABLE IF EXISTS `teacher_invites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_invites` (
  `id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  `used` tinyint(1) DEFAULT '0',
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_invites`
--

LOCK TABLES `teacher_invites` WRITE;
/*!40000 ALTER TABLE `teacher_invites` DISABLE KEYS */;
INSERT INTO `teacher_invites` VALUES ('02087879-82c1-4170-bd9a-e6068512d7d8','2025-04-29 20:24:49','2025-05-04 20:24:49',0,'tepah@gmail.com'),('024cbfbf-3fa8-4dd8-8523-edfde15e1830','2025-05-13 01:18:12','2025-05-18 01:18:12',0,'thisisemail@gmail.com'),('267b4592-5f2a-4a41-9db0-b6299f27986a','2025-04-30 01:34:43','2025-05-05 01:34:43',0,'temp'),('3d2664d4-957a-4303-83f6-327528565233','2025-05-13 01:17:41','2025-05-18 01:17:41',0,'rest'),('40cc7bc5-bfe8-4f7a-b0c8-6607946f9df1','2025-05-12 20:57:45','2025-05-17 20:57:45',0,'math@math.com'),('6b53c7a3-6d17-4c00-903e-83a3ff15e78a','2025-04-30 22:46:46','2025-05-05 22:46:46',0,'temptest@test.com'),('788a9846-4351-44bf-b45a-db46435fef84','2025-05-31 17:31:25','2025-06-05 17:31:25',0,''),('7cbce3c0-2e0c-49fb-a8c2-10691d8a6aa5','2025-04-30 01:28:59','2025-05-05 01:28:59',0,'test@test.com'),('85cb02b4-c6f5-4c64-ae34-39df86d7d728','2025-06-01 11:29:02','2025-06-06 11:29:02',0,''),('88a342b2-212f-4017-bb45-371f63e76f1b','2025-06-01 11:24:42','2025-06-06 11:24:42',0,''),('8f646371-13f1-4e53-a33d-5bf65bb4fb95','2025-05-13 01:17:18','2025-05-18 01:17:18',0,'test'),('956b480c-d31d-4087-9f45-fb52a3595e58','2025-04-30 01:42:17','2025-05-05 01:42:17',0,'test@test.com'),('adb7df32-4125-40e3-9ed6-37520fb8fd6e','2025-05-25 16:20:47','2025-05-30 16:20:47',0,''),('afafcfeb-45f3-4565-bc51-9706019601fc','2025-04-29 20:20:59','2025-05-04 20:20:59',0,'tepah@gmail.com'),('b3cdd619-43d7-4760-b05d-043b598f9364','2025-04-29 20:24:21','2025-05-04 20:24:21',0,'tepah@gmail.com'),('f1d9a6b9-7f74-4685-bae1-45e8d8e6da68','2025-06-01 11:24:19','2025-06-06 11:24:19',0,''),('f8a5f608-ba86-4f26-9e34-5c5dd3fa44b6','2025-05-02 22:47:24','2025-05-07 22:47:24',0,'tester@teacher.com');
/*!40000 ALTER TABLE `teacher_invites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `guardian` varchar(255) DEFAULT NULL,
  `guardian_phone` varchar(20) DEFAULT NULL,
  `health_ins` varchar(255) DEFAULT NULL,
  `health_ins_num` varchar(255) DEFAULT NULL,
  `role` enum('Student','Teacher','Admin') NOT NULL DEFAULT 'Student',
  `grade_level` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('Active','Inactive','Suspended') NOT NULL DEFAULT 'Active',
  `experience` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `email_2` (`email`),
  KEY `phone` (`phone`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (-1,'DONATION','USER','1999-12-22','Male','Donation@email.com','0000000001','123','123','1231231234','123','123','Student','10','2025-05-02 23:11:42','2025-05-31 23:17:19','Active',NULL),(1,'Jane','Do','2011-04-04','Male','johndoe@example.co','2345678903','123 Main S','Jane Do','1987654322','BlueCros','ABC1234','Student','4','2025-03-23 15:53:02','2025-07-05 20:57:21','Active',''),(2,'Allen','Johnson','1985-08-14','Female','alice.johnson@example.com','+1234567891','456 Elm St','','','UnitedHealth','XYZ789101','Teacher',NULL,'2025-03-23 15:53:58','2025-05-31 16:20:57','Active','Algebra, Algebra 2, Geometry, Calculus, Calculus AB'),(3,'Pete','Potipitak','2001-06-25','Male','potipitak@gmail.co','9514010513','123 Home St','None','None','None','None','Teacher',NULL,'2025-03-23 16:57:44','2025-07-05 17:24:10','Active','C++, Python, Java'),(4,'Smi','John','2011-06-29','Male','test@gmail.com','951-401-0512','123 Home St.','None','9514010512','None','None','Student','7','2025-03-23 17:01:54','2025-05-31 16:29:47','Active',NULL),(7,'Student','Guy','2000-07-03','Male','student@test.com','951-401-0512','123 Home St.','Mom Guy','(100)100-1000','Blue Cross','123','Student','7','2025-03-29 20:45:56','2025-05-31 16:29:57','Active',NULL),(8,'Teacher','Man','2000-07-05','Male','teacher@test.com','(123)100-1000','123 Home St.',NULL,NULL,NULL,NULL,'Teacher',NULL,'2025-03-29 20:50:06','2025-05-22 00:31:10','Active','C++, Python, Algebra, Algebra 2, Geometry'),(9,'Teacher','Man','2000-07-05','Male','admin@test.com','(123)100-1000','123 Home St.',NULL,NULL,NULL,NULL,'Admin',NULL,'2025-03-29 22:33:58','2025-03-29 22:33:58','Active',NULL),(10,'Pete','Potipitak','1996-07-03','Male','email@email.com','9511231234','123','mom','1231231243','blue','123','Student','12','2025-04-03 18:47:12','2025-05-31 16:29:19','Active',NULL),(13,'Johny','Smith','1999-12-30','Male','temptest@test.com','1111111111','123 Home Home',NULL,NULL,NULL,NULL,'Teacher',NULL,'2025-05-01 00:00:01','2025-07-06 22:44:09','Active','Java'),(15,'John','Smith','1999-12-31','Male','ttest@test.com','1111111111','123 Home Home',NULL,NULL,NULL,NULL,'Teacher',NULL,'2025-05-01 00:00:59','2025-05-01 00:00:59','Active',NULL),(17,'Test','Tester','2009-12-31','Male','tester@tester.com','1231231234','123 123','123','1231231234','blue',NULL,'Student','12','2025-05-01 19:17:36','2025-05-01 19:17:36','Active',NULL),(22,'Pete','Potipitak','1999-12-30','Male','tester@teacher.com','9514010512','1706 Raymar st.',NULL,NULL,NULL,NULL,'Teacher',NULL,'2025-05-02 22:48:03','2025-06-01 11:36:02','Active','Physics, Physics 2,'),(24,'Richard','Wang','2000-01-01','Female','imw.richard@gmail.com','9097607308','216 Daybreak Dr','jrilwaj','9099099099','jfiowajio',NULL,'Student','10','2025-05-04 17:15:05','2025-05-04 17:15:05','Active',NULL),(48,'Pete','Potipitak','2019-12-29','Male','tepahtops@gmail.com','9514010512','1706 Raymar st.','mom','1231231234','blue','123','Student','11','2025-05-09 15:57:18','2025-06-01 08:44:55','Inactive',NULL),(49,'test','test','2000-12-31','Male','testing@testing.com','1231231234','123','123','1231231234','temp',NULL,'Student','12','2025-05-09 22:30:28','2025-05-09 22:30:28','Active',NULL),(50,'temp','tewmp','2009-12-31','Male','testing@tester.com','1231231234','123','123','1231231234','blue',NULL,'Student','12','2025-05-09 22:37:51','2025-05-09 22:37:51','Active',NULL),(51,'Bobby','Kid','2019-12-30','Male','tepaht@test.com','1231231234','123 Colima','123','1231231234','blue','123','Student','11','2025-05-12 21:31:14','2025-06-01 09:57:32','Active',NULL),(52,'Pete','Potipitak','1999-12-31','Male','testermode@gmail.com','9514010512','1706 Raymar st.','test','1231231234','test',NULL,'Student','11','2025-05-24 00:51:14','2025-05-24 00:51:14','Active',NULL),(53,'TEST','TEST','1999-12-31','Male','TESTER@YAHOO.com','1231231234','123 street','Name','1231231234','Blue Cross',NULL,'Student','4','2025-05-31 17:30:52','2025-05-31 17:30:52','Active',NULL),(55,'Pet','peter','1990-01-01','Female','temporary@gmail.com','9514010512','1706 Raymar s','me','1231231234','blueCross','123123','Student','7','2025-06-01 08:57:11','2025-06-01 08:57:11','Active',NULL),(56,'Pete','Potipitak','1998-12-29','Male','tepaht@gmail.com','9514010512','1700 W. Cerritos Ave',NULL,NULL,NULL,NULL,'Teacher',NULL,'2025-06-01 11:29:31','2025-06-01 11:36:38','Active','123'),(60,'duper','dupe','1999-12-30','Male','teph@gmail.com','9511111234','1 Teacher',NULL,NULL,NULL,NULL,'Teacher',NULL,'2025-07-05 22:57:11','2025-07-05 22:57:29','Active','JavaScript');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-11 19:11:57
