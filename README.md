# Easy-Motion

Easy Motion es una plataforma fitness con diferente material para ayudar al usuario a conseguir sus objetivos!

## Objetivo

Brindar al usuario las herramientas necesarias para conseguir sus objetivos fitness de una manera organizada, fácil y rápido, todo en un mismo lugar.

## Características

* Blogs con diferentes temáticas fitness que brinden información relevante al usuario.
* Calendarios con actividades diarias para diferentes tipos de propósitos.
* El usuario podrá asignarse los calendarios que sean relevantes para él.
* Se podrá actualizar el peso del usuario para ver sus avances.
* Los ejercicios estarán organizados con el fin de que el usuario logre desarrollar la habilidad de manera responsable.
* Logeo a través de tokens
* Envió de correos (Confirmar usuario, Restaurar contraseña)

## Roles

* Admin - Administrar { Blogs, Calendarios, Ejercicios , Usuarios y Rutinas }
* Autor - Administrar { Blogs } 
* Usuario - Administrar { Su propio perfil usuario }

## Requerimientos

### Instalar Git

  Siga los pasos para instalar git de acuerdo a sus sistema operativo.
  https://git-scm.com/book/es/v1/Empezando-Instalando-Git
  
### Instalar NodeJs
  
  Siga los pasos para instalar NodeJs de acuerdo a sus sistema operativo.
  https://nodejs.org/es/download/
  
### Clonar Repo
  
   Situece en la carpeta de preferencia, habra la terminal y ejecute:
   git clone https://github.com/yaeljasso7/EasyMotion-API.git
 
### Importar base de datos en su gestor favorito
  
  https://drive.google.com/file/d/109uomqne51BVIOL7ZgvYVeo5WW3RmGU4/view
  
### Instalar dependencias
  
  Para instalar las dependencias ejecute:
  Npm install

### Use el archivo .sample-env la cual maneja las variables de entorno necesarias para que la aplicación corra exitosamente
  
  En la carpeta de la repo crear un nuevo archivo .env y escribir lo siguiente
  

| KEY            | VALUE                                |
|----------------|--------------------------------------|
| DB_HOST        | 'host de su maquina'                 |
| DB_USER        | 'usuario'                            |
| DB_PASS        | 'contraseña'                         |
| PORT           | 'Puerto - Default 3000'              |
| PAGE_SIZE      | 'número de elementos por página'     |
| DEFAULT_PAGE   | 'página por defecto'                 |
| SECRET         | 'frase cualquiera'                   |
| SALT           | 'numero de saltos para encriptar'    |
| SESSION_LIVES  | 2.16e7 # 12hrs                       |
| CONFIRM_LIVES  | 3.6e6  # 1hr                         |
| RESET_LIVES    | 1.8e6  # 30min                       |
| MAILER         | 'Servidor de correo'                 |
| ID_CLIENTE     | 'Id Mail'                            |
| SECRET_CLIENTE | 'Secret Mail'                        |
| REFRESH_TOKEN  | 'Refresh Token'                      |

### Ejecutar
  
  Npm start
  

## Rutas

### User

| Path                      | Verbo  | Descripción                                           |
|---------------------------|:------:|-------------------------------------------------------|
| /users                    | GET    | Muestra a todos los usuarios                          |
| /users/{userId}           | GET    | Muestra un usuario                                    |
| /users/{userId}/calendars | GET    | Muestra calendarios asignados al usuario              |
| /users/{userId}/progress  | GET    | Muestra el progreso del usuario a lo largo del tiempo |
| /users/{userId}/calendars | POST   | Asigna un calendario al usuario                       |
| /users/{userId}/progress  | POST   | Registra un progreso al usuario                       |
| /users/{userId}           | PUT    | Actualiza a un usuario                                |
| /users/{userId}           | DELETE | Elimina a un usuario                                  |
| /users/{userId}/calendars | DELETE | Elimina la asignación de un calendario al usuario     |

### Auth

