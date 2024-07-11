# API de Agenda de Salas de Cine

## Introducción

¡Bienvenido a la API de Agenda de Salas de Cine de Wispok! Este proyecto tiene como objetivo crear un sistema sencillo de reserva para un cine con tres auditorios disponibles. La API permite a los usuarios reservar boletos, verificar la disponibilidad de asientos y gestionar las reservas a través de un sistema de autenticación seguro.

El proyecto se encuentre desplegado en [https://wispoktest.onrender.com/api-docs/](https://wispoktest.onrender.com/api-docs/)

Las instrucciones para su uso se encuentran mas abajo en este documento. 

## Requerimientos de la Asignación

Los siguientes son los requerimientos y casos de uso para este proyecto:

### Consideraciones:

- Se asume que todas las salas están pasando la misma película.
- Se deberá agendar el boleto y simular un proceso de compra.
- El cine tiene 3 salas disponibles: Sala A, Sala B y Sala C.
- Las salas tienen los siguientes horarios: 3:00 PM, 5:00 PM y 7:00 PM.
- Las salas A y B tienen un aforo de 20 personas. La Sala C tiene un aforo de 30 personas.
- El cine funciona todos los días, por lo que el único limitante para una agenda es la disponibilidad de asientos para la sala seleccionada.

### Modelos Recomendados:

- **Booker**: Representa a la persona que adquiere el boleto. Está relacionado con una reserva.
- **Booking**: Representa la agenda para una sala. Está relacionado con una sala, un horario y un asiento.
- **Auditorium**: Representa cada sala en el cine. Tiene una cantidad de horarios disponibles y un número de asientos.
- **Seat**: Representa un asiento numerado dentro de una sala. Está relacionado con un booker y pertenece a una sala.

ERD:


![image](https://github.com/carlos-rsalda/wispokTest/assets/153567205/4364738a-f97a-40be-9d73-4c52caceb5ef)


### Casos de Uso a Implementar:

- Inicializar la aplicación con la información necesaria para su funcionamiento.
- Implementar un módulo de autenticación para la API.
- Crear un endpoint para ver la disponibilidad de salas y horarios.
- Crear un endpoint que permita crear una reserva para la sala en el horario elegido y pedir un correo electrónico para agendar.
- Después de realizar el proceso anterior con éxito, proporcionar un endpoint donde se pueda consultar la confirmación de la reserva: correo electrónico, código de reserva, sala seleccionada, horario seleccionado y el asiento seleccionado.

## Estructura del Proyecto

- **src/config**: Archivos de configuración, incluyendo la configuración de la base de datos.
- **src/controllers**: Archivos de controladores que contienen la lógica de negocio.
- **src/middlewares**: Archivos de middleware para la autenticación.
- **src/models**: Definiciones de modelos de Sequelize.
- **src/routes**: Definiciones de rutas de la API.
- **src**: Otros archivos fuente.
- **.env**: Archivo de variables de entorno para la configuración.

## Instrucciones para Ejecutar el Proyecto Localmente

### Prerrequisitos

- Node.js y npm
- PostgreSQL

### Pasos

1. Clona el repositorio:

```bash
git clone https://github.com/carlos-rsalda/wispokTest.git
cd wispokTest
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno en un archivo `.env`:

```bash
PORT=3000
DB_USER=user
DB_PASSWORD=password
DB_NAME=dbName
DB_HOST=host
DB_PORT=5432
JWT_SECRET=your_jwt_secret
DATABASE_URL=DATABASE_URL
```

4. Inicializa la base de datos:

```bash
node src/initData.js
```

5. Inicia el servidor:

```bash
npm start
```

6. Accede a la documentación de la API en Swagger:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

[https://wispoktest.onrender.com/api-docs/](https://wispoktest.onrender.com/api-docs/)

### Autenticación y Autorización

Ya existe un usuario con el que pueden hacer log in:

  email: "example@example.com",
  password: "password123"

O puedes registrarte. 

1. Primero, realiza el registro de un usuario booker mediante el endpoint `/api/auth/register`.
2. Luego, inicia sesión con el usuario registrado mediante el endpoint `/api/auth/login`.
3. Copia el token JWT proporcionado en la respuesta del login.
   ![image](https://github.com/carlos-rsalda/wispokTest/assets/153567205/4fff01ab-843d-419b-8b61-db66c9c40c7d)

4. Haz clic en "Authorize" en la documentación de Swagger y pega el token JWT para autorizar todas las peticiones.
   ![image](https://github.com/carlos-rsalda/wispokTest/assets/153567205/ab3e170c-c591-4f71-b206-a80c70493ea6)


## Despliegue

El proyecto ha sido desplegado en Render:

[https://wispoktest.onrender.com](https://wispoktest.onrender.com)

## Endpoints Principales

### Autenticación

- **POST /api/auth/register**: Registra un nuevo booker.
- **POST /api/auth/login**: Inicia sesión con un booker registrado.

### Booking

- **GET /api/bookings/availability**: Obtiene la disponibilidad de auditorios.
- **POST /api/bookings/book**: Crea una nueva reserva.
- **GET /api/bookings/confirmation/{id}**: Obtiene la confirmación de una reserva.
- **GET /api/bookings**: Obtiene todas las reservas.
- **PUT /api/bookings/{id}**: Actualiza una reserva existente.
- **DELETE /api/bookings/{id}**: Elimina una reserva existente.

### Seat

- **GET /api/bookings/auditorium{auditoriumId}/seats**: Obtiene todos los asientos de un auditorio.

## Contacto

carlos.rsalda@gmail.com

3329407337
