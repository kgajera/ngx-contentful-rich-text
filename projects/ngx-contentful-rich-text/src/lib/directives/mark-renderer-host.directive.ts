import {
  Directive,
  Input,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Mark } from '@contentful/rich-text-types';

import { MarkRenderer, Text } from '../classes/mark-renderer.class';
import { TextValueComponent } from '../components/text-value.component';
import { ComponentRendererService } from '../services/component-renderer.service';
import { RendererProviderService } from '../services/renderer-provider.service';

@Directive({
  selector: '[ngxMarkRendererHost]',
})
export class MarkRendererHostDirective implements OnInit {
  @Input() node: Text;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentRenderer: ComponentRendererService,
    private rendererProvider: RendererProviderService
  ) {}

  ngOnInit() {
    let component: Type<MarkRenderer | TextValueComponent>;
    const numMarks: number = this.node.marks.length;
    if (isNaN(this.node.markIndex)) {
      this.node.markIndex = 0;
    } else {
      this.node.markIndex += 1;
    }
    if (numMarks && numMarks > this.node.markIndex) {
      const mark: Mark = this.node.marks[this.node.markIndex];
      component = this.rendererProvider.getMarkRenderer(mark.type);
    } else {
      component = TextValueComponent;
    }
    this.componentRenderer.render(
      this.viewContainerRef,
      component,
      this.node
    );
  }
}
