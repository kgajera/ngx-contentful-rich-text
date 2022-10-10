import { ViewContainerRef, Type } from '@angular/core';
import { Block, Inline, Text } from '@contentful/rich-text-types';
import { MarkRenderer } from '../classes/mark-renderer.class';
import { NodeRenderer } from '../classes/node-renderer.class';
import { TextValueComponent } from '../components/text-value.component';

export abstract class RendererHost {
  render(
    viewContainerRef: ViewContainerRef,
    component: Type<NodeRenderer | MarkRenderer | TextValueComponent>,
    node: Block | Inline | Text
  ): void {
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(component);
    componentRef.instance.node = node;
    componentRef.changeDetectorRef.detectChanges();
  }
}
