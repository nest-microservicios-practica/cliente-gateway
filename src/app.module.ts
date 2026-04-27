import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [
    ProductosModule,
    NatsModule, 
    PedidosModule
  ],
  controllers: [ ],
  providers: [ ],
})
export class AppModule {}
