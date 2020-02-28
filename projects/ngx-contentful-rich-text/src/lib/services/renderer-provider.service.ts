import { Injectable, Type } from '@angular/core';

import { MarkRenderer } from '../classes/mark-renderer.class';
import { NodeRenderer } from '../classes/node-renderer.class';
import { DefaultMarkRendererComponent } from '../components/default-mark-renderer.component';
import { DefaultNodeRendererComponent } from '../components/default-node-renderer.component';

@Injectable({
  providedIn: 'root',
})
export class RendererProviderService {
  private nodeRenderers: Record<string, Type<NodeRenderer>> = {};
  private markRenderers: Record<string, Type<MarkRenderer>> = {};

  getMarkRenderer(nodeType: string): Type<MarkRenderer> {
    return this.markRenderers[nodeType] || DefaultMarkRendererComponent;
  }

  getNodeRenderer(nodeType: string): Type<NodeRenderer> {
    return this.nodeRenderers[nodeType] || DefaultNodeRendererComponent;
  }

  setNodeRenderers(customRenderers: Record<string, Type<NodeRenderer>>) {
    this.nodeRenderers = Object.assign(this.nodeRenderers, customRenderers);
  }

  setMarkRenderers(customRenderers: Record<string, Type<MarkRenderer>>) {
    this.markRenderers = Object.assign(this.markRenderers, customRenderers);
  }
}
