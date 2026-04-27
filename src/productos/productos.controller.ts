import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto';
import { NATS_SERVICE } from 'src/config';
import { CreateProductoDto, UpdateProductoDto } from './dto';

//! MUY IMPORTANTE, lo que acompaña al CMD, DEBE SI O SI ESTAR EN EL MICROSERVICIO CON EL QUE NOS VAMOS A CONECTAR, EJEMPLO
/*
  EN EL microservicio de producto, para crear tenemos:
  @MessagePattern({ cmd: 'crear_producto' })
  create(@Payload() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  asi que en este controlador debemos de colocar la misma firma que tenemos en ese microservicio, es decir:
  { cmd: 'crear_producto' }

*/

@Controller('productos')
export class ProductosController {

  constructor(
    // @Inject(PRODUCTO_MICROSERVICE) private readonly cliente: ClientProxy
    //! No colocamos el nombre del microservicio como tal, si no nats que es quien controla todo, tiene la comunicacion entre microservicios
    @Inject(NATS_SERVICE) private readonly cliente: ClientProxy
  ) {}

  @Post()
  crearProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.cliente.send({ cmd: 'crear_producto' }, createProductoDto).pipe(
        catchError((error) => { throw new RpcException(error);})
      );
  }

  @Get()
  async obtenerProductos(@Query() paginationDto: PaginationDto) {
    // .send envia una peticion y espera la respuesta
    // .emit envia la peticion y sigue con sus tareas no espera a que el microservicio le responda algo, me gusta para cuando tengo que enviar un correo y no quiero esperar a que haga el envio

    return this.cliente.send({ cmd: 'obtener_productos' }, {  ...paginationDto}).pipe(
        catchError((error) => { throw new RpcException(error);})
      );
  }

  @Get(':id')
  async obtenerProductoPorId(@Param('id',ParseIntPipe) id: string) {
    // try {
    //   const producto = await firstValueFrom(
    //     this.cliente.send({ cmd: 'obtener_producto_por_id' }, { id })
    //   );
    //   return producto;
    // } catch (error) {
    //   throw new RpcException(error);
    // }

    return this.cliente.send({ cmd: 'obtener_producto_por_id' }, { id })
      .pipe(
        catchError((error) => { throw new RpcException(error);})
      )
  }

  @Delete(':id')
  eliminarProducto(@Param('id', ParseIntPipe) id: string) {
    return this.cliente.send({ cmd: 'eliminar_producto' }, { id }).pipe(
        catchError((error) => { throw new RpcException(error);})
      );
  }


  @Patch(':id')
  actualizarProducto(@Param('id', ParseIntPipe) id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.cliente.send({ cmd: 'actualizar_producto' }, { id, ...updateProductoDto }).pipe(
        catchError((error) => { throw new RpcException(error);})
      );
  }
}
