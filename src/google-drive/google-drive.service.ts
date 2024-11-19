import { Injectable } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleDriveService {
  private drive: drive_v3.Drive;

  constructor(private configService: ConfigService) {
    const keyFilePath = this.configService.get<string>('GOOGLE_KEY_FILE_PATH');
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  // Convert Buffer to Readable Stream
  private bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // End of stream
    return stream;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileMetadata = {
      name: file.originalname,
    };

    const media = {
      mimeType: file.mimetype,
      body: this.bufferToStream(file.buffer), // Convert Buffer to Stream
    };

    try {
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink, webContentLink',
      });

      const fileId = response.data.id;

      await this.drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return response.data.webViewLink || '';
    } catch (error) {
      throw new Error(
        `Failed to upload file to Google Drive: ${error.message}`,
      );
    }
  }
}
