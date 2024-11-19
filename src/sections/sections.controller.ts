import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateSectionDto } from './dtos/create-section.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Section, User } from '@prisma/client';
import { SectionsService } from './sections.service';
import { UpdateSectionDto } from './dtos/update-section.dto';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionnsService: SectionsService) {}
  @Post()
  @UseGuards(AuthGuard)
  createSection(
    @Body() createSectionDto: CreateSectionDto,
    @CurrentUser() user: User,
  ): Promise<Section | null> {
    return this.sectionnsService.create(user.id, createSectionDto);
  }

  @Get('/:id')
  getSectionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Section | null> {
    return this.sectionnsService.findOneById(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateSectionDto,
    @CurrentUser() user: User,
  ): Promise<Section | null> {
    return this.sectionnsService.update(id, user.id, updateSectionDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  deleteSection(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.sectionnsService.delete(id, user.id);
  }
}
