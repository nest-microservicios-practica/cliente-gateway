import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards';
import { Usuario } from './decorators/usuario.decorator';
import { Token } from './decorators/token.decorator';
import { CurrentUsuario } from './interfaces';

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
