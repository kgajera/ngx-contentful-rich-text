import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {
  BLOCKS,
  Block,
  INLINES,
  Inline,
  MARKS,
  Mark,
  Text,
} from '@contentful/rich-text-types';

import { NgxContentfulRichTextComponent } from './ngx-contentful-rich-text.component';
import { NgxContentfulRichTextModule } from './ngx-contentful-rich-text.module';

const textContent: (nodeType: string) => string = nodeType =>
  `${nodeType} works!`;

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

describe('NgxContentfulRichTextComponent', () => {
  let component: NgxContentfulRichTextComponent;
  let fixture: ComponentFixture<NgxContentfulRichTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxContentfulRichTextModule],
    }).compileComponents();
  }));

  describe('rendering blocks', () => {
    const blocks: Array<Block> = getAllBlocks();
    const STANDARD_BLOCK_TEST: Record<string, string> = {
      [BLOCKS.HEADING_1]: 'h1',
      [BLOCKS.HEADING_2]: 'h2',
      [BLOCKS.HEADING_3]: 'h3',
      [BLOCKS.HEADING_4]: 'h4',
      [BLOCKS.HEADING_5]: 'h5',
      [BLOCKS.HEADING_6]: 'h6',
      [BLOCKS.PARAGRAPH]: 'p',
      [BLOCKS.QUOTE]: 'blockquote',
    };
    const standardBlockTestTypes = Object.keys(STANDARD_BLOCK_TEST);

    beforeAll(() => {
      fixture = TestBed.createComponent(NgxContentfulRichTextComponent);
      component = fixture.componentInstance;

      const document: Block = {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: blocks,
      };

      component.nodes = [document];
      fixture.detectChanges();
    });

    for (const block of standardBlockTestTypes) {
      it(`should render ${block}`, () => {
        const parentElement: HTMLElement = fixture.nativeElement;
        const expectedTag: string = STANDARD_BLOCK_TEST[block];
        const blockElement: HTMLElement = parentElement.querySelector(
          expectedTag
        );
        expect(blockElement.textContent).toEqual(textContent(block));
      });
    }

    it(`should render ${BLOCKS.HR}`, () => {
      const parentElement: HTMLElement = fixture.nativeElement;
      const hrElement: HTMLHRElement = parentElement.querySelector('hr');
      expect(hrElement).toBeTruthy();
    });

    it(`should render ${BLOCKS.OL_LIST}`, () => {
      const parentElement: HTMLElement = fixture.nativeElement;
      const orderedListElement: HTMLOListElement = parentElement.querySelector(
        'ol'
      );
      expect(orderedListElement).toBeTruthy();
      const listElement: HTMLLIElement = parentElement.querySelector('li');
      expect(listElement.textContent).toEqual(textContent(BLOCKS.LIST_ITEM));
    });

    it(`should render ${BLOCKS.UL_LIST}`, () => {
      const parentElement: HTMLElement = fixture.nativeElement;
      const unorderedListElement: HTMLUListElement = parentElement.querySelector(
        'ul'
      );
      expect(unorderedListElement).toBeTruthy();
      const listElement: HTMLLIElement = parentElement.querySelector('li');
      expect(listElement.textContent).toEqual(textContent(BLOCKS.LIST_ITEM));
    });
  });

  describe('rendering inlines', () => {
    const anchorUri = 'https://google.com';

    beforeAll(() => {
      fixture = TestBed.createComponent(NgxContentfulRichTextComponent);
      component = fixture.componentInstance;

      const document: Block = {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [
              {
                nodeType: INLINES.HYPERLINK,
                data: {
                  uri: anchorUri,
                },
                content: getInlines(INLINES.HYPERLINK) as Array<Inline | Text>,
              },
            ],
          },
        ],
      };

      component.nodes = [document];
      fixture.detectChanges();
    });

    it(`should render ${INLINES.HYPERLINK}`, () => {
      const parentElement: HTMLElement = fixture.nativeElement;
      const anchorElement: HTMLAnchorElement = parentElement.querySelector('a');
      expect(anchorElement.textContent).toEqual(textContent(INLINES.HYPERLINK));
      expect(anchorElement.getAttribute('href')).toEqual(anchorUri);
    });
  });

  describe('rendering marks', () => {
    beforeAll(() => {
      fixture = TestBed.createComponent(NgxContentfulRichTextComponent);
      component = fixture.componentInstance;

      const document: Block = {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
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
        ],
      };

      component.nodes = [document];
      fixture.detectChanges();
    });

    it(`should render multiple marks`, () => {
      const parentElement: HTMLElement = fixture.nativeElement;
      const paragraphElement: HTMLParagraphElement = parentElement.querySelector(
        'p'
      );
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
});
