import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Accept images and videos only
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|webm|quicktime|ogg)$/)) {
          return callback(new BadRequestException('Apenas imagens e vídeos são suportados!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 15 * 1024 * 1024, // 15MB max file size
      },
    }),
  )
  uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado!');
    }
    
    // Determine if it is a video or image based on mime type
    const isVideo = file.mimetype.startsWith('video/');
    
    return {
      url: `/uploads/${file.filename}`,
      type: isVideo ? 'VIDEO' : 'IMAGE',
    };
  }
}
