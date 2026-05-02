import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { NatsModule } from './transports/nats.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ProductosModule,
    NatsModule, 
    PedidosModule, AuthModule
  ],
  controllers: [ ],
  providers: [ ],
})
export class AppModule {}
