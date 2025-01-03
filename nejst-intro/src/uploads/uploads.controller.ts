import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';
import { UploadsService } from './providers/uploads.service';

@Controller('uploads')
export class UploadsController {

    constructor(
        private readonly uploadService: UploadsService
    ){}

    @UseInterceptors(FileInterceptor('file'))
    @ApiHeaders([
        { name: 'Content-type', description: 'multipart/form-data' },
        { name: 'Authorization', description: 'Bearer Token' }
    ])
    @ApiOperation({
        summary: 'Upload a file',})
    @Post('file')
    public  uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.uploadFile(file);
    }
}
