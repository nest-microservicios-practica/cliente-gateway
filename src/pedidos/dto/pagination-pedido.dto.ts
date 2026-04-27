import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto";
import { PedidoStatus, PedidoStatusList } from "../enum/pedido.enum";

export class PaginationPedidoDto extends PaginationDto{
    @IsOptional()
    @IsEnum(PedidoStatusList, {
        message: 'El estado debe ser uno de los siguientes: ' + Object.values(PedidoStatusList).join(', ')
    })
    status?: PedidoStatus;
}