import { Injectable, Type } from '@angular/core';
import { Block, Inline } from '@contentful/rich-text-types';

import { MarkRenderer, Text } from '../classes/mark-renderer.class';
import { NodeRenderer } from '../classes/node-renderer.class';
import { DefaultMarkRendererComponent } from '../components/default-mark-renderer.component';
import { DefaultNodeRendererComponent } from '../components/default-node-renderer.component';

export type NodeRendererFunction = (node: Block | Inline) => Type<NodeRenderer>;
export type NodeRendererResolver = Type<NodeRenderer> | NodeRendererFunction;

export type MarkRendererFunction = (node: Text) => Type<MarkRenderer>;
export type MarkRendererResolver = Type<MarkRenderer> | MarkRendererFunction;

@Injectable({
  providedIn: 'root',
})
export class RendererProviderService {
  private nodeRenderers: Record<string, NodeRendererResolver> = {};
  private markRenderers: Record<string, MarkRendererResolver> = {};

  getMarkRenderer(node: Text): Type<MarkRenderer> {
    const mark = node.marks[node.markIndex];
    const resolver = this.markRenderers[mark.type];
    let renderer: Type<MarkRenderer>;
    try {
      renderer = (resolver as MarkRendererFunction)(node);
    } catch (error) {
      renderer = resolver as Type<MarkRenderer>;
    }
    return renderer || DefaultMarkRendererComponent;
  }

  getNodeRenderer(node: Block | Inline): Type<NodeRenderer> {
    const resolver = this.nodeRenderers[node.nodeType];
    let renderer: Type<NodeRenderer>;
    try {
      renderer = (resolver as NodeRendererFunction)(node);
    } catch (error) {
      renderer = resolver as Type<NodeRenderer>;
    }
    return renderer || DefaultNodeRendererComponent;
  }

  setNodeRenderers(customRenderers: Record<string, NodeRendererResolver>) {
    this.nodeRenderers = Object.assign(this.nodeRenderers, customRenderers);
  }

  setMarkRenderers(customRenderers: Record<string, MarkRendererResolver>) {
    this.markRenderers = Object.assign(this.markRenderers, customRenderers);
  }
}
