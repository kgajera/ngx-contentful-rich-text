# ngx-contentful-rich-text

Angular renderer for the Contentful rich text field type.

## Installation

Using [npm](https://www.npmjs.com/package/ngx-contentful-rich-text):

```sh
npm install ngx-contentful-rich-text --save
```

Using [yarn](https://yarnpkg.com/package/ngx-contentful-rich-text):

```sh
yarn add ngx-contentful-rich-text
```

## Usage

Import `NgxContentfulRichTextModule` in your module:

```typescript
import { NgxContentfulRichTextModule } from 'ngx-contentful-rich-text';

@NgModule({
  imports: [NgxContentfulRichTextModule],
})
export class AppModule {}
```

Use `NgxContentfulRichTextComponent` in your template with the `document` input:

```typescript
import { Component } from '@angular/core';
import { Document } from '@contentful/rich-text-types';

@Component({
  selector: 'app-root',
  template: `
    <ngx-contentful-rich-text [document]="document"></ngx-contentful-rich-text>
  `,
})
export class AppComponent {
  document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: 'text',
            data: {},
            value: 'Hello World',
            marks: [{ type: 'bold' }],
          },
        ],
      },
    ],
  };
}
```

You can also pass custom renderer components for both nodes and marks using the `nodeRenderers` and `markRenderers` optional inputs respectively like so:

```typescript
import { Component, Type } from '@angular/core';
import { BLOCKS, MARKS, Document } from '@contentful/rich-text-types';
import {
  CHILDREN,
  TEXT,
  MarkRenderer,
  NodeRenderer,
} from 'ngx-contentful-rich-text';

@Component({
  template: `
    <p class="bold">${TEXT}</p>
  `,
})
export class CustomBoldComponent extends MarkRenderer {}

@Component({
  template: `
    <p class="text-center">${CHILDREN}</p>
  `,
})
export class CustomParagraphComponent extends NodeRenderer {}

@Component({
  selector: 'app-root',
  template: `
    <ngx-contentful-rich-text
      [document]="document"
      [nodeRenderers]="nodeRenderers"
      [markRenderers]="markRenderers"
    >
    </ngx-contentful-rich-text>
  `,
})
export class AppComponent {
  nodeRenderers: Record<string, Type<NodeRenderer>> = {
    [BLOCKS.PARAGRAPH]: CustomParagraphComponent,
  };
  markRenderers: Record<string, Type<MarkRenderer>> = {
    [MARKS.BOLD]: CustomBoldComponent,
  };

  document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: 'text',
            data: {},
            value: 'Hello World',
            marks: [{ type: 'bold' }],
          },
        ],
      },
    ],
  };
}
```

Last, but not least, you can pass a custom rendering component for an embedded entry:

```typescript
import { Component, OnInit, Type } from '@angular/core';
import { BLOCKS, Document } from '@contentful/rich-text-types';
import { NodeRenderer } from 'ngx-contentful-rich-text';

@Component({
  template: `<div>{{ fields.title }}</div>`
})
export class CustomEmbeddedEntryComponent extends NodeRenderer implements OnInit {
  fields: any;

  ngOnInit() {
    this.fields = this.node.data.target.fields;
  }
}

@Component({
  selector: 'app-root',
  template: `
    <ngx-contentful-rich-text
      [document]="document"
      [nodeRenderers]="nodeRenderers">
    </ngx-contentful-rich-text>
  `,
})
export class AppComponent {
  nodeRenderers: Record<string, Type<NodeRenderer>> = {
    [BLOCKS.EMBEDDED_ENTRY]: CustomEmbeddedEntryComponent
  };

  document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.EMBEDDED_ENTRY,
        data: {
          target: (...)Link<'Entry'>(...)
        },
        content: [],
      },
    ],
  };
}
```

The `nodeRenderers` keys should be one of the following `BLOCKS` and `INLINES` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BLOCKS`

  - `DOCUMENT`
  - `PARAGRAPH`
  - `HEADING_1`
  - `HEADING_2`
  - `HEADING_3`
  - `HEADING_4`
  - `HEADING_5`
  - `HEADING_6`
  - `UL_LIST`
  - `OL_LIST`
  - `LIST_ITEM`
  - `QUOTE`
  - `HR`
  - `EMBEDDED_ENTRY`
  - `EMBEDDED_ASSET`

- `INLINES`
  - `EMBEDDED_ENTRY` (this is different from the `BLOCKS.EMBEDDED_ENTRY`)
  - `HYPERLINK`
  - `ENTRY_HYPERLINK`
  - `ASSET_HYPERLINK`

The `markRenderers` keys should be one of the following `MARKS` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BOLD`
- `ITALIC`
- `UNDERLINE`
- `CODE`
