-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 19-10-2018 a las 19:21:40
-- Versión del servidor: 10.1.26-MariaDB
-- Versión de PHP: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `easy-test`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blog`
--

CREATE TABLE `blog` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `autor` varchar(45) DEFAULT NULL,
  `data` varchar(850) NOT NULL,
  `category` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `blog`
--

INSERT INTO `blog` (`id`, `date`, `autor`, `data`, `category`) VALUES
(1, '2018-10-12 21:48:45', 'Francisco', 'En Mty...', 7),
(2, '2018-10-08 22:03:29', 'yo', 'En new york....', 1),
(5, '2018-10-09 08:36:11', 'yo', 'En new york....', 1),
(6, '2018-10-12 21:15:27', 'Paquito', 'En Francia ....', 5),
(8, '2008-05-30 05:00:00', 'PostTest', 'En PostTest  ....', NULL),
(9, '2008-05-30 05:00:00', 'PostTest2', 'En PostTest  ....2', NULL),
(10, '2008-05-30 00:00:00', 'HerokuAutor', 'En PostTest  ....2', NULL),
(11, '2018-10-16 04:44:27', 'javier', 'jejejeje', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blogs_categories`
--

CREATE TABLE `blogs_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `blogs_categories`
--

INSERT INTO `blogs_categories` (`id`, `name`) VALUES
(1, 'Nutricion'),
(5, 'Hogar'),
(6, 'Tecnologia'),
(7, 'Departamento'),
(8, 'Mexico'),
(9, 'Belleza'),
(10, 'Hiit');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `body_parts`
--

CREATE TABLE `body_parts` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `body_parts`
--

INSERT INTO `body_parts` (`id`, `name`, `isDeleted`) VALUES
(1, 'brazo', 0),
(2, 'pierna', 0),
(3, 'bicepts', 0),
(4, 'talon', 0),
(5, 'cuello', 0),
(6, 'Editado desde postman', 0),
(8, 'hombro', 0),
(9, 'tobillo', 0),
(10, 'Parte superior', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendar`
--

CREATE TABLE `calendar` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `calendar`
--

