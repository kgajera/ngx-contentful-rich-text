import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  RendererFactory2,
  ViewContainerRef,
} from '@angular/core';
import { Text } from '@contentful/rich-text-types';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextValueComponent implements OnInit {
  @Input() node: Text;

  constructor(
    private viewContainer: ViewContainerRef,
    private rendererFactory: RendererFactory2
  ) {}

  ngOnInit(): void {
    if (this.node && this.node.value) {
      const textBlocks = this.node.value.split('\n');
      const host = this.viewContainer.element.nativeElement;
      const renderer = this.rendererFactory.createRenderer(host, null);
      textBlocks.forEach((block, index) => {
        renderer.appendChild(host, renderer.createText(block));
        if (textBlocks.length > index + 1) {
          renderer.appendChild(host, renderer.createElement('br'));
        }
      });
    }
  }
}
