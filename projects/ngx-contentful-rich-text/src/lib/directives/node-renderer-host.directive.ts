import { Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Block, Inline } from '@contentful/rich-text-types';

import { ComponentRendererService } from '../services/component-renderer.service';
import { RendererProviderService } from '../services/renderer-provider.service';

@Directive({
  selector: '[ngxNodeRendererHost]',
})
export class NodeRendererHostDirective implements OnInit {
  @Input() node: Block | Inline;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentRenderer: ComponentRendererService,
    private rendererProvider: RendererProviderService
  ) {}

  ngOnInit() {
    this.rendererProvider
      .getNodeRenderer(this.node)
      .then((component) =>
        this.componentRenderer.render(
          this.viewContainerRef,
          component,
          this.node
        )
      );
  }
}
