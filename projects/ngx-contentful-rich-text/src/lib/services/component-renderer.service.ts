import {
  ComponentFactoryResolver,
  Injectable,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Block, Inline, Text } from '@contentful/rich-text-types';

import { MarkRenderer } from '../classes/mark-renderer.class';
import { NodeRenderer } from '../classes/node-renderer.class';
import { TextValueComponent } from '../components/text-value.component';

@Injectable({
  providedIn: 'root',
})
export class ComponentRendererService {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  render(
    viewContainerRef: ViewContainerRef,
    component: Type<NodeRenderer | MarkRenderer | TextValueComponent>,
    node: Block | Inline | Text
  ): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(component);
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    componentRef.instance.node = node;
    componentRef.changeDetectorRef.detectChanges();
  }
}
