import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { Text } from '@contentful/rich-text-types';

@Component({
  template: '{{ node.value }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextValueComponent {
  @HostBinding('class') class = 'text-value';

  @Input() node: Text;
}
