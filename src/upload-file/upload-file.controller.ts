import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('upload-file')
export class UploadFileController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file')) // "file" matches the form field name
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new Error('File not provided');
    }

    const fileUrl = await this.googleDriveService.uploadFile(file);
    return { fileUrl };
  }
}
