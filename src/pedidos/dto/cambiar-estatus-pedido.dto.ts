import { IsEnum } from "class-validator";
import { PedidoStatus, PedidoStatusList } from "../enum/pedido.enum";

export class CambiarEstatusPedidoDto {
    @IsEnum(PedidoStatusList, {
        message: `status del pedido no es válido, debe ser uno de: ${Object.values(PedidoStatusList).join(', ')}`
    })
    status: PedidoStatus;
}