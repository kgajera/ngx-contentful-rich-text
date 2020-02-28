import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

import { NodeRenderer } from '../classes/node-renderer.class';

export const CHILDREN =
  '<ngx-contentful-rich-text [nodes]="node.content"></ngx-contentful-rich-text>';

export const DEFAULT_INLINE =
  '<span>type: {{ node.nodeType }} id: {{ node.data.target.sys.id }}</span>';

@Component({
  template: `
    <ng-container [ngSwitch]="node.nodeType">
      <ng-container *ngSwitchCase="BLOCKS.DOCUMENT">${CHILDREN}</ng-container>
      <div *ngSwitchCase="BLOCKS.EMBEDDED_ENTRY">${CHILDREN}</div>
      <h1 *ngSwitchCase="BLOCKS.HEADING_1">${CHILDREN}</h1>
      <h2 *ngSwitchCase="BLOCKS.HEADING_2">${CHILDREN}</h2>
      <h3 *ngSwitchCase="BLOCKS.HEADING_3">${CHILDREN}</h3>
      <h4 *ngSwitchCase="BLOCKS.HEADING_4">${CHILDREN}</h4>
      <h5 *ngSwitchCase="BLOCKS.HEADING_5">${CHILDREN}</h5>
      <h6 *ngSwitchCase="BLOCKS.HEADING_6">${CHILDREN}</h6>
      <hr *ngSwitchCase="BLOCKS.HR" />
      <li *ngSwitchCase="BLOCKS.LIST_ITEM">${CHILDREN}</li>
      <ol *ngSwitchCase="BLOCKS.OL_LIST">
        ${CHILDREN}
      </ol>
      <p *ngSwitchCase="BLOCKS.PARAGRAPH">${CHILDREN}</p>
      <blockquote *ngSwitchCase="BLOCKS.QUOTE">${CHILDREN}</blockquote>
      <ul *ngSwitchCase="BLOCKS.UL_LIST">
        ${CHILDREN}
      </ul>
      <ng-container *ngSwitchCase="INLINES.ASSET_HYPERLINK">
        ${DEFAULT_INLINE}
      </ng-container>
      <ng-container *ngSwitchCase="INLINES.EMBEDDED_ENTRY">
        ${DEFAULT_INLINE}
      </ng-container>
      <ng-container *ngSwitchCase="INLINES.ENTRY_HYPERLINK">
        ${DEFAULT_INLINE}
      </ng-container>
      <a *ngSwitchCase="INLINES.HYPERLINK" [href]="node.data.uri">
        ${CHILDREN}
      </a>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultNodeRendererComponent extends NodeRenderer {
  BLOCKS: typeof BLOCKS = BLOCKS;
  INLINES: typeof INLINES = INLINES;
}
