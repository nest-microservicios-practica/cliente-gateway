# NOTA AYUDA

SI HAGO UN CAMBIO EN EL CODIGO Y QUIERO QUE SE ACTUALICE AUTOMATICAMENTE EN DOCKER, PARA ELLO DEBEMOS MODIFICAR EL ARCHIVO `tsconfig.json`

## para levantar el proyecto completo

1. Clonar el repositorio https://github.com/nest-microservicios-practica/productos-microservicio.git
2. Instalar dependencias
3. Crear un archivo `.env` basado en el `env.template`
4. Levantar el servidor NATS
        ```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
        ```
5. Ejecutar migración de prisma `npx prisma migrate dev`
6. Ejecutar `npm run start:dev`
7. no esta mal, luego de levantar el proyecto, ejecutar `npx prisma generate` para generar o actualizar el cliente de prisma

## documentacions necesaria para nats

debemos instalar nats, en todos los microservicios 'npm i --save nats'
documentacion <https://docs.nestjs.com/microservices/nats>

en el archivo main.ts o el module que estemos manejando de cada microservicio debemos tener algo como:
    ```tsx
      transport: Transport.NATS,
      options: {
        servers: ['nats://localhost:4222'],
      },
    ```

1. documentacion oficial
   1. <https://hub.docker.com/_/nats>
   2. <https://nats.io/>

2. BASICO 'no hacer para este proyecto':Para levantar nasts independiente a un composer de docker, debemos ejecutar el comando: docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
