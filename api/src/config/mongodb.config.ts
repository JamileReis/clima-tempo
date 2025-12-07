import { MongooseModuleOptions } from '@nestjs/mongoose';

export function mongodbConfigFactory(): MongooseModuleOptions {
  const uri =
    process.env.MONGO_URL ??
    'mongodb://root:root@mongodb:27017/clima_tempo?authSource=admin';

  return { uri };
}
