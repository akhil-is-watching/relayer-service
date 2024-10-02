import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { SignedTransactionRequestDTO } from "./relay.dto";
import { RelayService } from "./relay.service";

@Controller()
export class RelayController {

    constructor(private relayService: RelayService) {}


    @MessagePattern({cmd: 'tx.relay'})
    async relay(@Payload() body: SignedTransactionRequestDTO) {
        const signature = await this.relayService.relayTx(body)
        return { signature: signature }
    }
}