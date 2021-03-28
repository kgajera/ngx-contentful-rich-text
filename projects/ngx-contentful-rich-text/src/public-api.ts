/*
 * Public API Surface of ngx-contentful-rich-text
 */

export * from './lib/ngx-contentful-rich-text.component';
export * from './lib/ngx-contentful-rich-text.module';
export * from './lib/directives/mark-renderer-host.directive';

export { MarkRenderer } from './lib/classes/mark-renderer.class';
export * from './lib/classes/node-renderer.class';

export * from './lib/components/default-mark-renderer.component';
export * from './lib/components/default-node-renderer.component';

export {
  MarkRendererFunction,
  MarkRendererResolver,
  NodeRendererFunction,
  NodeRendererResolver,
} from './lib/services/renderer-provider.service';
