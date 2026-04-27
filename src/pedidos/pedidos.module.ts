import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [PedidosController],
  providers: [],
  imports: [
      NatsModule
    ],
})
export class PedidosModule {}
