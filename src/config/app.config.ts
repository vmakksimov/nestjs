import { registerAs } from "@nestjs/config"

export default registerAs('appConfig', ()=> ({
    environment: process.env.NODE_ENV || 'production',
    apiVersion: process.env.API_VERSION || '1.0.0',
    awsBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
    awsRegion: process.env.AWS_REGION,
    awsCloudfrontUrl: process.env.AWS_CLOUDFRONT_URL,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}))

