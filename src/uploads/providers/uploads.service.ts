import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  /**
   * Constructor for the UploadsService.
   *
   * @param {Repository<Upload>} uploadsRepository - The TypeORM repository for Upload entities.
   * @param {ConfigService} configService - The ConfigService instance, used to get configuration values.
   * @param {UploadToAwsProvider} uploadToAwsProvider - The provider for uploading files to AWS S3.
   */
  constructor(
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
    private readonly configService: ConfigService,
    private readonly uploadToAwsProvider: UploadToAwsProvider,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    try {
      if (
        !['image/gif', 'image/jpeg', 'imageeeee/png', 'image/jpg'].includes(
          file.mimetype,
        )
      ) {
        throw new BadRequestException('Invalid file type');
      }

      const name = await this.uploadToAwsProvider.fileUpload(file);
      const uploadFile: UploadFile = {
        name: name,
        path: `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const newFile = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(newFile);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could not upload file.',
      });
    }
  }
}
