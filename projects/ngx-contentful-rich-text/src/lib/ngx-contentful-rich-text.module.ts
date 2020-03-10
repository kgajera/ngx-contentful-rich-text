import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DefaultMarkRendererComponent } from './components/default-mark-renderer.component';
import { DefaultNodeRendererComponent } from './components/default-node-renderer.component';
import { TextValueComponent } from './components/text-value.component';
import { MarkRendererHostDirective } from './directives/mark-renderer-host.directive';
import { NodeRendererHostDirective } from './directives/node-renderer-host.directive';
import { NgxContentfulRichTextComponent } from './ngx-contentful-rich-text.component';

@NgModule({
  declarations: [
    DefaultMarkRendererComponent,
    DefaultNodeRendererComponent,
    MarkRendererHostDirective,
    NgxContentfulRichTextComponent,
    NodeRendererHostDirective,
    TextValueComponent,
  ],
  imports: [CommonModule],
  exports: [
    MarkRendererHostDirective,
    NgxContentfulRichTextComponent,
  ],
})
export class NgxContentfulRichTextModule {}
