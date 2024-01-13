import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital])],
  controllers: [HospitalsController],
  providers: [HospitalsService],
})
export class HospitalsModule {}
