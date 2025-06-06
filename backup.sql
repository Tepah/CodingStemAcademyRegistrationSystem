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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,6,'Page 258 #3-29','2025-04-11','',100),(2,7,'Page 200 #23-30','2025-04-25','Chapter 8',100),(3,7,'HW # 2000','2025-04-26','Chapter 9',100),(4,7,'temp','2025-04-30','temp',100),(5,15,'this is a test','2025-04-19','Math',100),(6,9,'#1-20','2025-05-01','Assessment #17',100),(7,3,'Chapter 10','2024-04-28','Read Chapter 10',100),(8,3,'Chapter 10','2025-04-28','Read Chapter 10',100),(9,15,'Test','2025-05-09','Test',100),(10,15,'Test','2025-05-24','Later Test',100),(11,6,'This is to test Message sending system','2025-05-24','Test Messages',100),(12,6,'This is to test messages','2025-05-16','Message Tester',100),(13,6,'This is to test messages','2025-05-16','Message Tester',100),(14,6,'This is to test messages','2025-05-23','Testing Messages',100),(15,6,'Messages','2025-05-23','Implementing Messages',100),(16,7,'Test','2025-05-23','New Assignment Message Test',100),(17,9,'Slave away 12 weeks of your life working for a scuffed assignment system.','2025-06-22','The Horrible Assignment Creating System',100),(18,9,'','2025-06-12','',100),(19,9,'10 AME problems','2025-05-11','Ame Problems 1',100),(20,6,'testing real assignment google.com','2025-05-19','Real Assignment',100),(21,9,'Demonstrate physics by jumping off a suitable height for death','2025-05-24','KYS',100),(22,7,'usuyasydhasdg','2025-12-03','hsdhshsh',100),(23,7,'usuyasydhasdg','2025-12-03','hsdhshsh',100),(24,7,'usuyasydhasdg','2025-12-03','hsdhshsh',100),(25,7,'usuyasydhasdg','2044-12-03','hsdhshsh',100),(26,7,'usuyasydhasdg','2025-12-03','hsdhshsh',100),(27,7,'usuyasydhasdg','2044-12-03','hsdhshsh',100),(28,7,'Create and solve 10 different addition problems. Each problem should include two numbers, and the sum should not exceed 100. Write down the problems and their solutions on a piece of paper.','2025-06-18','Addition Problem Assignment',100),(29,7,'Create and solve 10 different addition problems. Each problem should include two numbers, and the sum should not exceed 100. Write down the problems and their solutions on a piece of paper.','2025-06-18','Addition Problem Assignment',100),(30,7,'Solve the following two digital addition problems. Ensure to show all your work and write the final answer in the space provided.\n\n1. 123 + 456 = ?\n2. 789 + 321 = ?','2023-04-10','Digital Addition Problems',100),(31,7,'Solve the following single digit addition problem: 5 + 3 = ?','2023-04-10','Single Digit Addition Problem',100),(32,6,'Create a C++ program that demonstrates the use of different types of loops (for, while, and do-while) to solve a problem. The program should include at least one example of each loop type. The problem to solve is calculating the sum of the first N natural numbers, where N is input by the user. For the for loop, calculate the sum. For the while loop, calculate the factorial of N. For the do-while loop, print all even numbers up to N. Ensure your program is well-commented to explain each part of the code.','2023-04-15','C++ Loops Demonstration Assignment',100);
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auths`
--

LOCK TABLES `auths` WRITE;
/*!40000 ALTER TABLE `auths` DISABLE KEYS */;
INSERT INTO `auths` VALUES (6,7,'$2b$12$IkGXAWYIyPVAhtqh81XQFOCYvSgZj0ieau0NsLwfoA33RPILRRoYO',NULL),(7,8,'$2b$12$6ASxVKQmcQxRhsCWGhfRduCl8j.cQo9gg5X2S4kFoJFM1PSyLGWMq',NULL),(8,9,'$2b$12$xryQhU5GYXu.VbuyuZsC6e1pAR.mG8Ph7oN29OGojPGejiaaSB2Im',NULL)
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
INSERT INTO `class_students` VALUES (3,7,1),(3,10,1),(3,12,1),(3,23,1),(4,12,1),(4,16,1),(5,10,1),(5,12,1),(5,48,1),(6,16,1),(7,16,1),(7,48,1),(8,1,1),(8,48,1),(12,7,1),(12,50,1),(13,7,1),(13,16,1),(13,17,1),(13,49,1),(13,50,1),(14,1,1),(14,50,1),(15,7,1),(15,23,1),(15,51,1),(18,1,1),(19,7,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (3,2,'Algebra 2','Catch up',1,'05:00:00','08:00:00','Sunday',14),(4,2,'Geometry','Geometry',1,'00:00:00','00:00:00','Friday',14),(5,2,'Engineering','Engineering',1,'00:00:00','00:00:00','Sunday',14),(6,8,'Elite Engineering','Elite engineering',1,'00:00:00','00:00:00','Friday',14),(7,8,'Geometry','Geometry',1,'00:00:00','00:00:00','Saturday',14),(8,2,'Algebra','Algebra',1,'00:00:00','00:00:00','Friday',14),(9,8,'Algebra','Algebra',1,'00:00:00','00:00:00','Saturday',14),(11,2,'Geometry Catch up','Geometry',1,'09:00:00','11:50:00','Sunday',14),(12,2,'Geometry Catch up','Geometry',1,'10:00:00','00:50:00','Saturday',14),(13,3,'Algebra Catch up','Algebra',1,'11:00:00','12:50:00','Saturday',14),(14,8,'Basic Math','Basic Math',1,'15:00:00','16:50:00','Saturday',14),(15,8,'Catch up Beginner Math','Math',1,'09:00:00','10:50:00','Saturday',14),(17,22,'Elite Engineering','Engineering',1,'09:00:00','22:50:00','Sunday',14),(18,22,'Cyber Security','Cyber Security',1,'11:00:00','12:50:00','Sunday',14),(19,22,'C++','C++',1,'13:30:00','15:20:00','Sunday',14),(20,22,'MIT Engineering','Engineering (middle school)',1,'15:30:00','17:20:00','Sunday',14),(21,22,'Algebra 2','Algebra 2',2,'09:00:00','10:50:00','Saturday',14),(22,13,'Physics 1','Physics 1',2,'09:00:00','10:50:00','Saturday',14),(23,13,'Geometry','Geometry',2,'11:00:00','12:50:00','Saturday',14),(24,3,'Algebra Catch up','Algebra',2,'13:30:00','15:20:00','Saturday',14),(25,2,'Geometry Catch up','Geometry',2,'15:30:00','17:20:00','Saturday',14),(26,8,'Basic Math','Basic Math',2,'17:30:00','19:20:00','Saturday',14),(27,2,'Engineering','Engineering',2,'15:30:00','17:20:00','Friday',14),(28,22,'Elite Engineering','Engineering',2,'17:30:00','19:20:00','Friday',14),(29,22,'Cyber Security','Cyber Security',2,'09:00:00','10:50:00','Sunday',14),(30,22,'C++','C++',2,'11:00:00','12:50:00','Sunday',14),(31,22,'MIT Engineering','Engineering (middle school)',2,'13:30:00','15:20:00','Sunday',14),(32,2,'Algebra 2','Catch up',2,'15:30:00','17:20:00','Sunday',14),(33,2,'Geometry Catch up','Geometry',2,'17:30:00','19:20:00','Sunday',14),(35,15,'temp','temp',1,'10:10:00','13:00:00','Friday',14),(37,13,'temp','temp',1,'10:00:00','13:00:00','Friday',14),(38,3,'temp','temp',1,'10:10:00','13:00:00','Monday',10),(39,3,'temp','temp',1,'10:00:00','13:00:00','Tuesday',14);
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
  KEY `class_id` (`class_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,'2025-05-29 19:46:53','**Feedback for Testing Student:**  \n\nTesting, your performance in Elite Engineering shows some areas where you can improve. You scored 70 on the \"Page 258 #3-29\" assignment, which is a decent start, but there’s room to aim higher. The \"Test Messages\" assignment, where you scored 50, indicates that you may need to review the material more thoroughly or seek clarification on the requirements. More concerning is that you did not submit several assignments, including \"Message Tester,\" \"Testing Messages,\" \"Implementing Messages,\" \"Real Assignment,\" and the \"C++ Loops Demonstration Assignment.\" Missing assignments significantly impact your overall progress, and I strongly encourage you to prioritize timely submissions. If you’re facing challenges, please reach out for help—consistent effort and engagement will be key to your success in this class. Let’s work on improving both completion and quality in future work.',6,16),(2,'2025-05-30 07:41:19','**Feedback for Testing Student:**  \n\nTesting, your performance in Elite Engineering shows some areas where you can improve. You scored 70 on the \"Page 258 #3-29\" assignment, which is a decent start, but there’s room to aim higher. The \"Test Messages\" assignment, where you scored 50, indicates that you may need to review the material more thoroughly or seek clarification on the requirements. More concerning is that you did not submit several assignments, including \"Message Tester,\" \"Testing Messages,\" \"Implementing Messages,\" \"Real Assignment,\" and the \"C++ Loops Demonstration Assignment.\" Missing assignments significantly impact your overall progress, and I strongly encourage you to prioritize timely submissions. If you’re facing challenges, please reach out for help—consistent effort and engagement will be key to your success in this class. Let’s work on improving both completion and quality in future work.',6,16),(3,'2025-05-30 07:43:39','**Feedback for Student Guy:**  \n\nStudent Guy, I notice that you did not submit the first two assignments, \"Math\" and \"Test,\" which resulted in scores of 0. It’s important to complete and turn in all assignments to stay on track in Catch Up Beginner Math. For the \"Later Test,\" you scored 40 out of 100, and the feedback provided was minimal (\"a\"). Let’s work on improving your understanding of the material—I’d be happy to help clarify any concepts you find challenging. Moving forward, make sure to submit all assignments on time and reach out if you need additional support. You’ve got this!',15,7);
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (2,8,6,'Assignment created for 6: Implementing Messages that is due on 2025-05-23',16,'2025-05-09 13:13:50','New assignment created: Implementing Messages',0),(3,8,7,'Assignment created for 7: New Assignment Message Test that is due on 2025-05-23',16,'2025-05-09 15:45:06','New assignment created: New Assignment Message Test',0),(4,8,7,'Assignment created for 7: New Assignment Message Test that is due on 2025-05-23',48,'2025-05-09 15:45:06','New assignment created: New Assignment Message Test',0),(11,7,7,'false\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',8,'2025-05-09 17:21:22','Re: New assignment created: New Assignment Message Test',1),(13,8,6,'You have received a new grade for undefined.',16,'2025-05-10 13:59:39','New Grade Received for undefined',0),(17,8,6,'You have received a new grade for undefined.',16,'2025-05-10 14:06:31','New Grade Received for undefined',0),(19,8,6,'Assignment created for 6: Real Assignment that is due on 2025-05-19',16,'2025-05-12 14:16:33','New assignment created: Real Assignment',0),(20,8,6,'Assignment created for 6: Real Assignment that is due on 2025-05-19',7,'2025-05-12 14:16:33','New assignment created: Real Assignment',1),(21,8,6,'You have received a new grade for Real Assignment.',16,'2025-05-12 16:42:10','New Grade Received for Real Assignment',0),(22,9,15,'You have received a new grade for Later Test.',7,'2025-05-16 17:36:58','New Grade Received for Later Test',1),(23,8,7,'no\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:25','Re: Re: New assignment created: New Assignment Message Test',1),(24,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:27','Re: Re: New assignment created: New Assignment Message Test',1),(25,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:27','Re: Re: New assignment created: New Assignment Message Test',1),(26,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:29','Re: Re: New assignment created: New Assignment Message Test',1),(27,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:29','Re: Re: New assignment created: New Assignment Message Test',1),(28,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:29','Re: Re: New assignment created: New Assignment Message Test',1),(29,8,7,'false\n\n--- Previous Message ---\nfalse\n\n--- Previous Message ---\nAssignment created for 7: New Assignment Message Test that is due on 2025-05-23',7,'2025-05-18 10:20:30','Re: Re: New assignment created: New Assignment Message Test',1),(30,8,7,'You have received a new grade for temp.',16,'2025-05-23 17:17:45','New Grade Received for temp',0),(31,8,7,'You have received a new grade for temp./nGrade: 50\nFeedback: ',16,'2025-05-23 17:17:45','New Grade Received for temp',0),(32,8,6,'You have received new feedback for your performance in Elite Engineering. Please check your dashboard for details.',16,'2025-05-30 00:41:19','New Feedback for Elite Engineering',0),(33,8,15,'You have received new feedback for your performance in Catch up Beginner Math. Please check your dashboard for details.',7,'2025-05-30 00:43:39','New Feedback for Catch up Beginner Math',1);
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
  `status` enum('Complete','Refunded','Balance') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_type` enum('check','cash','zelle') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,500.00,'Complete','Tuition for Spring 2025','2025-03-23 07:00:00','zelle'),(3,10,800.00,'Complete','Parent came to make donation','2025-05-02 07:00:00','cash'),(6,7,1010.00,'Complete','101','2025-04-23 07:00:00','check'),(7,-1,500.00,'Complete','Wang, Michael','2025-05-02 07:00:00','check');
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
  CONSTRAINT `scores_ibfk_3` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scores`
--

LOCK TABLES `scores` WRITE;
/*!40000 ALTER TABLE `scores` DISABLE KEYS */;
INSERT INTO `scores` VALUES (15,'',80,1,7,'2025-05-03 21:12:29',2),(16,'',70,1,16,'2025-05-03 23:54:28',4),(17,'',90,2,7,'2025-05-04 00:09:03',1),(18,'Did not turn',50,2,16,'2025-05-04 23:10:18',5),(19,'',80,2,48,'2025-05-09 22:42:20',6),(20,'',90,11,7,'2025-05-10 20:59:24',7),(21,'',50,11,16,'2025-05-10 20:59:39',8),(22,'This is good',90,12,7,'2025-05-10 21:02:07',9),(23,'',89,13,7,'2025-05-10 21:04:42',10),(24,'',29,14,7,'2025-05-10 21:05:00',11),(25,'',0,14,16,'2025-05-10 21:06:31',12),(26,'',90,15,7,'2025-05-10 21:08:32',13),(27,'bing',5,20,7,'2025-05-12 21:20:29',14),(28,'',0,20,16,'2025-05-12 23:42:10',15),(29,'a',40,10,7,'2025-05-17 00:36:58',17),(30,'',50,4,16,'2025-05-24 00:17:45',20);
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
  `rate` int NOT NULL DEFAULT '14',
  PRIMARY KEY (`id`),
  CONSTRAINT `semesters_chk_1` CHECK ((`start_date` < `end_date`))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semesters`
--

LOCK TABLES `semesters` WRITE;
/*!40000 ALTER TABLE `semesters` DISABLE KEYS */;
INSERT INTO `semesters` VALUES (1,'Spring 2025','2025-01-10','2025-06-15','Ongoing','2025-03-23 15:55:08',14),(2,'Fall 2025','2025-08-20','2025-12-15','Upcoming','2025-03-23 15:55:28',14),(4,'Winter 2025','2025-12-21','2026-02-07','Upcoming','2025-05-18 22:59:22',14);
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
INSERT INTO `submissions` VALUES (1,7,2,'2025-04-18 12:43:40','Temp submission'),(2,7,1,'2025-04-18 15:45:24','test'),(4,16,1,'2025-05-03 16:54:28','Manually Graded'),(5,16,2,'2025-05-04 16:10:18','Manually Graded'),(6,48,2,'2025-05-09 15:42:20','Manually Graded'),(7,7,11,'2025-05-10 13:59:24','Manually Graded'),(8,16,11,'2025-05-10 13:59:39','Manually Graded'),(9,7,12,'2025-05-10 14:02:07','Manually Graded'),(10,7,13,'2025-05-10 14:04:42','Manually Graded'),(11,7,14,'2025-05-10 14:05:00','Manually Graded'),(12,16,14,'2025-05-10 14:06:30','Manually Graded'),(13,7,15,'2025-05-10 14:08:32','Manually Graded'),(14,7,20,'2025-05-12 14:19:37','google.com'),(15,16,20,'2025-05-12 16:42:10','Manually Graded'),(16,7,7,'2025-05-12 17:19:35','google.com'),(17,7,10,'2025-05-16 17:36:58','Manually Graded'),(18,48,16,'2025-05-17 10:10:48','link'),(19,7,10,'2025-05-18 10:46:53','google.com'),(20,16,4,'2025-05-23 17:17:45','Manually Graded'),(21,7,2,'2025-05-25 10:14:35','google.com'),(22,7,2,'2025-05-25 10:15:39','https://docs.google.com/presentation/d/1b_TIIESFLzz6ofwwHJ8tcF8_umc4J8_S5Rv-xQlvrGQ/edit?slide=id.p#slide=id.p'),(23,7,9,'2025-05-30 12:02:00','blah');
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
INSERT INTO `teacher_invites` VALUES ('02087879-82c1-4170-bd9a-e6068512d7d8','2025-04-29 20:24:49','2025-05-04 20:24:49',0,'tepah@gmail.com'),('024cbfbf-3fa8-4dd8-8523-edfde15e1830','2025-05-13 01:18:12','2025-05-18 01:18:12',0,'thisisemail@gmail.com'),('267b4592-5f2a-4a41-9db0-b6299f27986a','2025-04-30 01:34:43','2025-05-05 01:34:43',0,'temp'),('3d2664d4-957a-4303-83f6-327528565233','2025-05-13 01:17:41','2025-05-18 01:17:41',0,'rest'),('40cc7bc5-bfe8-4f7a-b0c8-6607946f9df1','2025-05-12 20:57:45','2025-05-17 20:57:45',0,'math@math.com'),('6b53c7a3-6d17-4c00-903e-83a3ff15e78a','2025-04-30 22:46:46','2025-05-05 22:46:46',0,'temptest@test.com'),('7cbce3c0-2e0c-49fb-a8c2-10691d8a6aa5','2025-04-30 01:28:59','2025-05-05 01:28:59',0,'test@test.com'),('8f646371-13f1-4e53-a33d-5bf65bb4fb95','2025-05-13 01:17:18','2025-05-18 01:17:18',0,'test'),('956b480c-d31d-4087-9f45-fb52a3595e58','2025-04-30 01:42:17','2025-05-05 01:42:17',0,'test@test.com'),('adb7df32-4125-40e3-9ed6-37520fb8fd6e','2025-05-25 16:20:47','2025-05-30 16:20:47',0,''),('afafcfeb-45f3-4565-bc51-9706019601fc','2025-04-29 20:20:59','2025-05-04 20:20:59',0,'tepah@gmail.com'),('b3cdd619-43d7-4760-b05d-043b598f9364','2025-04-29 20:24:21','2025-05-04 20:24:21',0,'tepah@gmail.com'),('f8a5f608-ba86-4f26-9e34-5c5dd3fa44b6','2025-05-02 22:47:24','2025-05-07 22:47:24',0,'tester@teacher.com');
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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (-1,'DONATION','USER','2001-01-01','Male','Donation@email.com','0000000000','',NULL,NULL,NULL,NULL,'Student',NULL,'2025-05-02 23:11:42','2025-05-02 23:11:42','Active',NULL),(1,'Jack','Doe','2000-05-09','Male','johndoe@example.com','+1234567890','123 Main St','Jane Doe','+1987654321','BlueCross','ABC123456','Student','10','2025-03-23 15:53:02','2025-05-29 03:14:20','Active',''),(2,'Ally','Johnson','1985-08-18','Female','alice.johnson@example.com','+1234567891','456 Elm St','','','UnitedHealth','XYZ789101','Teacher',NULL,'2025-03-23 15:53:58','2025-05-29 03:39:54','Active','Algebra, Algebra 2, Geometry, Calculus, Calculus AB'),(3,'Pete','Potipitak','2000-07-05','Male','potipitak@gmail.com','951-401-0512','123 Home St.','None','None','None','None','Teacher',NULL,'2025-03-23 16:57:44','2025-05-22 00:31:10','Active','C++, Python, Java'),(4,'Smith','John','2011-07-05','Male','test@gmail.com','951-401-0512','123 Home St.','None','None','None','None','Student',NULL,'2025-03-23 17:01:54','2025-03-23 17:01:54','Active',NULL),(7,'Student','Guy','2000-07-05','Male','student@test.com','951-401-0512','123 Home St.','Mom Guy','(100)100-1000','Blue Cross','123','Student',NULL,'2025-03-29 20:45:56','2025-03-29 20:45:56','Active',NULL),(8,'Teacher','Man','2000-07-05','Male','teacher@test.com','(123)100-1000','123 Home St.',NULL,NULL,NULL,NULL,'Teacher',NULL,'2025-03-29 20:50:06','2025-05-22 00:31:10','Active','C++, Python, Algebra, Algebra 2, Geometry'),(9,'Teacher','Man','2000-07-05','Male','admin@test.com','(123)100-1000','123 Home St.',NULL,NULL,NULL,NULL,'Admin',NULL,'2025-03-29 22:33:58','2025-03-29 22:33:58','Active',NULL),(10,'Pete','Potipitak','1996-07-05','Male','email@email.com','951','123','mom','123','blue',NULL,'Student','12','2025-04-03 18:47:12','2025-04-03 18:47:12','Active',NULL),(12,'test','test','2010-01-01','Male','new@email.com','123','123','123','123','blue',NULL,'Student','12','2025-04-04 22:36:50','2025-04-04 22:36:50','Active',NULL),(13,'John','Smith','1999-12-31','Male','temptest@test.com','1111111111','123 Home Home',NULL,NULL,NULL,NULL,'Teacher',NULL,'2025-05-01 00:00:01','2025-05-01 00:00:01','Active',NULL),(15,'John','Smith','1999-12-31','Male','ttest@test.com','1111111111','123 Home Home',NULL,NULL,NULL,NULL,'Teacher',NULL,'2025-05-01 00:00:59','2025-05-01 00:00:59','Active',NULL),(16,'Testing','Student','2013-12-31','Male','studenttest@email.com','1111111111','123 123','gar','9191111111','blue',NULL,'Student','10','2025-05-01 00:21:35','2025-05-01 00:21:35','Active',NULL),(17,'Test','Tester','2009-12-31','Male','tester@tester.com','1231231234','123 123','123','1231231234','blue',NULL,'Student','12','2025-05-01 19:17:36','2025-05-01 19:17:36','Active',NULL),(22,'Pete','Potipitak','1999-12-31','Male','tester@teacher.com','9514010512','1706 Raymar st.',NULL,NULL,NULL,NULL,'Teacher',NULL,'2025-05-02 22:48:03','2025-05-22 00:31:10','Active','Physics, Physics 2, Physics 3'),(23,'Pete','Potipitak','1991-01-09','Male','tepaht@gmail.com','9514010512','1706 Raymar st.','temp','1231231234','temp',NULL,'Student','12','2025-05-02 23:02:13','2025-05-02 23:02:13','Active',NULL),(24,'Richard','Wang','2000-01-01','Female','imw.richard@gmail.com','9097607308','216 Daybreak Dr','jrilwaj','9099099099','jfiowajio',NULL,'Student','10','2025-05-04 17:15:05','2025-05-04 17:15:05','Active',NULL),(48,'Pete','Potipitak','2019-12-31','Male','tepahtops@gmail.com','9514010512','1706 Raymar st.','mom','1231231234','blue',NULL,'Student','11','2025-05-09 15:57:18','2025-05-09 15:57:18','Active',NULL),(49,'test','test','2000-12-31','Male','testing@testing.com','1231231234','123','123','1231231234','temp',NULL,'Student','12','2025-05-09 22:30:28','2025-05-09 22:30:28','Active',NULL),(50,'temp','tewmp','2009-12-31','Male','testing@tester.com','1231231234','123','123','1231231234','blue',NULL,'Student','12','2025-05-09 22:37:51','2025-05-09 22:37:51','Active',NULL),(51,'Bobby','Kid','2019-12-31','Male','tepaht@test.com','1231231234','123 Colima','123','1231231234','blue',NULL,'Student','11','2025-05-12 21:31:14','2025-05-13 01:36:33','Inactive',NULL),(52,'Pete','Potipitak','1999-12-31','Male','testermode@gmail.com','9514010512','1706 Raymar st.','test','1231231234','test',NULL,'Student','11','2025-05-24 00:51:14','2025-05-24 00:51:14','Active',NULL);
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

-- Dump completed on 2025-05-30 15:54:31
