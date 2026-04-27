import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';


import { CambiarEstatusPedidoDto, CreatePedidoDto, PaginationPedidoDto, StatusPedidoDto } from './dto';
import { PaginationDto } from 'src/common/dto';


/**
 * por si se me olvida:
 * .send es para llamar al metodo del microservicio, este debe tener en el metodo del controlador algo como MessagePattern({cmd: 'abc'}) o MessagePattern('abc')
 * .emit es para llamar a un evento del microservicio, este debe tener en el metodo del controlador algo como EventPattern({cmd: 'abc'}) o EventPattern('abc'). y sirve para no esperar a que ese metodo termine, sirve para dejar tareas que se ejecuten en segundo plano
 */
@Controller('pedidos')
export class PedidosController {

  constructor(
    @Inject(NATS_SERVICE) private readonly cliente: ClientProxy
  ) { }

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.cliente.send('createPedido', {...createPedidoDto}).pipe(
      catchError((error) => { throw new RpcException(error); })
    );
  }

  // @Get()
  // findAll(@Query() paginationDto: PaginationPedidoDto) {
  //   return this.cliente.send('findAllPedidos', {...paginationDto}).pipe(
  //     catchError((error) => { throw new RpcException(error); })
  //   );
  // }
  @Get()
  async findAll(@Query() paginationDto: PaginationPedidoDto) {
    try {
      const pedidos = await firstValueFrom(this.cliente.send('findAllPedidos', {...paginationDto}));
      return pedidos;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // para acceder llamados a pedidos/id:/1ed6de90-6cb7-495e-b216-6cc2e0277a8 es para que no choquen las rutas, asi lo hizo el profesor, es solo para este ejemplo
  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    //! cualquiera de las dos formas funciona, solo que lo deje asi para que me sirva de ejemplo en 
    // return this.cliente.send('findOnePedido', id).pipe(
    //   catchError((error) => { throw new RpcException(error); })
    // );
    try {
      const pedido =  await firstValueFrom(this.cliente.send('findOnePedido', id));
      return pedido;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusPedidoDto,
    @Query() paginationDto: PaginationDto
  ) {
    // solo se hizo con try para hacerlo diferente, pero se puede hacer con el .pipe catchError sin problemas, lo importante es que se capture el error y se lance como RpcException
    try {
      const pedidos =  await firstValueFrom(this.cliente.send('findAllPedidos', {
        ...paginationDto,
        status: statusDto.status,
      }));
      return pedidos;
    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Patch(':id/status')
  cambiarStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: CambiarEstatusPedidoDto // nuevo status
  ) {
    return this.cliente.send('cambiarEstatusPedido', { id, ...statusDto }).pipe(
      catchError((error) => { throw new RpcException(error); })
    );
  }
}
