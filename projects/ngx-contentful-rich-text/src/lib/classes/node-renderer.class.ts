import { Block, Inline } from '@contentful/rich-text-types';

export abstract class NodeRenderer {
  node: Block | Inline;
}
