import { Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Block, Inline } from '@contentful/rich-text-types';
import { RendererHost } from '../classes/renderer-host.class';

import { RendererProviderService } from '../services/renderer-provider.service';

@Directive({
  selector: '[ngxNodeRendererHost]',
})
export class NodeRendererHostDirective extends RendererHost implements OnInit {
  @Input() node: Block | Inline;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private rendererProvider: RendererProviderService
  ) {
    super();
  }

  ngOnInit() {
    this.rendererProvider
      .getNodeRenderer(this.node)
      .then((component) =>
        this.render(this.viewContainerRef, component, this.node)
      );
  }
}