INSERT INTO `calendar` (`id`, `name`) VALUES
(1, 'principiantes'),
(3, 'expertos'),
(4, 'genios'),
(5, 'Atletas'),
(6, 'Express'),
(8, 'Quimico extremo'),
(9, 'Quimico extremo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `exercises`
--

CREATE TABLE `exercises` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(90) NOT NULL DEFAULT '',
  `difficulty` int(11) NOT NULL,
  `trainingType` int(11) NOT NULL,
  `bodyPart` int(11) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `exercises`
--

INSERT INTO `exercises` (`id`, `name`, `description`, `difficulty`, `trainingType`, `bodyPart`, `isDeleted`) VALUES
(1, 'remo', 'remado', 1, 3, 1, 0),
(2, 'caminadora', '', 1, 7, 5, 0),
(3, 'pesas', '', 2, 6, 2, 0),
(4, 'saltar', 'saltando', 8, 8, 1, 0),
(5, 'sentadillas', '', 8, 5, 7, 0),
(8, 'lagartijas', '', 9, 1, 3, 0),
(9, 'modificado9', 'nueve', 9, 9, 9, 0),
(10, 'modificado10', 'diez....', 9, 9, 9, 0),
(11, 'Test', 'test', 8, 5, 10, 0),
(12, 'nuevoEjercisio', 'Para valientes..', 7, 3, 1, 0),
(13, 'Ejercicio de prueba', '', 6, 1, 1, 1),
(14, 'testing', '5', 2, 6, 2, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `exercises_routines`
--

CREATE TABLE `exercises_routines` (
  `id` int(11) NOT NULL,
  `routineId` int(11) NOT NULL,
  `exerciseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `exercises_routines`
--

INSERT INTO `exercises_routines` (`id`, `routineId`, `exerciseId`) VALUES
(1, 1, 1),
(2, 3, 1),
(3, 5, 2),
(5, 5, 4),
(7, 1, 2),
(9, 7, 4),
(11, 4, 1),
(12, 4, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `routines`
--

CREATE TABLE `routines` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `routines`
--

INSERT INTO `routines` (`id`, `name`, `isDeleted`) VALUES
(1, 'Dificil', 0),
(3, 'Modificado', 0),
(4, 'Gana musculo', 0),
(5, 'Super fuerte', 0),
(7, 'Mañanero', 0),
(8, 'Testing1', 0),
(9, 'Adelgaza en 3 pasos', 0),
(11, 'Diez', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `routines_calendars`
--

CREATE TABLE `routines_calendars` (
  `id` int(11) NOT NULL,
  `calendarId` int(11) NOT NULL,
  `routineId` int(11) NOT NULL,
  `day` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `routines_calendars`
--

INSERT INTO `routines_calendars` (`id`, `calendarId`, `routineId`, `day`) VALUES
(3, 1, 1, 1),
(6, 3, 3, 1),
(7, 1, 4, 2),
(10, 5, 5, 2),
(11, 5, 3, 2),
(12, 5, 3, 8),
(13, 5, 4, 3),
(14, 8, 1, 1),
(15, 8, 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `training_types`
--

CREATE TABLE `training_types` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(45) NOT NULL DEFAULT '',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `training_types`
--

INSERT INTO `training_types` (`id`, `name`, `description`, `isDeleted`) VALUES
(1, 'box', 'En el box..', 0),
(2, 'karate', 'JackieChang', 0),
(3, 'cardio', 'Baja de peso', 0),
(5, 'Editado o o ', 'Super editado', 0),
(7, 'Hiit', '', 0),
(8, 'Spring', 'Fast.', 0),
(9, 'Flexibilidad', '', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `mobile` varchar(12) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `password` varchar(256) NOT NULL,
  `mail` varchar(90) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `mobile`, `weight`, `height`, `password`, `mail`) VALUES
(8, '8', '3310', 399, 249, '1234', 'testing@mail.com'),
(9, '9', '3310', 399, 249, '1234', '9@correo.com'),
(10, '10', '3310', 399, 249, '1234', '10@correo.com'),
(12, '12', '9999999999', 399, 249, '1234', '12@correo.com'),
(13, '13', '9999999999', 399, 249, '1234', '13@correo.com'),
(14, '13', '3310', 399, 249, '1234', '13@correo.com'),
(15, 'juaquin', '3310436545', 399, 249, '1234', '13@correo.com'),
(16, 'juaquin', '1234567890', 399, 249, '1234567890', '13@corre.com'),
(17, 'Samuel', '3310458565', 399, 249, '1234', 'J01@correo.com'),
(18, 'Soy18', '3310458565', 188, 188, '1234', 'J01@correo.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_calendars`
--

CREATE TABLE `user_calendars` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `calendarId` int(11) NOT NULL,
  `isDone` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user_calendars`
--

INSERT INTO `user_calendars` (`id`, `userId`, `calendarId`, `isDone`) VALUES
(3, 8, 1, 0),
(7, 14, 5, 0),
(6, 14, 6, 0),
(8, 15, 8, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_progress`
--

CREATE TABLE `user_progress` (
  `userId` int(11) NOT NULL,
  `weight` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user_progress`
--

INSERT INTO `user_progress` (`userId`, `weight`, `height`, `date`) VALUES
(8, 180, 180, '2018-10-12 23:19:14'),
(8, 170, 180, '2018-10-13 00:07:36'),
(8, 165, 165, '2018-10-13 00:36:39'),
(8, 165, 165, '2018-10-13 00:37:39'),
(8, 164, 165, '2018-10-13 00:38:00'),
(8, 112, 165, '2018-10-13 01:08:40'),
(9, 180, 180, '2018-10-12 23:19:14'),
(18, 188, 188, '2018-10-13 01:14:04'),
(18, 119, 119, '2018-10-13 01:14:55'),
(18, 119, 119, '2018-10-16 23:43:17'),
(18, 119, 119, '2018-10-16 23:50:19'),
(18, 119, 119, '2018-10-17 01:21:47');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_exercises`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_exercises` (
`id` int(11)
,`name` varchar(45)
,`description` varchar(90)
,`difficulty` int(11)
,`bodyPartID` int(11)
,`bodyPart` varchar(45)
,`trainingTypeID` int(11)
,`trainingType` varchar(45)
,`isDeleted` tinyint(1)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `v_exercises`
--
DROP TABLE IF EXISTS `v_exercises`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_exercises`  AS  select `exercises`.`id` AS `id`,`exercises`.`name` AS `name`,`exercises`.`description` AS `description`,`exercises`.`difficulty` AS `difficulty`,`body_parts`.`id` AS `bodyPartID`,`body_parts`.`name` AS `bodyPart`,`training_types`.`id` AS `trainingTypeID`,`training_types`.`name` AS `trainingType`,`exercises`.`isDeleted` AS `isDeleted` from ((`exercises` join `body_parts` on((`exercises`.`bodyPart` = `body_parts`.`id`))) join `training_types` on((`exercises`.`trainingType` = `training_types`.`id`))) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_blog_1_idx` (`category`);

--
-- Indices de la tabla `blogs_categories`
--
ALTER TABLE `blogs_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `body_parts`
--
ALTER TABLE `body_parts`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `calendar`
--
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `exercises_routines`
--
ALTER TABLE `exercises_routines`
  ADD PRIMARY KEY (`routineId`,`exerciseId`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD KEY `fk_exer` (`exerciseId`);

--
-- Indices de la tabla `routines`
--
ALTER TABLE `routines`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `routines_calendars`
--
ALTER TABLE `routines_calendars`
  ADD PRIMARY KEY (`calendarId`,`routineId`,`day`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD KEY `fk_routine_idx` (`routineId`);

--
-- Indices de la tabla `training_types`
--
ALTER TABLE `training_types`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user_calendars`
--
ALTER TABLE `user_calendars`
  ADD PRIMARY KEY (`userId`,`calendarId`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD KEY `fk_userRoutine_routine` (`calendarId`) USING BTREE,
  ADD KEY `fk_userRoutine_user` (`userId`) USING BTREE;

--
-- Indices de la tabla `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`userId`,`date`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `blog`
--
ALTER TABLE `blog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `blogs_categories`
--
ALTER TABLE `blogs_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `body_parts`
--
ALTER TABLE `body_parts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `calendar`
--
ALTER TABLE `calendar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `exercises`
--
ALTER TABLE `exercises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `exercises_routines`
--
ALTER TABLE `exercises_routines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `routines`
--
ALTER TABLE `routines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `routines_calendars`
--
ALTER TABLE `routines_calendars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `training_types`
--
ALTER TABLE `training_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `user_calendars`
--
ALTER TABLE `user_calendars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `blog`
--
ALTER TABLE `blog`
  ADD CONSTRAINT `fk_blog_1` FOREIGN KEY (`category`) REFERENCES `blogs_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `exercises_routines`
--
ALTER TABLE `exercises_routines`
  ADD CONSTRAINT `fk_exercise_exOnRoutine` FOREIGN KEY (`exerciseId`) REFERENCES `exercises` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_routine_exOnRoutine` FOREIGN KEY (`routineId`) REFERENCES `routines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `routines_calendars`
--
ALTER TABLE `routines_calendars`
  ADD CONSTRAINT `fk_calendarDayRoutine_calendar` FOREIGN KEY (`calendarId`) REFERENCES `calendar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calendarDayRoutine_routine` FOREIGN KEY (`routineId`) REFERENCES `routines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_calendars`
--
ALTER TABLE `user_calendars`
  ADD CONSTRAINT `fk_userCalendar_idCalendar` FOREIGN KEY (`calendarId`) REFERENCES `calendar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_userCalendar_idUser` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `fk_idUser_progressUser` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
