import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as packageConfig from '../package.json';

const generateDocument = (app: any) => {
  const options = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setDescription(packageConfig.description)
    .setVersion(packageConfig.version)
    .addBearerAuth()
    .build(); // 增加鉴权功能.build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/doc', app, document);
};

export default generateDocument;