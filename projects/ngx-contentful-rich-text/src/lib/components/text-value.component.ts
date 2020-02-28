import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Text } from '@contentful/rich-text-types';

@Component({
  template: '{{ node.value }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextValueComponent {
  @Input() node: Text;
}
