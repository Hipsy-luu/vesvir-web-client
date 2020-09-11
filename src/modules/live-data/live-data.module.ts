import { Module } from '@nestjs/common';
import { DashboardGraphsGateway } from './dashboard-graphs.gateway';

@Module({
    providers: [ DashboardGraphsGateway ]
})
export class LiveDataModule {}
