import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService],
  imports: [PrismaModule],
})
export class LessonsModule {}
