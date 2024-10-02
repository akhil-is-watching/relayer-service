import { Module } from '@nestjs/common';
import { RelayModule } from './relay/relay.module';

@Module({
  imports: [ RelayModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
