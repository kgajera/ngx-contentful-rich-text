import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { MARKS } from '@contentful/rich-text-types';
import { MarkRenderer } from '../classes/mark-renderer.class';

export const TEXT = `<ng-container ngxMarkRendererHost [node]="node"></ng-container>`;

@Component({
  template: `
    <ng-container [ngSwitch]="node.marks[node.markIndex].type">
      <b *ngSwitchCase="MARKS.BOLD">${TEXT}</b>
      <code *ngSwitchCase="MARKS.CODE">${TEXT}</code>
      <i *ngSwitchCase="MARKS.ITALIC">${TEXT}</i>
      <u *ngSwitchCase="MARKS.UNDERLINE">${TEXT}</u>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultMarkRendererComponent extends MarkRenderer {
  @HostBinding('class') class = 'default-mark-renderer';

  MARKS: typeof MARKS = MARKS;
}
