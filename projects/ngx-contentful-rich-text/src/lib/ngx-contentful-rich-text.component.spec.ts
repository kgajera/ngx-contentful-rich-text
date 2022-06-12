import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  TestModuleMetadata,
  waitForAsync,
} from '@angular/core/testing';
import {
  BLOCKS,
  Block,
  INLINES,
  Inline,
  MARKS,
  Mark,
  Text,
} from '@contentful/rich-text-types';

import { MarkRenderer } from './classes/mark-renderer.class';
import { NodeRenderer } from './classes/node-renderer.class';
import { TEXT } from './components/default-mark-renderer.component';
import { CHILDREN } from './components/default-node-renderer.component';
import { NgxContentfulRichTextComponent } from './ngx-contentful-rich-text.component';
import { NgxContentfulRichTextModule } from './ngx-contentful-rich-text.module';

/**
 * Returns true if the node element should have any direct text content
 *
 * @param nodeType Type of node
 */
const hasTextContent: (nodeType: string) => boolean = (nodeType) =>
  ![BLOCKS.HR, BLOCKS.OL_LIST, BLOCKS.UL_LIST].includes(nodeType as BLOCKS);

/**
 * Generate a string to use as text for a node element.
 *
 * @param nodeType Type of node
 */
const textContent: (nodeType: string) => string = (nodeType) =>
  hasTextContent(nodeType) ? `${nodeType} works!` : '';

/**
 * Generate inline nodes for a parent block type
 *
 * @param nodeType The parent node type for the generated nodes
 * @param marks Optional mark types that should be used
 */
function getInlines(
  nodeType: BLOCKS | INLINES,
  marks: Array<Mark> = []
): Array<Block | Inline | Text> {
  switch (nodeType) {
    case BLOCKS.HR:
      return [];
    case BLOCKS.OL_LIST:
    case BLOCKS.UL_LIST:
      return [
        {
          nodeType: BLOCKS.LIST_ITEM,
          data: {},
          content: getInlines(BLOCKS.LIST_ITEM, marks),
        },
      ];
    default:
      return [
        {
          nodeType: 'text',
          data: {},
          marks,
          value: textContent(nodeType),
        },
      ];
  }
}

/**
 * Generate a node for each block node type
 */
function getAllBlocks(): Array<Block> {
  const blocks: Array<Block> = [];
  const blockTypes: Array<BLOCKS> = Object.values(BLOCKS);
  for (const block of blockTypes) {
    blocks.push({
      nodeType: block,
      data: {},
      content: getInlines(block),
    });
  }
  return blocks;
}

/** Component to test custom block rendering */
@Component({
  template: ` <div class="h1">${CHILDREN}</div> `,
})
export class CustomHeading1RendererComponent extends NodeRenderer {}

/** Component to test custom mark rendering */
@Component({
  template: ` <span class="underline">${TEXT}</span> `,
})
export class CustomUnderlineRendererComponent extends MarkRenderer {}

const DEFAULT_TEST_MODULE: TestModuleMetadata = {
  imports: [NgxContentfulRichTextModule],
};

