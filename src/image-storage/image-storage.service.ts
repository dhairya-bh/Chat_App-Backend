import { Inject, Injectable } from '@nestjs/common';
import { Services } from '../utils/constants';
import { IImageStorageService } from './image-storage';
import { PutObjectCommandInput, S3, S3ClientConfig } from '@aws-sdk/client-s3';
import {
  UploadGroupMessageAttachmentParams,
  UploadImageParams,
  UploadMessageAttachmentParams,
} from '../utils/types';
import { compressImage } from '../utils/helpers';
import { Upload } from '@aws-sdk/lib-storage';
import { GroupMessageAttachment } from 'src/utils/typeorm/entities/GroupMessageAttachment';

@Injectable()
export class ImageStorageService implements IImageStorageService {
  private readonly s3: S3;
  constructor(
    @Inject(Services.SPACES_CLIENT)
    private readonly spacesClient: S3,
  ) {
    const s3Config: S3ClientConfig = {
      region: process.env.AWS_S3_REGION,
    };
    this.s3 = new S3(s3Config);
  }

  async upload(data: UploadImageParams) {
    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      ContentType: data.file.mimetype,
      Body: data.file.buffer,
      Key: data.key,
      ACL: 'public-read',
    };

    const result = await new Upload({
      client: this.s3,
      params,
    }).done();

    return result.Location;
  }

  async uploadMessageAttachment(data: UploadMessageAttachmentParams) {
    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `original/${data.messageAttachment.key}`,
      Body: data.file.buffer,
      ACL: 'public-read',
      ContentType: data.file.mimetype,
    };

    const result = await new Upload({
      client: this.s3,
      params,
    }).done();

    await this.uploadCompress(data);

    return data.messageAttachment;
  }

  async uploadGroupMessageAttachment(
    data: UploadGroupMessageAttachmentParams,
  ): Promise<GroupMessageAttachment> {
    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `original/${data.messageAttachment.key}`,
      Body: data.file.buffer,
      ACL: 'public-read',
      ContentType: data.file.mimetype,
    };

    const result = await new Upload({
      client: this.s3,
      params,
    }).done();

    await this.uploadCompress(data);
    return data.messageAttachment;
  }

  async uploadCompress(data: any) {
    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `preview/${data.messageAttachment.key}`,
      Body: await compressImage(data.file),
      ACL: 'public-read',
      ContentType: data.file.mimetype,
    };

    const result = await new Upload({
      client: this.s3,
      params,
    }).done();

    return;
  }
}
