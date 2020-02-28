import {
  Directive,
  Input,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Block, Inline } from '@contentful/rich-text-types';

import { NodeRenderer } from '../classes/node-renderer.class';
import { ComponentRendererService } from '../services/component-renderer.service';
import { RendererProviderService } from '../services/renderer-provider.service';

@Directive({
  selector: '[ngxNodeRendererHost]',
})
export class NodeRendererHostDirective implements OnInit {
  @Input() node: Block | Inline;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentRendererService: ComponentRendererService,
    private rendererProvider: RendererProviderService
  ) {}

  ngOnInit() {
    const component: Type<NodeRenderer> = this.rendererProvider.getNodeRenderer(
      this.node.nodeType
    );
    this.componentRendererService.render(
      this.viewContainerRef,
      component,
      this.node
    );
  }
}