| Path                    | Verbo | Descripción                                   |
|-------------------------|:-----:|-----------------------------------------------|
| /auth/logout            | GET   | Desactiva el token de sesión                  |
| /auth/confirm           | GET   | Confirmación de correo                        |
| /auth/login             | POST  | Login para user                               |
| /auth/forgot            | POST  | Manda un correo de recuperación de contraseña |
| /auth/register          | POST  | Registra a un usuario                         |
| /auth/reset?key={token} | PATCH | Resetear la contraseña del usuario            |

### BodyParts
| Path | Verbo | Descripción |
|---|:---:|---|
| /bodyparts | GET | Muestra todas las partes del cuerpo |
| /bodyparts/{id} | GET | Muestra una parte del cuerpo |
| /bodyparts/{id} | POST | Crea una parte del cuerpo |
| /bodyparts/{id} | PUT | Modifica una parte del cuerpo |
| /bodyparts/{id} | DELETE | Elimina una parte del cuerpo |

### TrainingTypes
| Path | Verbo | Descripción |
|---|:---:|---|
| /trainingtypes | GET | Muestra todos los tipos de entrenamiento |
| /trainingtypes/{id} | GET | Muestra un tipo de entrenamiento |
| /trainingtypes/{id} | POST | Crea un tipo de entrenamiento |
| /trainingtypes/{id} | PUT | Modifica un tipo de entrenamiento |
| /trainingtypes/{id} | DELETE | Elimina un tipo de entrenamiento |

### Exercises
| Path | Verbo | Descripción |
|---|:---:|---|
| /exercises | GET | Muestra todos los ejercicios |
| /exercises/{id} | GET | Muestra un ejercicio |
| /exercises/{id} | POST | Crea un ejercicio |
| /exercises/{id} | PUT | Modifica un ejercicio |
| /exercises/{id} | DELETE | Elimina un ejercicio |

### Routines
| Path | Verbo | Descripción |
|---|:---:|---|
| /routines | GET | Muestra todas las rutinas |
| /routines/{id} | GET | Muestra una rutina |
| /routines/{id} | POST | Crea una rutina |
| /routines/{id} | PUT | Modifica una rutina |
| /routines/{id} | DELETE | Elimina una rutina |
| /routines/{id}/exercise | POST | Añade un ejercicio a una rutina |
| /routines/{id}/exercise | PATCH | Modifica las repeticiones de un ejercicio en una rutina |
| /routines/{id}/exercise | DELETE | Quita un ejercicio de una rutina |

### Calendars
| Path | Verbo | Descripción |
|---|:---:|---|
| /calendars | GET | Muestra todos los calendarios |
| /calendars/{id} | GET | Muestra un calendario |
| /calendars/{id} | POST | Crea un calendario |
| /calendars/{id} | PUT | Modifica un calendario |
| /calendars/{id} | DELETE | Elimina un calendario |
| /calendars/{id}/routine | POST | Añade una rutina a un calendario |
| /calendars/{id}/routine | DELETE | Quita una rutina de un calendario |

### Blog
| Path | Verbo | Descripción |
|---|:---:|---|
| /blog | GET | Muestra todos los blogs |
| /blog/{id} | GET | Muestra un blog |
| /blog/{id} | POST | Crea un blog |
| /blog/{id} | PUT | Modifica un blog |
| /blog/{id} | DELETE | Elimina un blog |

### BlogCategory
| Path | Verbo | Descripción |
|---|:---:|---|
| /categoryBlog | GET | Muestra todas las categorías de blogs |
| /categoryBlog/{id} | GET | Muestra una categoría de blog |
| /categoryBlog/{id} | POST | Crea una categoría de blog |
| /categoryBlog/{id} | PUT | Modifica una categoría de blog |
| /categoryBlog/{id} | DELETE | Elimina una categoría de blog |


## Postman

  https://www.getpostman.com/collections/4cb0c0035ac1f5dd13bc

## Url [Heroku + Mysql]
  
  https://easy-motion.herokuapp.com

## Web View

 https://ichris96.github.io/Easy-Motion-Web/index.html
  
## Colaboradores

* Larios Peréz Christopher Alejandro
* Ricardo Esteban Peralta Martínez
* Aldair Yael Jasso Aburto
* Braulio Jiménez Milanés

