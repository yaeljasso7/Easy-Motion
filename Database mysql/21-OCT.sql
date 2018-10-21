-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 22-10-2018 a las 00:53:54
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
-- Estructura de tabla para la tabla `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `autor` varchar(45) DEFAULT NULL,
  `data` varchar(850) NOT NULL,
  `category` int(11) DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `blogs`
--

INSERT INTO `blogs` (`id`, `date`, `autor`, `data`, `category`, `isDeleted`) VALUES
(1, '2018-10-12 21:48:45', 'Francisco', 'En Mty...', 7, 0),
(2, '2018-10-08 22:03:29', 'yo', 'En new york....', 1, 0),
(5, '2018-10-09 08:36:11', 'yo', 'En new york....', 1, 0),
(6, '2018-10-12 21:15:27', 'Paquito', 'En Francia ....', 5, 0),
(8, '2008-05-30 05:00:00', 'PostTest', 'En PostTest  ....', NULL, 0),
(9, '2008-05-30 05:00:00', 'PostTest2', 'En PostTest  ....2', NULL, 0),
(10, '2008-05-30 00:00:00', 'HerokuAutor', 'En PostTest  ....2', NULL, 0),
(11, '2018-10-16 04:44:27', 'javier', 'jejejeje', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blogs_categories`
--

CREATE TABLE `blogs_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `blogs_categories`
--

INSERT INTO `blogs_categories` (`id`, `name`, `isDeleted`) VALUES
(1, 'Nutricion', 0),
(5, 'Hogar', 0),
(6, 'Tecnologia', 0),
(7, 'Departamento', 0),
(8, 'Mexico', 0),
(9, 'Belleza', 0),
(10, 'Hiit', 0);

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
-- Estructura de tabla para la tabla `calendars`
--

CREATE TABLE `calendars` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `calendars`
--

INSERT INTO `calendars` (`id`, `name`, `isDeleted`) VALUES
(1, 'principiantes', 0),
(3, 'expertos', 0),
(4, 'genios', 0),
(5, 'Atletas', 0),
(6, 'Express', 0),
(8, 'Quimico extremo', 0),
(9, 'Quimico extremo', 0),
(10, 'Calendario 101', 0);

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
(4, 'saltar', 'saltando', 8, 8, 1, 0),
(8, 'lagartijas', '', 9, 1, 3, 0),
(9, 'nuevo', 'nueve', 55, 9, 9, 1),
(10, 'modificado10', 'diez....', 9, 9, 9, 0),
(12, 'nuevoEjercisio', 'Para valientes..', 7, 3, 1, 0),
(13, 'Ejercicio de prueba', '', 6, 1, 1, 1),
(15, 'Ejercicio de prueba', '', 6, 8, 8, 0),
(16, 'Ejercicio 16', '', 6, 1, 1, 0),
(17, 'Ejercicio 17', '', 6, 9, 1, 0),
(18, 'Ejercicio 18', '', 6, 9, 1, 0),
(19, 'nuevo', '', 55, 7, 2, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `exercises_routines`
--

CREATE TABLE `exercises_routines` (
  `id` int(11) NOT NULL,
  `routineId` int(11) NOT NULL,
  `exerciseId` int(11) NOT NULL,
  `repetitions` int(11) NOT NULL DEFAULT '5'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `exercises_routines`
--

INSERT INTO `exercises_routines` (`id`, `routineId`, `exerciseId`, `repetitions`) VALUES
(1, 1, 1, 5),
(7, 1, 2, 5),
(2, 3, 1, 5),
(11, 4, 1, 5),
(12, 4, 2, 5),
(3, 5, 2, 5),
(5, 5, 4, 5),
(9, 7, 4, 5),
(13, 12, 1, 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(45) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `permissions`
--

INSERT INTO `permissions` (`id`, `name`) VALUES
(5, 'createBodyPart'),
(17, 'createCalendar'),
(11, 'createExercise'),
(14, 'createRoutine'),
(8, 'createTrainingType'),
(7, 'deleteBodyPart'),
(19, 'deleteCalendar'),
(13, 'deleteExercise'),
(16, 'deleteRoutine'),
(10, 'deleteTrainingType'),
(4, 'deleteUser'),
(6, 'editBodyPart'),
(18, 'editCalendar'),
(12, 'editExercise'),
(15, 'editRoutine'),
(9, 'editTrainingType'),
(3, 'editUser'),
(20, 'followCalendar'),
(2, 'listUsers'),
(21, 'unfollowCalendar'),
(1, 'viewUser');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(45) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'User');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles_permissions`
--

