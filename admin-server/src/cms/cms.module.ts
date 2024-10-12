import { Module } from '@nestjs/common';
import { ContentController } from './controllers/content.controller';
import { TemplateController } from './controllers/template.controller';
import { ContentService } from './services/content.service';
import { ContentProviders } from './content.providers';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ContentController, TemplateController],
  providers: [ContentService, ...ContentProviders],
})
export class CmsModule {}
