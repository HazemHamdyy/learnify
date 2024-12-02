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
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionnsService: SectionsService) {}
  @ApiOperation({
    summary: 'Create section for your course',
    description: 'Create section to put your lessons on it',
  })
  @Post()
  @UseGuards(AuthGuard)
  createSection(
    @Body() createSectionDto: CreateSectionDto,
    @CurrentUser() user: User,
  ): Promise<Section | null> {
    return this.sectionnsService.create(user.id, createSectionDto);
  }

  @ApiOperation({
    summary: 'Get section data including its lessons',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the section',
    example: 1,
  })
  @Get('/:id')
  @UseGuards(AuthGuard)
  getSectionById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Section | null> {
    return this.sectionnsService.findOneById(id, user.id);
  }

  @ApiOperation({
    summary: 'Update section for your course',
  })
  @ApiBody({
    description: 'Category body contains name',
    schema: {
      example: {
        name: 'Introduction',
        sectionNumber: 1,
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the section',
    example: 1,
  })
  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateSectionDto,
    @CurrentUser() user: User,
  ): Promise<Section | null> {
    return this.sectionnsService.update(id, user.id, updateSectionDto);
  }

  @ApiOperation({
    summary: 'Delete section from your course',
    description: 'by default all its lessons will be deleted',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the section',
    example: 1,
  })
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
