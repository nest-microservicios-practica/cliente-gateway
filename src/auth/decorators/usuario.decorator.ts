import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';



export const Usuario = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {


    const request = ctx.switchToHttp().getRequest();

    if ( !request.usuario ) {
      throw new InternalServerErrorException('Usuario not found in request (AuthGuard called?)');
    }

    return request.usuario;
  },
);