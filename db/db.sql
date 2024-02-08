-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: nodelogin
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `groupname` varchar(1000) DEFAULT NULL,
  `isactive` varchar(8) NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('admin','$2a$10$OYMdF9E3ul27vQDZgUODVOumzcANzUNewOOqvXOqMr3HrGm2h.F36','kidt97+test@gmail.com','admin','active'),('createrole','$2a$10$4FmSmOm.gZ27OPzsfn7aweT0nCliJdlSpYY/zqLhy9ea9oQSt/YZy',NULL,'admin','active'),('dev','$2a$10$ZBMnQ7mmADk7Uza53uYRWue0uyx5O/wMi.OKvr3w//6kCktUHINMu',NULL,'dev,devrole','active'),('doingrole','$2a$10$JEOl.WyxPRphedd9X2EZwOV1l2hQjp8BMIURO8xpTMTZ1FSzrdjaC',NULL,'doingrole','active'),('donerole','$2a$10$u0JJYG8ZWGY0qUXed4SAbeJ.JZgR5hPPZKvPQm9m3GY2ErtORL5GK',NULL,'donerole','active'),('genericpl','$2a$10$Z3XmjS6N1n0bRRiyuO1c6uEO5QcM0JcqQR5omCT9vF/UKHjVjBD7e',NULL,'projectlead','active'),('openrole','$2a$10$m2EwA0KUzfFmb.GIcJwcyeW2hwyf9Lh1Q/M/ffx5y4J11Z2vZJU72',NULL,'openrole','active'),('pl','$2a$10$RdqyQoDDHv8us2R9RF99quAHQpzTAcacaYevimdAMVru1bMa7slae','aws970717+test@gmail.com','projectlead,pl','active'),('pm','$2a$10$xSoGZUYDVTudRhfQ.4e6F.HCv8AbIcveUgSkq./AtsJpTz0LUwTS2',NULL,'pmrole','active'),('todorole','$2a$10$FhUde1VZsKiG53dBV08pyuKChtzmSjhuxgcj51Lpxe8XbLdDx3mBy',NULL,'todorole','active'),('user1','$2a$10$fE.qAVJTcw561P8lKRSkauhLZj98HfB2qI/gE4eOkohP87oxdmdoK',NULL,'projectlead','active'),('user2','$2a$10$o0FA3cO78V8LvkBepd/Z4.c76F0Ju/k3mCoMQIH74OuA/IPKgqKB2',NULL,'admin,createrole,projectlead','active'),('user3','$2a$10$g.MgIP9lJqGf1H/HzIIngulproOIR/7PatUH8DGrXfExWRHVH4Q92',NULL,'createrole,projectlead,zzz','active'),('user4','$2a$10$82kH302HteTTTgOJYLTfwOTNeSCHYfjdO2dDZdXHMCzR52gVhp9R.',NULL,'admin,zzz,projectlead','active'),('user5','$2a$10$gVXBlk3rMnGUram0Lwhp8O29bQpCF4clIYY7DBOcXufkeUAJuYffa',NULL,'admin,projectlead,zzz','active');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `app_acronym` varchar(45) NOT NULL,
  `app_description` varchar(255) DEFAULT NULL,
  `app_rnumber` int NOT NULL DEFAULT '0',
  `app_startdate` varchar(50) NOT NULL,
  `app_enddate` varchar(50) NOT NULL,
  `app_permit_create` varchar(45) NOT NULL,
  `app_permit_open` varchar(45) NOT NULL,
  `app_permit_todolist` varchar(45) NOT NULL,
  `app_permit_doing` varchar(45) NOT NULL,
  `app_permit_done` varchar(45) NOT NULL,
  PRIMARY KEY (`app_acronym`),
  UNIQUE KEY `app_acronym_UNIQUE` (`app_acronym`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES ('adminApp','',99,'1704038400','1706630400','pl','pm','dev','dev','pl'),('app1234567890','this is the most beautiful zoo',9,'1704038400','1706630400','projectlead','pmrole','dev','dev','projectlead'),('safari','',18,'1704038400','1709136000','projectlead','pm','dev','dev','projectlead');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupnamelist`
--

DROP TABLE IF EXISTS `groupnamelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupnamelist` (
  `groupname` varchar(45) NOT NULL,
  UNIQUE KEY `userGroup_UNIQUE` (`groupname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupnamelist`
--

LOCK TABLES `groupnamelist` WRITE;
/*!40000 ALTER TABLE `groupnamelist` DISABLE KEYS */;
INSERT INTO `groupnamelist` VALUES ('admin'),('dev'),('pl'),('pm');
/*!40000 ALTER TABLE `groupnamelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `plan_mvp_name` varchar(45) NOT NULL,
  `plan_startdate` varchar(50) NOT NULL,
  `plan_enddate` varchar(50) NOT NULL,
  `plan_app_acronym` varchar(45) NOT NULL,
  PRIMARY KEY (`plan_mvp_name`,`plan_app_acronym`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES ('dry','1705334400','1705939200','safari'),('newplan','1704729600','1706371200','adminApp'),('sprint 1','1704038400','1706630400','app1234567890'),('wet','1705420800','1706112000','app1234567890'),('wet','1705420800','1705507200','safari');
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `task_name` varchar(45) NOT NULL,
  `task_id` varchar(125) NOT NULL,
  `task_description` varchar(255) DEFAULT NULL,
  `task_status` varchar(45) NOT NULL,
  `task_creator` varchar(50) NOT NULL,
  `task_owner` varchar(50) NOT NULL,
  `task_createdate` varchar(50) NOT NULL,
  `task_notes` longtext,
  `task_plan` varchar(45) DEFAULT NULL,
  `task_app_acronym` varchar(45) NOT NULL,
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES ('admintask2','adminApp_30','test','open','admin','admin','1706576951','\n----------------------------------------------------------------------\nTask Created by admin on\nTue Jan 30 2024 09:09:11 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\ntrue\n','','adminApp'),('admintask2','adminApp_31','1','open','admin','admin','1706576957','\n----------------------------------------------------------------------\nTask Created by admin on\nTue Jan 30 2024 09:09:17 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\ntrue\n','','adminApp'),('hello','adminApp_32','[\"world\",true]','open','admin','admin','1706577043','\n----------------------------------------------------------------------\nTask Created by admin on\nTue Jan 30 2024 09:10:43 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\ntrue\n','','adminApp'),('hello','adminApp_33','0','open','admin','admin','1706577073','\n----------------------------------------------------------------------\nTask Created by admin on\nTue Jan 30 2024 09:11:13 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\ntrue\n','','adminApp'),('hello','adminApp_34','0','open','admin','admin','1706603701','\n----------------------------------------------------------------------\nTask Created by admin on\nTue Jan 30 2024 16:35:01 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\ntrue\n','','adminApp'),('hello','adminApp_35','0','done','admin','admin','1706603716','----------------------------------------------------------------------\nTask Status changed from doing --> done edited by admin on\nTue Jan 30 2024 17:56:26 GMT+0800 (Singapore Standard Time)\nPlan changed from {-NO-PLAN-} to {-NO-PLAN-}\n########## -----NOTES----- ##########\nundefined\n\n----------------------------------------------------------------------\nTask Created by admin on\nTue Jan 30 2024 16:35:16 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\ntrue,asdasd\n','','adminApp'),('hello','adminApp_36','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706604762','\n----------------------------------------------------------------------\nTask Created by admin on\nTue Jan 30 2024 16:52:42 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_37','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706604847','\n----------------------------------------------------------------------\nTask Created by admin on\nTue Jan 30 2024 16:54:07 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_38','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706661759','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:42:39 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_39','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662124','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:48:44 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_40','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662162','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:49:22 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_41','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662302','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:51:42 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_42','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662322','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:52:02 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_43','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662565','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:56:05 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_44','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662596','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:56:36 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_45','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662601','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:56:41 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_46','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662612','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:56:52 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_47','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662616','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:56:56 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_48','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662620','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:57:00 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_49','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662727','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:58:47 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_50','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662737','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 08:58:57 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_51','[\"1\",\"2\",\"3\",\"hello\"]','open','admin','admin','1706662805','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 09:00:05 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_52','asd','open','admin','admin','1706665471','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 09:44:31 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_53','asd','open','admin','admin','1706665487','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 09:44:47 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_54','asd','open','admin','admin','1706665521','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 09:45:21 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_55','asd','open','admin','admin','1706665538','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 09:45:38 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_56','asd','open','admin','admin','1706665546','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 09:45:46 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_57','asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd','open','admin','admin','1706665674','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 09:47:54 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_58','asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd','open','Admin','Admin','1706671357','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 11:22:37 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_59','asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd','open','admin','admin','1706671372','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 11:22:52 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_60','asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd','done','admIn','admin','1706671379','----------------------------------------------------------------------\nTask Status changed from doing --> done edited by admin on\nWed Jan 31 2024 12:15:35 GMT+0800 (Singapore Standard Time)\nPlan changed from {-NO-PLAN-} to {-NO-PLAN-}\n########## -----NOTES----- ##########\nundefined\n\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 11:22:59 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_61','asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd','open','admin','admin','1706671740','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 11:29:00 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hello','adminApp_63','desc','open','admin','admin','1706672264','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 11:37:44 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminAPP'),('hello','adminApp_64','desc','open','admin','admin','1706672266','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 11:37:46 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminAPP'),('hello','adminApp_65','desc','done','admin','dev','1706672274','----------------------------------------------------------------------\nTask Status changed from doing --> done edited by dev on\nWed Jan 31 2024 13:49:12 GMT+0800 (Singapore Standard Time)\nPlan changed from {-NO-PLAN-} to {-NO-PLAN-}\n########## -----NOTES----- ##########\nnotes\n\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 11:37:54 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminAPP'),('hello','adminApp_66','desc','open','admin','admin','1706672278','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 11:37:58 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('hellO','adminApp_67','desc','open','admin','admin','1706672309','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 11:38:29 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_68','desc','open','admin','admin','1706672313','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 11:38:33 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_69','[\"asd\",\"asd\"]','open','admin','admin','1706673783','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:03:03 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_70','[\"asd\",\"asd\"]','open','admin','admin','1706673883','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:04:43 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_71','[\"asd\",\"asd\"]','open','admin','admin','1706674143','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:09:03 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_72','[\"asd\",\"asd\"]','open','admin','admin','1706674149','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:09:09 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_73','[\"asd\",\"asd\"]','open','admin','admin','1706674167','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:09:27 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_74','[\"asd\",\"asd\"]','open','admin','admin','1706674228','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:10:28 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_75','[\"asd\",\"asd\"]','open','admin','admin','1706674260','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:11:00 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_76','[\"asd\",\"asd\"]','open','admin','admin','1706674279','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:11:19 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_77','1','open','admin','admin','1706674299','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:11:39 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_78','[\"asd\",\"asd\"]','open','admin','admin','1706674303','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:11:43 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_79','[\"asd\",\"asd\"]','open','admin','admin','1706674332','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:12:12 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_80','[\"asd\",\"asd\"]','open','admin','admin','1706674350','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:12:30 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_81','','open','admin','admin','1706674431','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:13:51 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_82','','open','admin','admin','1706674439','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:13:59 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_83','','open','admin','admin','1706674460','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:14:20 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_84','','done','admin','dev','1706674633','----------------------------------------------------------------------\nTask Status changed from doing --> done edited by dev on\nWed Jan 31 2024 14:09:14 GMT+0800 (Singapore Standard Time)\nPlan changed from {-NO-PLAN-} to {-NO-PLAN-}\n########## -----NOTES----- ##########\nnotes\n\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:17:13 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_85','','open','admin','admin','1706674643','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:17:23 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_86','','open','admin','admin','1706674686','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:18:06 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_87','','open','admin','admin','1706674716','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:18:36 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_88',NULL,'open','admin','admin','1706674780','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:19:40 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_89',NULL,'open','admin','admin','1706674783','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:19:43 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_90',NULL,'open','admin','admin','1706675023','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:23:43 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_91',NULL,'open','admin','admin','1706675032','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:23:52 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nundefined\n','','adminApp'),('HellO','adminApp_92',NULL,'open','admin','admin','1706675035','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:23:55 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nnotes\n','','adminApp'),('HellO','adminApp_93',NULL,'open','admin','admin','1706675163','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:26:03 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nundefined\n','','adminApp'),('HellO','adminApp_94',NULL,'open','admin','admin','1706675299','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:28:19 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nundefined\n','','adminApp'),('HellO','adminApp_95',NULL,'open','admin','admin','1706675657','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 12:34:17 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nundefined\n','','adminApp'),('HellO','adminApp_96','asd','open','admin','admin','1706679050','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 13:30:50 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nundefined\n','','adminApp'),('HellO','adminApp_97','asd','open','admin','admin','1706679078','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 13:31:18 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nundefined\n','','adminApp'),('HellO','adminApp_98','asd','open','admin','admin','1706679118','\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 13:31:58 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nundefined\n','','adminApp'),('HellO','adminApp_99','asd','done','admin','dev','1706679446','----------------------------------------------------------------------\nTask Status changed from doing --> done edited by dev on\nTue Feb 06 2024 03:23:32 GMT+0000 (Coordinated Universal Time)\nPlan changed from {-NO-PLAN-} to {-NO-PLAN-}\n########## -----NOTES----- ##########\nundefined\n\n----------------------------------------------------------------------\nTask Created by admin on\nWed Jan 31 2024 13:37:26 GMT+0800 (Singapore Standard Time)\n########## -----NOTES----- ##########\nundefined\n','','adminApp'),('HellO','safari_14','asd','open','pl','pl','1707270987','\n----------------------------------------------------------------------\nTask Created by pl on\nWed Feb 07 2024 01:56:27 GMT+0000 (Coordinated Universal Time)\n########## -----NOTES----- ##########\nundefined\n','','safari'),('HellO','safari_15','asd','done','pl','dev','1707270994','----------------------------------------------------------------------\nTask Status changed from doing --> done edited by dev on\nWed Feb 07 2024 01:58:35 GMT+0000 (Coordinated Universal Time)\nPlan changed from {-NO-PLAN-} to {-NO-PLAN-}\n########## -----NOTES----- ##########\nnotes\n\n----------------------------------------------------------------------\nTask Created by pl on\nWed Feb 07 2024 01:56:34 GMT+0000 (Coordinated Universal Time)\n########## -----NOTES----- ##########\nundefined\n','','safari'),('HellO','safari_16','asd','doing','pl','pl','1707270995','\n----------------------------------------------------------------------\nTask Created by pl on\nWed Feb 07 2024 01:56:35 GMT+0000 (Coordinated Universal Time)\n########## -----NOTES----- ##########\nundefined\n','','safari'),('HellO','safari_17','asd','doing','pl','pl','1707270996','\n----------------------------------------------------------------------\nTask Created by pl on\nWed Feb 07 2024 01:56:36 GMT+0000 (Coordinated Universal Time)\n########## -----NOTES----- ##########\nundefined\n','','safari'),('HellO','safari_18','asd','doing','pl','pl','1707270997','\n----------------------------------------------------------------------\nTask Created by pl on\nWed Feb 07 2024 01:56:37 GMT+0000 (Coordinated Universal Time)\n########## -----NOTES----- ##########\nundefined\n','','safari');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-07 10:35:54
