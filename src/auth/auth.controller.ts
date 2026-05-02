import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards';
import { Usuario } from './decorators/usuario.decorator';
import { Token } from './decorators/token.decorator';
import { CurrentUsuario } from './interfaces';

//! IMPORTANTE,
// SI QUEREMOS HACER PROTEGIDA UN ENPOINT O TODO UN CONTROLADOR,
// ENTONCES COLOCO EL GUARDIAN '@UseGuards(AuthGuard)' A NIVEL DE CONTROLADOR, ASI NO TENGO QUE COLOCARLO EN METODO DEL CONTROLADOR,
// PERO SI QUIERO PROTEGER SOLO ALGUNOS METODOS DE UN CONTROLADORES,
// ENTONCES COLOCO EL GUARDIAN '@UseGuards(AuthGuard)' SOLO EN EL METODO DEL CONTROLADOR AL QUE QUIERO QUE SE MUEDA INGRESAR SOLO AUNTENTICADO,
@Controller('auth')
export class AuthController {

  constructor(
    @Inject(NATS_SERVICE) private readonly cliente: ClientProxy
  ) { }


  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.cliente.send('auth.register.user', registerUserDto).pipe(
      catchError((error) => { throw new RpcException(error); })
    );
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      return await firstValueFrom(this.cliente.send('auth.login.user', loginUserDto));
    } catch (error: any) {
      throw new RpcException(error);
    }
      // return this.cliente.send('auth.login.user', loginUserDto).pipe(
      //   catchError((error) => { throw new RpcException(error); })
      // );

  }


  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken( @Usuario() usuario: CurrentUsuario, @Token() token: string  ) {
    // RETORNO EL usuario y el token directamente y no llamo a ningún microservicio,
    // porque el guard ya se encargó de verificar el token con el microservicio correspondiente y extraer el usuario, así que si llegamos aquí es porque el token es válido y el usuario está autenticado
    return { usuario, token };
  }


}
