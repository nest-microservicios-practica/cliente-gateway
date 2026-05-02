import { Catch, ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('RpcCustomExceptionFilter');
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();    
    const response = ctx.getResponse();

    const rpcError = exception.getError();
    this.logger.error('RpcCustomExceptionFilter');
    // this.logger.error({rpcError});

    // console.log({ rpcError });

    //! esto es en caso de que el microservicio no responda. el profesor coloco error 500, pero lo cambie por 504
    if (rpcError.toString().includes('Empty response')) {
      return response.status(504).json({
        status: 504,
        //message: 'Un microservicio no respondió',
        // el substring es para que no envie al frontend toda la cadena, ya que incluye quien fallo al cliente no le interesa
        message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') -1),
      });
    }


    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(Number(rpcError.status)) ? 400 : Number(rpcError.status);
      return response.status(status).json(rpcError);
    }

    // si es un error desconocido, el profesor lanzar 400, pero yo lanzaria un 500 porque no es controlado
    return response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}