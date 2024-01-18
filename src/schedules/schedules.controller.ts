import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateSchedulesDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { QueryTimeZoneDto } from './dto/query-timezone.dt';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get(':practitionerId')
  async getAvailableSlots(
    @Param('practitionerId') practitionerId: number,
    @Query() queryTimeZoneDto: QueryTimeZoneDto,
  ) {
    return this.schedulesService.getAvailableSlots(
      practitionerId,
      queryTimeZoneDto,
    );
  }

  @Post(':practitionerId')
  create(
    @Param('practitionerId') practitionerId: number,
    @Body() createSchedulesDto: CreateSchedulesDto,
  ) {
    return this.schedulesService.createWeeklySchedule(
      practitionerId,
      createSchedulesDto,
    );
  }

  @Put(':practitionerId')
  updateSchule(
    @Param('practitionerId') practitionerId: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.updateWeeklySchedule(
      practitionerId,
      updateScheduleDto,
    );
  }
}
