-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 13-12-2020 a las 01:10:21
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `vesvir_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `brands`
--

CREATE TABLE `brands` (
  `idBrand` int(11) NOT NULL,
  `name` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  `haveImage` tinyint(1) DEFAULT 0,
  `createDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `brands`
--

INSERT INTO `brands` (`idBrand`, `name`, `active`, `deleted`, `haveImage`, `createDate`) VALUES
(-1, 'Sin Especificar', 1, 0, 0, '2020-11-02 23:26:40'),
(2, 'Nike', 0, 0, 1, '2020-11-03 01:37:29'),
(3, 'Levis', 0, 0, 0, '2020-11-03 01:39:41'),
(4, 'C&A', 1, 0, 1, '2020-11-03 01:39:41'),
(5, 'sdsdsdsdsd', 0, 1, 0, '2020-11-03 01:39:41'),
(6, 'boboissaa', 0, 1, 0, '2020-11-03 01:39:41'),
(7, 'Cuidado con el perro', 1, 0, 1, '2020-11-03 20:29:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cards`
--

CREATE TABLE `cards` (
  `idCard` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `token` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `lastFour` varchar(4) COLLATE utf8_unicode_ci NOT NULL,
  `brand` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `deleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `cards`
--

INSERT INTO `cards` (`idCard`, `idUser`, `token`, `lastFour`, `brand`, `createdAt`, `deleted`) VALUES
(8, 12, 'src_2otezUTfyZG4dkYs6', '4242', 'visa', '2020-12-12 23:59:14', 1),
(9, 12, 'src_2otf1Q42CoJJdfEzw', '4242', 'visa', '2020-12-13 00:00:27', 1),
(10, 12, 'src_2otf1kixnP4UgMb7i', '4242', 'visa', '2020-12-13 00:00:56', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `idCategory` int(11) NOT NULL,
  `name` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `genre` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  `createDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`idCategory`, `name`, `genre`, `active`, `deleted`, `createDate`) VALUES
(1, 'botas', 1, 0, 1, '2020-11-02 07:17:23'),
(2, 'camisas', 0, 0, 1, '2020-11-02 07:30:47'),
(3, 'botas', 1, 1, 0, '2020-11-02 16:56:12'),
(4, 'camisas', 0, 1, 0, '2020-11-02 16:56:12'),
(5, 'zapatos', 2, 1, 0, '2020-11-03 20:29:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `directions`
--

CREATE TABLE `directions` (
  `idDirection` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `surnames` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `street` varchar(800) COLLATE utf8_unicode_ci NOT NULL,
  `number` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `extNumber` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `postalCode` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `colony` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `default` tinyint(1) NOT NULL DEFAULT 0,
  `idUser` int(11) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `directions`
--

INSERT INTO `directions` (`idDirection`, `name`, `surnames`, `phone`, `street`, `number`, `extNumber`, `state`, `city`, `postalCode`, `colony`, `default`, `idUser`, `deleted`) VALUES
(1, 'Luismiguel', 'ortiz alvarez', '6394740742', 'avenida 26 poniente', '2', '', 'chihuahua', 'delicias', '33000', 'magisterial', 1, 6, 0),
(5, 'Luismiguel', 'Ortiz Alvarez', '6394740742', 'avenida 26 possssniente', '206', '', 'Chihuahua', 'Delicias', '33000', 'Magistral', 1, 8, 1),
(6, 'Luismiguelsdsdsdsd', 'Ortiz Alvarez', '6394740742', 'avenida 26 poniente', '206', '', 'Chihuahua', 'Delicias', '33000', 'Magistral', 1, 8, 0),
(7, 'Luismiguel', 'Ortiz Alvarez', '6394740742', 'avenida 26 possssnienteaaaaa', '206', '', 'Chihuahua', 'Delicias', '33000', 'Magistral', 0, 8, 1),
(8, '614-125-2557', 'Ortiz Alvarez', '6141252557', 'sd', '206', '', 'Chihuahua', 'Delicias', '33000', 'Magistral', 0, 8, 1),
(9, 'Luismiguel', 'Ortiz Alvarez', '3333333333', 'ssssssssssssssssssssssss', '206', '', 'Chihuahua', 'Delicias', '33000', 'Magistral', 0, 8, 1),
(10, 'Luismiguel', 'Ortiz Alvarez', '3333333333', 'saaaaaaaaaaaa', '206', '', 'Chihuahua', 'Delicias', '33000', 'Magistral', 0, 8, 1),
(11, 'Luismiguel', 'Ortiz Alvarez', '3344444444', 'sfdfdfddf', '206', '', 'Chihuahua', 'Delicias', '33000', 'Magistral', 0, 8, 1),
(12, 'Luismiguel', 'ortiz alvarez', '3333333333', 'dddddddddddddddddd', '344', '', 'Chihuahua', 'Delicias', '33000', 'Magistral', 0, 8, 1),
(13, 'Luismiguel', 'Ortiz Alvarez', '5555555555', '4444444444444444', '206', '', 'Chihuahua', 'Delicias', '33000', 'magisterial', 0, 8, 1),
(14, 'Luismiguel', 'Ortiz Alvarez', '1111111111', 'sdsdsdsds', '205', '', 'Chihuahua', 'Delicias', '33000', 'magisterial', 0, 8, 1),
(15, 'Luismiguel', 'Alvarez', '5261412525', '', '', '', '', '', '', '', 1, 9, 0),
(16, 'Luismiguelsssssss', 'Alvarez', '5261412525', '', '', '', '', '', '', '', 1, 10, 0),
(17, 'Luismi', 'Alvarez test', '5261412525', 'sssssssaaaaa', '2', '', 'Chi', 'Deli', '33', 'magisterial', 1, 7, 0),
(18, 'Luismiguel', 'Alvarez', '5261412525', 'avenida 26 test provedor', '206', '', 'chiahuahua', 'Delciada', '33000', 'Magisterial', 0, 7, 1),
(19, 'Luismiguel', 'Alvarezhhhh', '5261412525', 'avenida 26 test provedor', '206', '', 'chiahuahua', 'Delciada', '33000', 'Magisterial', 0, 7, 1),
(20, 'Luismiguel', 'Alvarezhhhh', '5261412525', 'avenida 26 test provedor', '206', '', 'chiahuahua', 'Delciada', '33000', 'Magisterial', 0, 7, 1),
(21, 'Luismiguel', 'Alvarezhhhh', '5261412525', 'avenida 26 test provedor', '206', '', 'chiahuahua', 'Delciada', '33000', 'Magisterial', 0, 7, 1),
(22, 'Luismiguel', 'Alvarez', '1151515151', 'fffff', '1111', '', 'Chihuahua', 'Delicias', '33000', 'magisterial', 1, 11, 0),
(24, 'Luismiguel', 'Ortiz Alvarez', '6394740742', 'Avenida 26 poniente', '206', '', 'Chihuahua', 'Chihuahua', '33000', 'Magisterial', 1, 12, 0),
(25, 'Luismiguel', 'Ortiz Alvarez', '6394740742', 'Avenida 26 poniente', '206', '', 'Chiapas', 'Ángel Albino Corzo', '33000', 'Magisterial', 0, 12, 0),
(26, 'Luismiguel 323', 'Ortiz Alvarez', '6394740742', 'Avenida 26 poniente', '206', '', 'Chihuahua', 'Aldama', '33000', 'Magisterial', 1, 12, 0),
(27, 'Flor Alejandra', 'Legarda Araujo', '6369874564', 'Calle de quintas', '369', '', 'Chihuahua', 'Camargo', '332200', 'Campo bello', 0, 12, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productImage`
--

CREATE TABLE `productImage` (
  `idProductImage` int(11) NOT NULL,
  `idProduct` int(11) NOT NULL,
  `name` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `productImage`
--

INSERT INTO `productImage` (`idProductImage`, `idProduct`, `name`, `position`) VALUES
(7, 15, 'dsdsds', 0),
(8, 16, 'dsdsds', 0),
(9, 19, 'adidas', 2),
(11, 19, 'BOTA S', 1),
(12, 19, 'dsdsds', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `idProduct` int(11) NOT NULL,
  `idProvider` int(11) NOT NULL,
  `activated` tinyint(1) NOT NULL,
  `name` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `referenceCode` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `barCode` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `idBrand` int(11) NOT NULL,
  `gender` int(11) NOT NULL,
  `idCategory` int(11) NOT NULL,
  `material` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `shortDescription` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(5000) COLLATE utf8_unicode_ci NOT NULL,
  `specs` varchar(5000) COLLATE utf8_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `width` double NOT NULL,
  `height` double NOT NULL,
  `depth` double NOT NULL,
  `weight` double NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `createDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`idProduct`, `idProvider`, `activated`, `name`, `referenceCode`, `barCode`, `idBrand`, `gender`, `idCategory`, `material`, `shortDescription`, `description`, `specs`, `price`, `width`, `height`, `depth`, `weight`, `deleted`, `createDate`) VALUES
(3, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 17:05:19'),
(4, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 17:05:19'),
(5, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 18:18:25'),
(6, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 18:21:31'),
(7, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 18:21:31'),
(9, 7, 0, 'zapatos', '15653', 'ds151', -1, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 18:31:27'),
(10, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 21:56:24'),
(11, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 21:56:24'),
(12, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 21:58:34'),
(13, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 22:07:00'),
(14, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 22:25:31'),
(15, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 22:25:31'),
(16, 7, 0, 'zapatos', '15653', 'ds151', 7, 0, 5, 'piel', 'es zapato', 'es un zapato muy chido', 'todo brilla', 1556, 15, 2, 6, 0.85, 0, '2020-11-08 22:25:31'),
(17, 7, 0, 'sdsdd', 'asd', 'd', 7, 0, 5, 'assd', 'asdsds', 'sdsd', 'sdsad', 4324, 2, 2, 2, 2, 0, '2020-11-09 18:14:06'),
(18, 7, 0, 'dsda', '', '', 7, 2, 3, 'dasd', 'asd', 'sdsd', 'dsad', 3434, 5, 6, 7, 8, 0, '2020-11-09 18:15:39'),
(19, 7, 0, 'test prod', '', '', -1, 0, 5, 'kkh', 'khk', 'khkk', 'todo chido', 25, 2, 2, 3, 2, 0, '2020-11-09 19:47:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productStickers`
--

CREATE TABLE `productStickers` (
  `idProductSticker` int(11) NOT NULL,
  `IdProduct` int(11) NOT NULL,
  `name` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `productStickers`
--

INSERT INTO `productStickers` (`idProductSticker`, `IdProduct`, `name`, `position`) VALUES
(6, 19, 'Bolsa 1', 0),
(8, 19, 'camisa', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `quantitys`
--

CREATE TABLE `quantitys` (
  `idQuantity` int(11) NOT NULL,
  `idProduct` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `size` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `createDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `quantitys`
--

INSERT INTO `quantitys` (`idQuantity`, `idProduct`, `quantity`, `size`, `color`, `description`, `deleted`, `createDate`) VALUES
(1, 4, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 18:09:34'),
(2, 5, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 18:17:51'),
(3, 6, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 18:21:42'),
(4, 7, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 18:21:42'),
(5, 9, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 18:21:42'),
(6, 10, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 18:21:42'),
(7, 11, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 18:21:42'),
(8, 12, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 18:21:42'),
(9, 13, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 18:21:42'),
(10, 14, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 22:31:04'),
(11, 15, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 22:32:31'),
(12, 16, 10, 'mediano', 'morado', 'descrip', 0, '2020-11-08 22:32:31'),
(13, 17, 0, 'mediano', 'gris', 'ninguna', 0, '2020-11-09 16:27:10'),
(14, 18, 0, 'EWE', 'WEEDF', 'F', 0, '2020-11-09 16:27:10'),
(15, 19, 0, 'unisex', 'negro', '', 0, '2020-11-09 19:30:12'),
(16, 3, 2, 'simonki', 'blaki', 'a', 0, NULL),
(17, 19, 0, 'Grande', 'ddddd', '', 0, '2020-11-11 01:08:37'),
(18, 19, 0, 'Mediano', 'sss', '', 0, '2020-11-11 01:08:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `surnames` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `passwordF` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `birthDay` datetime DEFAULT NULL,
  `phone` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `genre` int(11) DEFAULT -1,
  `actualPreference` int(11) DEFAULT -1,
  `userType` int(11) DEFAULT 2,
  `createDate` datetime DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `businessName` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Billing Information',
  `rfc` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Billing Information',
  `phoneBilling` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Billing Information',
  `emailBilling` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Billing Information',
  `state` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Billing Information',
  `city` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Billing Information',
  `postalCode` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Billing Information',
  `colony` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Billing Information',
  `street` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Billing Information',
  `number` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Billing Information',
  `deleted` tinyint(1) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `conektaClientId` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `userFacebookImage` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`idUser`, `name`, `surnames`, `email`, `password`, `passwordF`, `birthDay`, `phone`, `genre`, `actualPreference`, `userType`, `createDate`, `lastLogin`, `businessName`, `rfc`, `phoneBilling`, `emailBilling`, `state`, `city`, `postalCode`, `colony`, `street`, `number`, `deleted`, `active`, `conektaClientId`, `userFacebookImage`) VALUES
(6, 'Luismiguel', 'Ortiz Alvarez', 'luismi.luu@gmail.com', '$2b$10$W7QCUe9Z/Xqm1lhWo9wUxeWKTaVu46jefyzuyACNXiid.k.MOXPxS', '', '2015-04-16 06:00:00', '6141252557', 0, -1, 0, '2020-10-23 02:14:48', '2020-10-30 16:12:50', 'EQUIPOS INTEGRADOS DE SEGURIDAD SA DE CV', 'EIS981217B24', '6394740742', 'luismi.luu@gmail.com', 'Chihuahua', 'Delicias', '33000', 'Magisterial', 'Avenida 26 Poniente y Calle 3ra #206', '206', 0, 1, '', ''),
(7, 'Provedor', 'test', 'luismi.luu1p@gmail.com', '$2b$10$0lUrFJVF9O5dk./E3zKX9uggIFo1SZrl45psPVy27I.Azel7ulvrC', '', '1991-05-08 06:00:00', '5261412525', 0, -1, 1, '2020-10-30 16:16:21', '2020-10-30 16:16:21', 'EQUIPOS INTEGRADOS DE SEGURIDAD SA DE CV', 'EIS981217B24', '6666666666', 'luismi.luu@gmail.com', 'chiahuahua', 'Delciada', '33000', 'Magisterial', 'avenida 26 test provedor', '206', 0, 1, '', ''),
(8, 'Luismiguel', 'Slvarez', 'luismi.luu2@gmail.com', '$2b$10$BVYpUBJhDJe6LSH41DiRcuUaBOGLDxGIyBehZJsw6z1WTWiWxY9HW', '', '1994-01-18 06:00:00', '5261412525', 1, -1, 1, '2020-10-30 16:17:06', '2020-10-30 16:17:06', 'EQUIPOS INTEGRADOS DE SEGURIDAD SA DE CV', 'EIS981217B24', '6394740742', 'luismi.luu@gmail.com', 'Chihuahua', 'Delicias', '33000', 'Magisterial', 'Avenida 26 Poniente y Calle 3ra #206 Colonia Magisterial', '206', 0, 1, '', ''),
(9, 'Luismiguel', 'Alvarez', 'luismi.luu3@gmail.com', '$2b$10$d2.SPlP1MbMPk3nsC/JY3.Nz.uFnTT4pbsyyKVLtkOqV4lDPzRtk6', '', '2020-10-30 00:00:00', '5261412525', 0, -1, 1, '2020-10-30 23:57:22', '2020-10-30 23:57:22', '', '', '', '', '', '', '', '', '', '', 0, 0, '', ''),
(10, 'Luismiguelsssssss', 'Alvarez', 'luismi.luu4@gmail.com', '$2b$10$oiiKW9O1cV48p1PdBPM3TOUXajUbp.iPq1BlshZOdR.3x6oRFTa9m', '', '2020-10-30 00:00:00', '5261412525', 1, -1, 1, '2020-10-30 23:59:19', '2020-10-30 23:59:19', '', '', '', '', '', '', '', '', '', '', 0, 1, '', ''),
(11, '', '', 'luismi.luuaaaa@gmail.com', '$2b$10$6YclG3T/Dsu.fifH.2eEhubOZEngIhT7yKRRqCz0kCnKX9si7neeS', '', '2020-10-31 20:59:04', '', -1, -1, 2, '2020-10-31 20:59:04', '2020-10-31 20:59:04', '', '', '', '', '', '', '', '', '', '', 0, 1, '', ''),
(12, 'Luismi', 'Ortiz Alvarez', 'a310852@uach.mx', '$2b$10$Zs5bHbi21/aOGbmk9XBcS.QcLCT9pghWLX3Gh10RF81XyXXRwOzHi', '', '2000-09-01 06:00:00', '6391235698', 0, 1, 2, '2020-11-22 18:12:37', '2020-11-22 18:12:37', 'EQUIPOS INR', 'EISSAEE45545', '6123658896', 'luismi.lii@gma.com', 'Chihuahua', 'Delicias', '33000', 'magisterial', 'avenida 26 poniente', '206', 0, 1, 'cus_2otTcCUyp8UNWHkqR', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`idBrand`),
  ADD UNIQUE KEY `brands_UN` (`idBrand`);

--
-- Indices de la tabla `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`idCard`),
  ADD UNIQUE KEY `cards_UN` (`idCard`),
  ADD KEY `cards_FK` (`idUser`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`idCategory`),
  ADD UNIQUE KEY `categories_UN` (`idCategory`);

--
-- Indices de la tabla `directions`
--
ALTER TABLE `directions`
  ADD PRIMARY KEY (`idDirection`),
  ADD UNIQUE KEY `directions_UN` (`idDirection`),
  ADD KEY `directions_FK` (`idUser`);

--
-- Indices de la tabla `productImage`
--
ALTER TABLE `productImage`
  ADD PRIMARY KEY (`idProductImage`),
  ADD UNIQUE KEY `productImage_UN` (`idProductImage`),
  ADD KEY `productImage_FK` (`idProduct`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`idProduct`),
  ADD UNIQUE KEY `products_UN` (`idProduct`),
  ADD KEY `products_FK` (`idCategory`),
  ADD KEY `products_FK_1` (`idBrand`),
  ADD KEY `products_FK_2` (`idProvider`);

--
-- Indices de la tabla `productStickers`
--
ALTER TABLE `productStickers`
  ADD PRIMARY KEY (`idProductSticker`),
  ADD UNIQUE KEY `productSticker_UN` (`idProductSticker`),
  ADD KEY `productSticker_FK` (`IdProduct`);

--
-- Indices de la tabla `quantitys`
--
ALTER TABLE `quantitys`
  ADD PRIMARY KEY (`idQuantity`),
  ADD UNIQUE KEY `quantitys_UN` (`idQuantity`),
  ADD KEY `quantitys_FK` (`idProduct`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `users_UN` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `brands`
--
ALTER TABLE `brands`
  MODIFY `idBrand` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `cards`
--
ALTER TABLE `cards`
  MODIFY `idCard` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `idCategory` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `directions`
--
ALTER TABLE `directions`
  MODIFY `idDirection` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `productImage`
--
ALTER TABLE `productImage`
  MODIFY `idProductImage` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `idProduct` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `productStickers`
--
ALTER TABLE `productStickers`
  MODIFY `idProductSticker` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `quantitys`
--
ALTER TABLE `quantitys`
  MODIFY `idQuantity` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cards`
--
ALTER TABLE `cards`
  ADD CONSTRAINT `cards_FK` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`);

--
-- Filtros para la tabla `directions`
--
ALTER TABLE `directions`
  ADD CONSTRAINT `directions_FK` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`);

--
-- Filtros para la tabla `productImage`
--
ALTER TABLE `productImage`
  ADD CONSTRAINT `productImage_FK` FOREIGN KEY (`idProduct`) REFERENCES `products` (`idProduct`);

--
-- Filtros para la tabla `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_FK` FOREIGN KEY (`idCategory`) REFERENCES `categories` (`idCategory`),
  ADD CONSTRAINT `products_FK_1` FOREIGN KEY (`idBrand`) REFERENCES `brands` (`idBrand`),
  ADD CONSTRAINT `products_FK_2` FOREIGN KEY (`idProvider`) REFERENCES `users` (`idUser`);

--
-- Filtros para la tabla `productStickers`
--
ALTER TABLE `productStickers`
  ADD CONSTRAINT `productSticker_FK` FOREIGN KEY (`IdProduct`) REFERENCES `products` (`idProduct`);

--
-- Filtros para la tabla `quantitys`
--
ALTER TABLE `quantitys`
  ADD CONSTRAINT `quantitys_FK` FOREIGN KEY (`idProduct`) REFERENCES `products` (`idProduct`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
