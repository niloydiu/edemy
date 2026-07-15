import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File, folder = 'edemy/courses'): Promise<{ url: string; publicId: string }> {
    const cloudinary = require('cloudinary').v2;
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [{ quality: 'auto', fetch_format: 'auto', width: 800, height: 450, crop: 'fill' }],
        },
        (error: any, result: any) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );

      // If buffer-based upload
      if (file.buffer) {
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(
          cloudinary.uploader.upload_stream(
            { folder, transformation: [{ quality: 'auto', fetch_format: 'auto', width: 800, height: 450, crop: 'fill' }] },
            (error: any, result: any) => {
              if (error) return reject(error);
              resolve({ url: result.secure_url, publicId: result.public_id });
            }
          )
        );
      }
    });
  }

  async uploadVideoFile(file: Express.Multer.File, folder = 'edemy/videos'): Promise<{ url: string; publicId: string }> {
    const cloudinary = require('cloudinary').v2;
    return new Promise((resolve, reject) => {
      if (file.buffer) {
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(
          cloudinary.uploader.upload_stream(
            { folder, resource_type: 'video' },
            (error: any, result: any) => {
              if (error) return reject(error);
              resolve({ url: result.secure_url, publicId: result.public_id });
            }
          )
        );
      } else {
        reject(new Error('No buffer found'));
      }
    });
  }

  async deleteFile(publicId: string) {
    const cloudinary = require('cloudinary').v2;
    return cloudinary.uploader.destroy(publicId);
  }
}
