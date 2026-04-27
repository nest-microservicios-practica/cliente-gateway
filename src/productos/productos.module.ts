import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductosController],
  providers: [],
  // lo siguiente comentado lo movimos a un modulo independiente para que se vea mas limpio
  // imports: [
  //   ClientsModule.register([
  //     {
  //       name: NATS_SERVICE,
  //       transport: Transport.NATS,
  //       options: { servers: envs.natsServers }
  //     },
  //   ]),
  // ],

  imports: [
    NatsModule
  ]
})
export class ProductosModule {}
