import {
  Directive,
  Input,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';

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
  ) { }

  ngOnInit() {
    const render = (component: Type<MarkRenderer | TextValueComponent>) =>
      this.componentRenderer.render(
        this.viewContainerRef,
        component,
        this.node
      );

    if (isNaN(this.node.markIndex)) {
      // Create new object because node object might not be extensible
      this.node = {
        ...this.node,
        markIndex: 0,
      };
    } else {
      this.node.markIndex += 1;
    }
    if (this.node.marks.length > this.node.markIndex) {
      this.rendererProvider.getMarkRenderer(this.node).then(render);
    } else {
      render(TextValueComponent);
    }
  }
}
