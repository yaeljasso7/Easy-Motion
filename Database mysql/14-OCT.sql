-- MySQL dump 10.13  Distrib 5.7.23, for Linux (x86_64)
--
-- Host: localhost    Database: easy-Test
-- ------------------------------------------------------
-- Server version	5.7.23-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `autor` varchar(45) DEFAULT NULL,
  `data` varchar(850) NOT NULL,
  `categoryBlog` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_blog_1_idx` (`categoryBlog`),
  CONSTRAINT `fk_blog_1` FOREIGN KEY (`categoryBlog`) REFERENCES `categoryBlog` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
INSERT INTO `blog` VALUES (1,'2018-10-12 21:48:45','Francisco','En Mty...',7),(2,'2018-10-08 22:03:29','yo','En new york....',1),(5,'2018-10-09 08:36:11','yo','En new york....',1),(6,'2018-10-12 21:15:27','Paquito','En Francia ....',5),(8,'2008-05-30 05:00:00','PostTest','En PostTest  ....',NULL),(9,'2008-05-30 05:00:00','PostTest2','En PostTest  ....2',NULL),(10,'2008-05-30 00:00:00','HerokuAutor','En PostTest  ....2',NULL);
/*!40000 ALTER TABLE `blog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `body_parts`
--

DROP TABLE IF EXISTS `body_parts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `body_parts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `body_parts`
--

