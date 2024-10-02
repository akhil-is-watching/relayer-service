import { Module } from "@nestjs/common";
import { NatsModule } from "src/nats/nats.module";
import { RelayController } from "./relay.controller";
import { RelayService } from "./relay.service";

@Module({
    imports: [ NatsModule ],
    controllers: [ RelayController ],
    providers: [ RelayService ],
})
export class RelayModule {}