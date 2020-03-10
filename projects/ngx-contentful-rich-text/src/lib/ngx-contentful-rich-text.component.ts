import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  Type,
} from '@angular/core';
import {
  BLOCKS,
  Block,
  Document,
  INLINES,
  Inline,
} from '@contentful/rich-text-types';

import { MarkRenderer } from './classes/mark-renderer.class';
import { NodeRenderer } from './classes/node-renderer.class';
import { RendererProviderService } from './services/renderer-provider.service';

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
  /** Document to render */
  @Input() document: Document;

  /** Nodes to render */
  @Input() nodes: Array<Block | Inline>;

  /** Custom renderers for block and inline nodes */
  @Input() nodeRenderers: Record<Partial<BLOCKS | INLINES>, Type<NodeRenderer>>;

  /** Custom renderers for marks */
  @Input() markRenderers: Record<string, Type<MarkRenderer>>;

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
