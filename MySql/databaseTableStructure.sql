/*
SQLyog Professional v12.5.1 (64 bit)
MySQL - 5.7.42-cll-lve : Database - smr_love2serve
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`smr_love2serve` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `smr_love2serve`;

/*Table structure for table `booking` */

DROP TABLE IF EXISTS `booking`;

CREATE TABLE `booking` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `flogin_id` bigint(20) DEFAULT NULL,
  `fhotel_id` bigint(20) DEFAULT NULL,
  `booking_id` varchar(255) DEFAULT NULL,
  `frooms_id` bigint(20) DEFAULT NULL,
  `room_type` varchar(255) DEFAULT NULL,
  `package_type` varchar(255) DEFAULT NULL,
  `no_of_rooms` bigint(20) DEFAULT NULL,
  `no_of_guests` bigint(20) DEFAULT NULL,
  `check_in` date DEFAULT NULL,
  `check_out` date DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` bigint(20) DEFAULT NULL,
  `rate` bigint(20) DEFAULT NULL,
  `discount_percent` bigint(20) DEFAULT NULL,
  `discounted_price` bigint(20) DEFAULT NULL,
  `final_bill` bigint(20) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `IsDeleted` bigint(20) DEFAULT '1',
  `IsBlock` bigint(20) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `hotel` */

DROP TABLE IF EXISTS `hotel`;

CREATE TABLE `hotel` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `hotel_name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `pin` bigint(255) DEFAULT NULL,
  `min_rate` bigint(255) DEFAULT NULL,
  `discount` bigint(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `mobile` bigint(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_by` bigint(255) DEFAULT NULL,
  `updated_by` bigint(255) DEFAULT NULL,
  `deleted_by` bigint(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `IsDeleted` bigint(1) DEFAULT '1' COMMENT '0 = deleted',
  `IsBlock` bigint(1) DEFAULT '1' COMMENT '0 = blocked',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `hotel_facilities` */

DROP TABLE IF EXISTS `hotel_facilities`;

CREATE TABLE `hotel_facilities` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `icon` text,
  `createdAt` datetime DEFAULT NULL,
  `IsDeleted` bigint(1) DEFAULT '1',
  `IsBlock` bigint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `hotel_facilities_master` */

DROP TABLE IF EXISTS `hotel_facilities_master`;

CREATE TABLE `hotel_facilities_master` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `fhotel_id` bigint(255) DEFAULT NULL,
  `fhotel_facilities_id` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `IsDeleted` bigint(1) DEFAULT '1',
  `IsBlock` bigint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `hotel_images` */

DROP TABLE IF EXISTS `hotel_images`;

CREATE TABLE `hotel_images` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `fhotel_id` bigint(255) DEFAULT NULL,
  `image` blob,
  `image_type` bigint(255) DEFAULT NULL,
  `createsAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `login` */

DROP TABLE IF EXISTS `login`;

CREATE TABLE `login` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `user_type` bigint(255) DEFAULT NULL,
  `Fhotel_id` bigint(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` bigint(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `verified` bigint(1) DEFAULT '0',
  `created_by` bigint(255) DEFAULT NULL,
  `updated_by` bigint(255) DEFAULT NULL,
  `deleted_by` bigint(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `IsDeleted` bigint(1) DEFAULT '1',
  `IsBlock` bigint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `master_package_type` */

DROP TABLE IF EXISTS `master_package_type`;

CREATE TABLE `master_package_type` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `fhotel_id` bigint(255) DEFAULT NULL,
  `fmaster_room_type_id` bigint(255) DEFAULT NULL,
  `package_type` varchar(255) DEFAULT NULL,
  `rate` bigint(255) DEFAULT NULL,
  `extra_bed_rate` bigint(255) DEFAULT NULL,
  `discount` bigint(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `IsDeleted` bigint(1) DEFAULT '1',
  `IsBlock` bigint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `master_room_type` */

DROP TABLE IF EXISTS `master_room_type`;

CREATE TABLE `master_room_type` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `fhotel_id` bigint(255) DEFAULT NULL,
  `room_type` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `IsDeleted` bigint(1) DEFAULT '1',
  `IsBlock` bigint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `master_user_type` */

DROP TABLE IF EXISTS `master_user_type`;

CREATE TABLE `master_user_type` (
  `Id` bigint(20) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Table structure for table `rating_and_reviews` */

DROP TABLE IF EXISTS `rating_and_reviews`;

CREATE TABLE `rating_and_reviews` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Table structure for table `rooms` */

DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `room_id` bigint(255) DEFAULT NULL,
  `fhotel_id` bigint(255) DEFAULT NULL,
  `fmaster_room_type_id` bigint(255) DEFAULT NULL,
  `fmaster_package_type_id` varchar(255) DEFAULT NULL,
  `availablity` bigint(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `IsDeleted` bigint(1) DEFAULT '1',
  `IsBlock` bigint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `rooms_facilities` */

DROP TABLE IF EXISTS `rooms_facilities`;

CREATE TABLE `rooms_facilities` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `icon` text,
  `createdAt` datetime DEFAULT NULL,
  `IsDeleted` bigint(1) DEFAULT '1',
  `IsBlock` bigint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `rooms_facilities_master` */

DROP TABLE IF EXISTS `rooms_facilities_master`;

CREATE TABLE `rooms_facilities_master` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `fhotel_id` bigint(255) DEFAULT NULL,
  `fmaster_room_type_id` bigint(255) DEFAULT NULL,
  `frooms_facilities_id` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `IsDeleted` bigint(1) DEFAULT '1',
  `IsBlock` bigint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
