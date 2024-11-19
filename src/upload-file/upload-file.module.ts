import { Module } from '@nestjs/common';
import { UploadFileController } from './upload-file.controller';
import { GoogleDriveModule } from 'src/google-drive/google-drive.module';

@Module({
  controllers: [UploadFileController],
  imports: [GoogleDriveModule],
})
export class UploadFileModule {}