describe('NgxContentfulRichTextComponent', () => {
  describe('rendering blocks', () => {
    let component: NgxContentfulRichTextComponent;
    let fixture: ComponentFixture<NgxContentfulRichTextComponent>;
    const BLOCK_TAG_MAP: Record<string, string> = {
      [BLOCKS.EMBEDDED_ENTRY]: 'div',
      [BLOCKS.HEADING_1]: 'h1',
      [BLOCKS.HEADING_2]: 'h2',
      [BLOCKS.HEADING_3]: 'h3',
      [BLOCKS.HEADING_4]: 'h4',
      [BLOCKS.HEADING_5]: 'h5',
      [BLOCKS.HEADING_6]: 'h6',
      [BLOCKS.HR]: 'hr',
      [BLOCKS.LIST_ITEM]: 'li',
      [BLOCKS.PARAGRAPH]: 'p',
      [BLOCKS.OL_LIST]: 'ol',
      [BLOCKS.QUOTE]: 'blockquote',
      [BLOCKS.UL_LIST]: 'ul',
    };

    beforeAll(waitForAsync(() => {
      TestBed.configureTestingModule(DEFAULT_TEST_MODULE)
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(NgxContentfulRichTextComponent);
          component = fixture.componentInstance;
          component.nodes = getAllBlocks();
          fixture.detectChanges();
        });
    }));

    for (const block of Object.keys(BLOCK_TAG_MAP)) {
      it(`should render ${block}`, () => {
        const parentElement: HTMLElement = fixture.nativeElement;
        const expectedTag: string = BLOCK_TAG_MAP[block];
        const blockElement: HTMLElement =
          parentElement.querySelector(expectedTag);
        expect(blockElement).toBeTruthy();

        if (hasTextContent(block)) {
          expect(blockElement.textContent).toEqual(textContent(block));
        }
      });
    }

    it(`should render ${BLOCKS.OL_LIST} and ${BLOCKS.LIST_ITEM}`, () => {
      const parentElement: HTMLElement = fixture.nativeElement;
      const orderedListElement: HTMLOListElement =
        parentElement.querySelector('ol');
      expect(orderedListElement).toBeTruthy();
      const listElement: HTMLLIElement = orderedListElement.querySelector('li');
      expect(listElement.textContent).toEqual(textContent(BLOCKS.LIST_ITEM));
    });

    it(`should render ${BLOCKS.UL_LIST} and ${BLOCKS.LIST_ITEM}`, () => {
      const parentElement: HTMLElement = fixture.nativeElement;
      const unorderedListElement: HTMLUListElement =
        parentElement.querySelector('ul');
      expect(unorderedListElement).toBeTruthy();
      const listElement: HTMLLIElement =
        unorderedListElement.querySelector('li');
      expect(listElement.textContent).toEqual(textContent(BLOCKS.LIST_ITEM));
    });
  });

  describe('rendering inlines', () => {
    let fixture: ComponentFixture<NgxContentfulRichTextComponent>;
    const anchorUri = 'https://github.com/kgajera/ngx-contentful-rich-text';

    beforeAll(async () => {
      TestBed.configureTestingModule(DEFAULT_TEST_MODULE)
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(NgxContentfulRichTextComponent);
          fixture.componentInstance.nodes = [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [
                {
                  nodeType: INLINES.HYPERLINK,
                  data: {
                    uri: anchorUri,
                  },
                  content: getInlines(INLINES.HYPERLINK) as Array<
                    Inline | Text
                  >,
                },
              ],
            },
          ];
          fixture.detectChanges();
        });
    });

    it(`should render ${INLINES.HYPERLINK}`, () => {
      const parentElement: HTMLElement = fixture.nativeElement;
      const anchorElement: HTMLAnchorElement = parentElement.querySelector('a');
      expect(anchorElement.textContent).toEqual(textContent(INLINES.HYPERLINK));
      expect(anchorElement.getAttribute('href')).toEqual(anchorUri);
    });
  });

  describe('rendering marks', () => {
    let fixture: ComponentFixture<NgxContentfulRichTextComponent>;

    beforeAll(async () => {
      TestBed.configureTestingModule(DEFAULT_TEST_MODULE)
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(NgxContentfulRichTextComponent);
          fixture.componentInstance.nodes = [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: getInlines(BLOCKS.PARAGRAPH, [
                { type: MARKS.BOLD },
                { type: MARKS.CODE },
                { type: MARKS.ITALIC },
                { type: MARKS.UNDERLINE },
              ]),
            },
          ];
          fixture.detectChanges();
        });
    });

    it(`should render multiple marks`, () => {
      const parentElement: HTMLElement = fixture.nativeElement;
      const paragraphElement: HTMLParagraphElement =
        parentElement.querySelector('p');
      expect(paragraphElement).toBeTruthy();

      const boldElement: HTMLElement = paragraphElement.querySelector(
        ':scope > ngx-contentful-rich-text > ng-component > b'
      );
      expect(boldElement).toBeTruthy();

      const codeElement: HTMLElement = boldElement.querySelector(
        ':scope > ng-component > code'
      );
      expect(codeElement).toBeTruthy();

      const italicElement: HTMLElement = codeElement.querySelector(
        ':scope > ng-component > i'
      );
      expect(italicElement).toBeTruthy();

      const underlineElement: HTMLElement = italicElement.querySelector(
        ':scope > ng-component > u'
      );
      expect(underlineElement).toBeTruthy();
    });
  });

  describe('custom renderer component', () => {
    let fixture: ComponentFixture<NgxContentfulRichTextComponent>;

    beforeAll(async () => {
      TestBed.configureTestingModule({
        declarations: [
          CustomHeading1RendererComponent,
          CustomUnderlineRendererComponent,
        ],
        imports: [NgxContentfulRichTextModule],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(NgxContentfulRichTextComponent);

          const component = fixture.componentInstance;
          component.nodeRenderers = {
            [BLOCKS.HEADING_1]: CustomHeading1RendererComponent,
          };
          component.markRenderers = {
            [MARKS.UNDERLINE]: CustomUnderlineRendererComponent,
          };
          component.nodes = [
            {
              nodeType: BLOCKS.HEADING_1,
              data: {},
              content: getInlines(BLOCKS.HEADING_1, [
                { type: MARKS.UNDERLINE },
              ]),
            },
          ];
          fixture.detectChanges();
        });
    });

    it(`should use custom ${BLOCKS.HEADING_1} component`, () => {
      const customHeading1Element: HTMLElement =
        fixture.nativeElement.querySelector('div.h1');
      expect(customHeading1Element).toBeTruthy();
      expect(customHeading1Element.textContent).toEqual(
        textContent(BLOCKS.HEADING_1)
      );
    });

    it(`should use custom ${MARKS.UNDERLINE} component`, () => {
      const customUnderlineElement: HTMLElement =
        fixture.nativeElement.querySelector('span.underline');
      expect(customUnderlineElement).toBeTruthy();
      expect(customUnderlineElement.textContent).toEqual(
        textContent(BLOCKS.HEADING_1)
      );
    });
  });

  describe('custom renderer function', () => {
    let fixture: ComponentFixture<NgxContentfulRichTextComponent>;

    beforeAll(async () => {
      TestBed.configureTestingModule({
        declarations: [
          CustomHeading1RendererComponent,
          CustomUnderlineRendererComponent,
        ],
        imports: [NgxContentfulRichTextModule],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(NgxContentfulRichTextComponent);

          const component = fixture.componentInstance;
          component.nodeRenderers = {
            [BLOCKS.HEADING_1]: () => CustomHeading1RendererComponent,
          };
          component.markRenderers = {
            [MARKS.UNDERLINE]: () => CustomUnderlineRendererComponent,
          };
          component.nodes = [
            {
              nodeType: BLOCKS.HEADING_1,
              data: {},
              content: getInlines(BLOCKS.HEADING_1, [
                { type: MARKS.UNDERLINE },
              ]),
            },
          ];
          fixture.detectChanges();
        });
    });

    it(`should use custom ${BLOCKS.HEADING_1} component`, () => {
      const customHeading1Element: HTMLElement =
        fixture.nativeElement.querySelector('div.h1');
      expect(customHeading1Element).toBeTruthy();
      expect(customHeading1Element.textContent).toEqual(
        textContent(BLOCKS.HEADING_1)
      );
    });

    it(`should use custom ${MARKS.UNDERLINE} component`, () => {
      const customUnderlineElement: HTMLElement =
        fixture.nativeElement.querySelector('span.underline');
      expect(customUnderlineElement).toBeTruthy();
      expect(customUnderlineElement.textContent).toEqual(
        textContent(BLOCKS.HEADING_1)
      );
    });
  });
});