CREATE TABLE `roles_permissions` (
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `roles_permissions`
--

INSERT INTO `roles_permissions` (`roleId`, `permissionId`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(2, 1),
(2, 3),
(2, 20),
(2, 21);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `routines`
--

CREATE TABLE `routines` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(256) NOT NULL DEFAULT '',
  `executionTime` int(11) NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `routines`
--

INSERT INTO `routines` (`id`, `name`, `description`, `executionTime`, `isDeleted`) VALUES
(1, 'Mi rutina 101', '', 0, 0),
(3, 'Modificado', '', 0, 0),
(4, 'Gana musculo', '', 0, 0),
(5, 'Super fuerte', '', 0, 0),
(7, 'Mañanero', '', 0, 0),
(8, 'Testing1', '', 0, 0),
(9, 'Adelgaza en 3 pasos', '', 0, 0),
(11, 'Diez', '', 0, 0),
(12, 'Rutina 101', '', 10, 0);

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
(15, 8, 1, 2),
(16, 10, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `token` varchar(256) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` char(1) NOT NULL,
  `createdAt` date NOT NULL,
  `expires` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tokens`
--

INSERT INTO `tokens` (`id`, `token`, `userId`, `type`, `createdAt`, `expires`, `active`) VALUES
(1, 'adsasdsa', 8, 'k', '2018-01-01', 15, 0),
(2, '$2b$10$rSpVmtYcO0TiVpDKZOR.B.5DwQzSB/svZBllf0MIkoLTXho6TewFi', 19, '1', '2018-10-21', 12, 0);

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
  `mail` varchar(90) NOT NULL,
  `role` int(11) NOT NULL DEFAULT '2',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `mobile`, `weight`, `height`, `password`, `mail`, `role`, `isDeleted`) VALUES
(8, '8', '3310', 399, 249, '1234', 'testing@mail.com', 2, 0),
(9, '9', '3310', 399, 249, '1234', '9@correo.com', 2, 0),
(10, '10', '3310', 399, 249, '1234', '10@correo.com', 2, 0),
(12, '12', '9999999999', 399, 249, '1234', '12@correo.com', 2, 0),
(13, '13', '9999999999', 399, 249, '1234', '13@correo.com', 2, 0),
(14, '13', '3310', 399, 249, '1234', '13@correo.com', 2, 0),
(15, 'juaquin', '3310436545', 399, 249, '1234', '13@correo.com', 2, 0),
(16, 'juaquin', '1234567890', 399, 249, '1234567890', '13@corre.com', 2, 0),
(17, 'Samuel', '3310458565', 399, 249, '1234', 'J01@correo.com', 2, 0),
(18, 'Soy18', '3310458565', 188, 188, '1234', 'J01@correo.com', 2, 0),
(19, 'user007', '3377337733', 77, 177, 'hola1234', 'user007@email.com', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users_calendars`
--

CREATE TABLE `users_calendars` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `calendarId` int(11) NOT NULL,
  `isDone` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users_calendars`
--

INSERT INTO `users_calendars` (`id`, `userId`, `calendarId`, `isDone`) VALUES
(3, 8, 1, 0),
(7, 14, 5, 0),
(6, 14, 6, 0),
(8, 15, 8, 0),
(11, 19, 3, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users_progress`
--

CREATE TABLE `users_progress` (
  `userId` int(11) NOT NULL,
  `weight` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users_progress`
--

INSERT INTO `users_progress` (`userId`, `weight`, `height`, `date`) VALUES
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
(18, 119, 119, '2018-10-17 01:21:47'),
(19, 77, 177, '2018-10-19 20:32:59'),
(19, 93, 178, '2018-10-19 20:39:53');

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
-- Indices de la tabla `blogs`
--
ALTER TABLE `blogs`
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
-- Indices de la tabla `calendars`
--
ALTER TABLE `calendars`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_bodypart` (`bodyPart`),
  ADD KEY `fk_trainingtype` (`trainingType`);

--
-- Indices de la tabla `exercises_routines`
--
ALTER TABLE `exercises_routines`
  ADD PRIMARY KEY (`routineId`,`exerciseId`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD KEY `fk_exer` (`exerciseId`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `roles_permissions`
--
ALTER TABLE `roles_permissions`
  ADD PRIMARY KEY (`roleId`,`permissionId`),
  ADD KEY `fk_permission` (`permissionId`);

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
-- Indices de la tabla `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_token_userId` (`userId`);

--
-- Indices de la tabla `training_types`
--
ALTER TABLE `training_types`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_role` (`role`);

--
-- Indices de la tabla `users_calendars`
--
ALTER TABLE `users_calendars`
  ADD PRIMARY KEY (`userId`,`calendarId`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD KEY `fk_userRoutine_routine` (`calendarId`) USING BTREE,
  ADD KEY `fk_userRoutine_user` (`userId`) USING BTREE;

--
-- Indices de la tabla `users_progress`
--
ALTER TABLE `users_progress`
  ADD PRIMARY KEY (`userId`,`date`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `blogs`
--
ALTER TABLE `blogs`
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
-- AUTO_INCREMENT de la tabla `calendars`
--
ALTER TABLE `calendars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `exercises`
--
ALTER TABLE `exercises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `exercises_routines`
--
ALTER TABLE `exercises_routines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `routines`
--
ALTER TABLE `routines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `routines_calendars`
--
ALTER TABLE `routines_calendars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `training_types`
--
ALTER TABLE `training_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `users_calendars`
--
ALTER TABLE `users_calendars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `fk_blog_1` FOREIGN KEY (`category`) REFERENCES `blogs_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `exercises`
--
ALTER TABLE `exercises`
  ADD CONSTRAINT `fk_bodypart` FOREIGN KEY (`bodyPart`) REFERENCES `body_parts` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_trainingtype` FOREIGN KEY (`trainingType`) REFERENCES `training_types` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `exercises_routines`
--
ALTER TABLE `exercises_routines`
  ADD CONSTRAINT `fk_exercise_exOnRoutine` FOREIGN KEY (`exerciseId`) REFERENCES `exercises` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_routine_exOnRoutine` FOREIGN KEY (`routineId`) REFERENCES `routines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `roles_permissions`
--
ALTER TABLE `roles_permissions`
  ADD CONSTRAINT `fk_permission` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_role` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `routines_calendars`
--
ALTER TABLE `routines_calendars`
  ADD CONSTRAINT `fk_calendarDayRoutine_calendar` FOREIGN KEY (`calendarId`) REFERENCES `calendars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calendarDayRoutine_routine` FOREIGN KEY (`routineId`) REFERENCES `routines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `fk_token_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `users_calendars`
--
ALTER TABLE `users_calendars`
  ADD CONSTRAINT `fk_userCalendar_idCalendar` FOREIGN KEY (`calendarId`) REFERENCES `calendars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_userCalendar_idUser` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `users_progress`
--
ALTER TABLE `users_progress`
  ADD CONSTRAINT `fk_idUser_progressUser` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
