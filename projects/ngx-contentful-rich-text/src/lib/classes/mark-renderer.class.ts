import { Text as IText } from '@contentful/rich-text-types';

export interface Text extends IText {
  markIndex: number;
}
export abstract class MarkRenderer {
  node: Text;
}
