import { Injectable, Type } from '@angular/core';
import { Block, Inline } from '@contentful/rich-text-types';

import { MarkRenderer, Text } from '../classes/mark-renderer.class';
import { NodeRenderer } from '../classes/node-renderer.class';

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

  async getMarkRenderer(node: Text): Promise<Type<MarkRenderer>> {
    const mark = node.marks[node.markIndex];
    const resolver = this.markRenderers[mark.type];
    let renderer: Type<MarkRenderer>;
    try {
      renderer = (resolver as MarkRendererFunction)(node);
    } catch (error) {
      renderer = resolver as Type<MarkRenderer>;
    }
    if (!renderer) {
      const { DefaultMarkRendererComponent } = await import(
        '../components/default-mark-renderer.component'
      );
      renderer = DefaultMarkRendererComponent;
    }
    return renderer;
  }

  async getNodeRenderer(node: Block | Inline): Promise<Type<NodeRenderer>> {
    const resolver = this.nodeRenderers[node.nodeType];
    let renderer: Type<NodeRenderer>;
    try {
      renderer = (resolver as NodeRendererFunction)(node);
    } catch (error) {
      renderer = resolver as Type<NodeRenderer>;
    }
    if (!renderer) {
      const { DefaultNodeRendererComponent } = await import(
        '../components/default-node-renderer.component'
      );
      renderer = DefaultNodeRendererComponent;
    }
    return renderer;
  }

  setNodeRenderers(customRenderers: Record<string, NodeRendererResolver>) {
    this.nodeRenderers = Object.assign(this.nodeRenderers, customRenderers);
  }

  setMarkRenderers(customRenderers: Record<string, MarkRendererResolver>) {
    this.markRenderers = Object.assign(this.markRenderers, customRenderers);
  }
}
