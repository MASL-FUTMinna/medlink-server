import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { Repository } from 'typeorm';
import { Practitioner } from 'src/practitioners/practitioner.entity';
import { CreateSchedulesDto } from './dto/create-schedule.dto';
import { PractitionersService } from 'src/practitioners/practitioners.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRespository: Repository<Schedule>,
    private practitionersService: PractitionersService,
  ) {}

  findOne(practitioner: Practitioner, dayOfWeek: string) {
    return this.schedulesRespository.findOne({
      where: { practitioner, day_of_week: dayOfWeek },
    });
  }

  async createWeeklySchedule(
    practitionerId: number,
    createSchedulesDto: CreateSchedulesDto,
  ): Promise<Schedule[]> {
    const practitioner =
      await this.practitionersService.findById(practitionerId);

    if (!practitioner) {
      throw new NotFoundException();
    }

    const existingSchedules = await this.schedulesRespository.find({
      where: { practitioner },
    });

    if (existingSchedules.length) {
      throw new HttpException(
        'A schedule already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newSchedules = createSchedulesDto.schedules.map((schedule) => {
      const newSchedule = this.schedulesRespository.create({
        practitioner,
        day_of_week: schedule.dayOfWeek,
        opening_hour: schedule.openingHour,
        closing_hour: schedule.closingHour,
      });

      if (schedule.openingHour >= schedule.closingHour) {
        throw new HttpException(
          'Closing hour cannot be less than or equal to opening hour',
          HttpStatus.BAD_REQUEST,
        );
      }

      return newSchedule;
    });

    await this.schedulesRespository.save(newSchedules);

    return newSchedules;
  }

  async updateWeeklySchedule(
    practitionerId,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const practitioner =
      await this.practitionersService.findById(practitionerId);

    if (!practitioner) {
      throw new NotFoundException();
    }

    const existingSchedules = await this.schedulesRespository.find({
      where: { practitioner },
    });

    if (!existingSchedules.length) {
      throw new HttpException(
        'No schedule exists for this practitioner. Please create a schedule before editing',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.schedulesRespository.remove(existingSchedules);

    const newSchedules = updateScheduleDto.schedules.map((schedule) => {
      const newSchedule = this.schedulesRespository.create({
        practitioner,
        day_of_week: schedule.dayOfWeek,
        opening_hour: schedule.openingHour,
        closing_hour: schedule.closingHour,
      });

      return newSchedule;
    });

    await this.schedulesRespository.save(newSchedules);

    return newSchedules;
  }
}