LOCK TABLES `body_parts` WRITE;
/*!40000 ALTER TABLE `body_parts` DISABLE KEYS */;
INSERT INTO `body_parts` VALUES (1,'brazo',0),(2,'pierna',0),(3,'bicepts',0),(4,'talon',0),(5,'cuello',0),(6,'Editado desde postman',0),(8,'hombro',0),(9,'tobillo',0),(10,'Parte superior',1);
/*!40000 ALTER TABLE `body_parts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendary`
--

DROP TABLE IF EXISTS `calendary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendary`
--

LOCK TABLES `calendary` WRITE;
/*!40000 ALTER TABLE `calendary` DISABLE KEYS */;
INSERT INTO `calendary` VALUES (1,'principiantes'),(3,'expertos'),(4,'genios'),(5,'Atletas'),(6,'Express');
/*!40000 ALTER TABLE `calendary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendaryDayRoutine`
--

DROP TABLE IF EXISTS `calendaryDayRoutine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendaryDayRoutine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idCalendary` int(11) NOT NULL,
  `idRoutine` int(11) NOT NULL,
  `Day` int(11) NOT NULL,
  PRIMARY KEY (`idCalendary`,`idRoutine`,`Day`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_routine_idx` (`idRoutine`),
  CONSTRAINT `fk_calendaryDayRoutine_calendary` FOREIGN KEY (`idCalendary`) REFERENCES `calendary` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_calendaryDayRoutine_routine` FOREIGN KEY (`idRoutine`) REFERENCES `routines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendaryDayRoutine`
--

LOCK TABLES `calendaryDayRoutine` WRITE;
/*!40000 ALTER TABLE `calendaryDayRoutine` DISABLE KEYS */;
INSERT INTO `calendaryDayRoutine` VALUES (1,1,1,1);
/*!40000 ALTER TABLE `calendaryDayRoutine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoryBlog`
--

DROP TABLE IF EXISTS `categoryBlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoryBlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoryBlog`
--

LOCK TABLES `categoryBlog` WRITE;
/*!40000 ALTER TABLE `categoryBlog` DISABLE KEYS */;
INSERT INTO `categoryBlog` VALUES (1,'Nutricion'),(5,'Hogar'),(6,'Tecnologia'),(7,'Departamento'),(8,'Mexico'),(9,'Belleza'),(10,'Hiit');
/*!40000 ALTER TABLE `categoryBlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exercises` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(90) NOT NULL DEFAULT '',
  `difficulty` int(11) NOT NULL,
  `trainingType` int(11) NOT NULL,
  `bodyPart` int(11) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
INSERT INTO `exercises` VALUES (1,'remo','remado',1,3,1,0),(2,'caminadora','',1,7,5,0),(3,'pesas','',2,6,2,0),(4,'saltar','saltando',8,8,1,0),(5,'sentadillas','',8,5,7,0),(8,'lagartijas','',9,1,3,0),(9,'modificado9','nueve',9,9,9,0),(10,'modificado10','diez....',9,9,9,0),(11,'Test','test',8,5,10,0),(12,'nuevoEjercisio','Para valientes..',7,3,1,0),(13,'Ejercicio de prueba','',6,1,1,1),(14,'testing','5',2,6,2,0);
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises_routines`
--

DROP TABLE IF EXISTS `exercises_routines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exercises_routines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `routineId` int(11) NOT NULL,
  `exerciseId` int(11) NOT NULL,
  PRIMARY KEY (`routineId`,`exerciseId`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_exer` (`exerciseId`),
  CONSTRAINT `fk_exercise_exOnRoutine` FOREIGN KEY (`exerciseId`) REFERENCES `exercises` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_routine_exOnRoutine` FOREIGN KEY (`routineId`) REFERENCES `routines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises_routines`
--

LOCK TABLES `exercises_routines` WRITE;
/*!40000 ALTER TABLE `exercises_routines` DISABLE KEYS */;
INSERT INTO `exercises_routines` VALUES (1,1,1),(2,3,1),(3,5,2),(5,5,4),(7,1,2),(9,7,4),(11,4,1),(12,4,2);
/*!40000 ALTER TABLE `exercises_routines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progressUser`
--

DROP TABLE IF EXISTS `progressUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `progressUser` (
  `idUser` int(11) NOT NULL,
  `weight` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUser`,`date`),
  CONSTRAINT `fk_idUser_progressUser` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progressUser`
--

LOCK TABLES `progressUser` WRITE;
/*!40000 ALTER TABLE `progressUser` DISABLE KEYS */;
INSERT INTO `progressUser` VALUES (8,180,180,'2018-10-12 23:19:14'),(8,170,180,'2018-10-13 00:07:36'),(8,165,165,'2018-10-13 00:36:39'),(8,165,165,'2018-10-13 00:37:39'),(8,164,165,'2018-10-13 00:38:00'),(8,112,165,'2018-10-13 01:08:40'),(9,180,180,'2018-10-12 23:19:14'),(18,188,188,'2018-10-13 01:14:04'),(18,119,119,'2018-10-13 01:14:55');
/*!40000 ALTER TABLE `progressUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routines`
--

DROP TABLE IF EXISTS `routines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `routines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routines`
--

LOCK TABLES `routines` WRITE;
/*!40000 ALTER TABLE `routines` DISABLE KEYS */;
INSERT INTO `routines` VALUES (1,'Dificil',0),(3,'Modificado',0),(4,'Gana musculo',0),(5,'Super fuerte',0),(7,'Mañanero',0),(8,'Testing1',0),(9,'Adelgaza en 3 pasos',0),(11,'Diez',0);
/*!40000 ALTER TABLE `routines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_types`
--

DROP TABLE IF EXISTS `training_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `training_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(45) NOT NULL DEFAULT '',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_types`
--

LOCK TABLES `training_types` WRITE;
/*!40000 ALTER TABLE `training_types` DISABLE KEYS */;
INSERT INTO `training_types` VALUES (1,'box','En el box..',0),(2,'karate','JackieChang',0),(3,'cardio','Baja de peso',0),(5,'Editado o o ','Super editado',0),(7,'Hiit','',0),(8,'Spring','Fast.',0),(9,'Flexibilidad','',1);
/*!40000 ALTER TABLE `training_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `mobile` varchar(12) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `password` varchar(45) NOT NULL,
  `mail` varchar(90) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (8,'8','3310',399,249,'1234','testing@mail.com'),(9,'9','3310',399,249,'1234','9@correo.com'),(10,'10','3310',399,249,'1234','10@correo.com'),(12,'12','9999999999',399,249,'1234','12@correo.com'),(13,'13','9999999999',399,249,'1234','13@correo.com'),(14,'13','3310',399,249,'1234','13@correo.com'),(15,'juaquin','3310436545',399,249,'1234','13@correo.com'),(16,'juaquin','1234567890',399,249,'1234567890','13@corre.com'),(17,'Samuel','3310458565',399,249,'1234','J01@correo.com'),(18,'Soy18','3310458565',188,188,'1234','J01@correo.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userCalendary`
--

DROP TABLE IF EXISTS `userCalendary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userCalendary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `idCalendary` int(11) NOT NULL,
  `isDone` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idUser`,`idCalendary`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_userRoutine_routine` (`idCalendary`) USING BTREE,
  KEY `fk_userRoutine_user` (`idUser`) USING BTREE,
  CONSTRAINT `fk_userCalendary_idCalendary` FOREIGN KEY (`idCalendary`) REFERENCES `calendary` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_userCalendary_idUser` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userCalendary`
--

LOCK TABLES `userCalendary` WRITE;
/*!40000 ALTER TABLE `userCalendary` DISABLE KEYS */;
INSERT INTO `userCalendary` VALUES (3,8,1,0),(7,14,5,0),(6,14,6,0);
/*!40000 ALTER TABLE `userCalendary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `v_exercises`
--

DROP TABLE IF EXISTS `v_exercises`;
/*!50001 DROP VIEW IF EXISTS `v_exercises`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_exercises` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `description`,
 1 AS `difficulty`,
 1 AS `bodyPartID`,
 1 AS `bodyPart`,
 1 AS `trainingTypeID`,
 1 AS `trainingType`,
 1 AS `isDeleted`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_exercises`
--

/*!50001 DROP VIEW IF EXISTS `v_exercises`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_exercises` AS select `exercises`.`id` AS `id`,`exercises`.`name` AS `name`,`exercises`.`description` AS `description`,`exercises`.`difficulty` AS `difficulty`,`body_parts`.`id` AS `bodyPartID`,`body_parts`.`name` AS `bodyPart`,`training_types`.`id` AS `trainingTypeID`,`training_types`.`name` AS `trainingType`,`exercises`.`isDeleted` AS `isDeleted` from ((`exercises` join `body_parts` on((`exercises`.`bodyPart` = `body_parts`.`id`))) join `training_types` on((`exercises`.`trainingType` = `training_types`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-14  0:33:57
