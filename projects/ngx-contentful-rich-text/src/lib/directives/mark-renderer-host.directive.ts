import {
  Directive,
  Input,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';

import { MarkRenderer, Text } from '../classes/mark-renderer.class';
import { RendererHost } from '../classes/renderer-host.class';
import { TextValueComponent } from '../components/text-value.component';
import { RendererProviderService } from '../services/renderer-provider.service';

@Directive({
  selector: '[ngxMarkRendererHost]',
})
export class MarkRendererHostDirective extends RendererHost implements OnInit {
  @Input() node: Text;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private rendererProvider: RendererProviderService
  ) {
    super();
  }

  ngOnInit() {
    const render = (component: Type<MarkRenderer | TextValueComponent>) =>
      this.render(this.viewContainerRef, component, this.node);

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
