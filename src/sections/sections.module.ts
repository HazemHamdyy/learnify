import { Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService],
  imports: [PrismaModule],
})
export class SectionsModule {}
