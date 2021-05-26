import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Block, Document, Inline } from '@contentful/rich-text-types';
import {
  MarkRendererResolver,
  NodeRendererResolver,
  RendererProviderService,
} from './services/renderer-provider.service';

@Component({
  selector: 'ngx-contentful-rich-text',
  template: `
    <ng-container *ngIf="nodes?.length">
      <ng-container *ngFor="let node of nodes">
        <ng-container
          *ngIf="node.nodeType !== 'text'; else textNode"
          ngxNodeRendererHost
          [node]="node"
        >
        </ng-container>
        <ng-template #textNode>
          <ng-container ngxMarkRendererHost [node]="node"></ng-container>
        </ng-template>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxContentfulRichTextComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'ngx-contentful-rich-text';

  /** Document to render */
  @Input() document: Document;

  /** Nodes to render */
  @Input() nodes: Array<Block | Inline>;

  /** Custom renderers for block and inline nodes */
  @Input() nodeRenderers: Record<string, NodeRendererResolver>;

  /** Custom renderers for marks */
  @Input() markRenderers: Record<string, MarkRendererResolver>;

  constructor(private rendererProvider: RendererProviderService) {}

  ngOnInit(): void {
    this.rendererProvider.setNodeRenderers(this.nodeRenderers);
    this.rendererProvider.setMarkRenderers(this.markRenderers);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.document?.currentValue) {
      this.nodes = [changes.document.currentValue];
    }
  }
}
