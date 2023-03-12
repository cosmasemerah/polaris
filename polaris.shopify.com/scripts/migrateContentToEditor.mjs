import fs from 'fs';
import globby from 'globby';
import {parseMarkdown} from '../src/utils/markdown.mjs';
import {nanoid} from 'nanoid';

const pages = [];

function createPage(
  {
    id,
    title,
    excerpt,
    slug,
    parentId,
    order,
    useCustomLayout,
    allowChildren,
    hideInNav,
    noIndex,
    keywords,
    childPageMetaType,
    pageMeta,
    hasSeparatorInNav,
  },
  markdown,
) {
  const blocks = markdown
    ? [
        {
          id: nanoid(),
          order: 0,
          blockType: 'Markdown',
          parentBlockId: null,
          content: markdown.trim(),
        },
      ]
    : [];

  const page = {
    id,
    title,
    excerpt,
    slug,
    parentId,
    order,
    useCustomLayout,
    blocks,
    allowChildren,
    hideInNav,
    noIndex,
    keywords,
    childPageMetaType,
    pageMeta,
    hasSeparatorInNav,
  };
  pages.push(page);
}

// Migrate components
const componentsIndexFile = fs.readFileSync(
  'content/components/index.md',
  'utf8',
);
const {readme: componentsReadme, frontMatter: componentsFrontMatter} =
  parseMarkdown(componentsIndexFile);
const componentsId = nanoid();

createPage(
  {
    id: componentsId,
    title: componentsFrontMatter.title,
    excerpt: componentsFrontMatter.description || '',
    slug: 'patterns',
    parentId: null,
    order: componentsFrontMatter.order || 0,
    useCustomLayout: true,
    allowChildren: true,
    hideInNav: false,
    noIndex: false,
    childPageMetaType: null,
    pageMeta: null,
    keywords: componentsFrontMatter.keywords?.map((kw) => kw.toString()) || [],
    hasSeparatorInNav: false,
  },
  componentsReadme,
);

const componentCategories = fs.readdirSync('content/components');
componentCategories
  .filter((category) => category !== 'index.md')
  .forEach((category) => {
    const componentIndexFile = fs.readFileSync(
      `content/components/${category}/index.md`,
      'utf8',
    );
    const {
      readme: componentCategoryReadme,
      frontMatter: componentCategoryFrontMatter,
    } = parseMarkdown(componentIndexFile);
    const componentCategoryId = nanoid();

    createPage(
      {
        id: componentCategoryId,
        title: componentCategoryFrontMatter.title,
        excerpt: componentCategoryFrontMatter.description || '',
        slug: category,
        parentId: componentsId,
        order: componentCategoryFrontMatter.order || 0,
        useCustomLayout: true,
        allowChildren: true,
        hideInNav: false,
        noIndex: false,
        childPageMetaType: null,
        pageMeta: null,
        keywords:
          componentCategoryFrontMatter.keywords?.map((kw) => kw.toString()) ||
          [],
        hasSeparatorInNav: false,
      },
      componentCategoryReadme,
    );

    const filePaths = globby.sync(`content/components/${category}/*.md`);
    filePaths.forEach((filePath) => {
      const file = fs.readFileSync(filePath, 'utf8');
      const {readme, frontMatter} = parseMarkdown(file);
      const slug = filePath.split('/').pop().replace('.md', '');

      const patternsCategoryId = nanoid();

      let examples = [];

      if (frontMatter.examples) {
        frontMatter.examples.forEach((example) => {
          examples.push({
            ...example,
            description: example.description || '',
          });
        });
      }

      createPage(
        {
          id: patternsCategoryId,
          title: frontMatter.title,
          excerpt: frontMatter.description || '',
          slug,
          parentId: componentCategoryId,
          order: frontMatter.order || 0,
          useCustomLayout: false,
          allowChildren: false,
          hideInNav: false,
          noIndex: false,
          childPageMetaType: null,
          pageMeta: {
            type: 'components',
            examples: examples,
          },
          keywords: frontMatter.keywords?.map((kw) => kw.toString()) || [],
          hasSeparatorInNav: false,
        },
        readme,
      );
    });
  });

// Migrate patterns
const patternsIndexFile = fs.readFileSync('content/patterns/index.md', 'utf8');
const {readme: patternsReadme, frontMatter: patternsFrontMatter} =
  parseMarkdown(patternsIndexFile);
const patternsId = nanoid();
createPage(
  {
    id: patternsId,
    title: patternsFrontMatter.title,
    excerpt: patternsFrontMatter.description,
    slug: 'patterns',
    parentId: null,
    order: patternsFrontMatter.order || 0,
    useCustomLayout: true,
    allowChildren: true,
    hideInNav: false,
    noIndex: false,
    childPageMetaType: null,
    pageMeta: null,
    keywords: patternsFrontMatter.keywords?.map((kw) => kw.toString()) || [],
    hasSeparatorInNav: true,
  },
  patternsReadme,
);

const patternCategories = fs.readdirSync('content/patterns');
patternCategories
  .filter((patternCategory) => patternCategory !== 'index.md')
  .filter((patternCategory) => patternCategory !== 'variant.md.template')
  .forEach((patternCategory) => {
    const filePaths = globby.sync(`content/patterns/${patternCategory}/*.md`);
    filePaths.forEach((filePath) => {
      const file = fs.readFileSync(filePath, 'utf8');
      const {readme, frontMatter} = parseMarkdown(file);

      const patternsCategoryId = nanoid();
      createPage(
        {
          id: patternsCategoryId,
          title: frontMatter.title,
          excerpt: frontMatter.description,
          slug: patternCategory,
          parentId: patternsId,
          order: frontMatter.order || 0,
          useCustomLayout: true,
          allowChildren: false,
          hideInNav: false,
          noIndex: false,
          childPageMetaType: null,
          pageMeta: null,
          keywords: frontMatter.keywords?.map((kw) => kw.toString()) || [],
          hasSeparatorInNav: false,
        },
        readme,
      );
    });
  });

// Migrate foundations: Content
const contentIndexFile = fs.readFileSync('content/content/index.md', 'utf8');
const {readme: contentReadme, frontMatter: contentFrontMatter} =
  parseMarkdown(contentIndexFile);
const contentId = nanoid();
createPage(
  {
    id: contentId,
    title: contentFrontMatter.title,
    excerpt: contentFrontMatter.description || '',
    slug: 'contributing',
    parentId: null,
    order: contentFrontMatter.order || 0,
    useCustomLayout: false,
    allowChildren: true,
    hideInNav: false,
    noIndex: false,
    childPageMetaType: null,
    pageMeta: null,
    keywords: contentFrontMatter.keywords?.map((kw) => kw.toString()) || [],
    hasSeparatorInNav: false,
  },
  contentReadme,
);
const contentFilePaths = globby.sync(`content/content/*.md`);
contentFilePaths
  .filter((filePath) => !filePath.endsWith('index.md'))
  .forEach((filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    const {readme, frontMatter} = parseMarkdown(file);
    const slug = filePath.slice(filePath.lastIndexOf('/') + 1, -3);
    createPage(
      {
        id: nanoid(),
        title: frontMatter.title,
        excerpt: frontMatter.description || '',
        slug,
        parentId: contentId,
        order: frontMatter.order || 0,
        useCustomLayout: false,
        allowChildren: false,
        hideInNav: false,
        noIndex: false,
        childPageMetaType: null,
        pageMeta: null,
        keywords: frontMatter.keywords?.map((kw) => kw.toString()) || [],
        hasSeparatorInNav: false,
      },
      readme,
    );
  });

// Migrate foundations: Contributing
const contributingIndexFile = fs.readFileSync(
  'content/contributing/index.md',
  'utf8',
);
const {readme: contributingReadme, frontMatter: contributingFrontMatter} =
  parseMarkdown(contributingIndexFile);
const contributingId = nanoid();
createPage(
  {
    id: contributingId,
    title: contributingFrontMatter.title,
    excerpt: contributingFrontMatter.description,
    slug: 'contributing',
    parentId: null,
    order: contributingFrontMatter.order || 0,
    useCustomLayout: false,
    allowChildren: true,
    hideInNav: false,
    noIndex: false,
    childPageMetaType: null,
    pageMeta: null,
    keywords:
      contributingFrontMatter.keywords?.map((kw) => kw.toString()) || [],
    hasSeparatorInNav: true,
  },
  contributingReadme,
);
const contributingFilePaths = globby.sync(`content/contributing/*.md`);
contributingFilePaths
  .filter((filePath) => !filePath.endsWith('index.md'))
  .forEach((filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    const {readme, frontMatter} = parseMarkdown(file);
    const slug = filePath.slice(filePath.lastIndexOf('/') + 1, -3);
    createPage(
      {
        id: nanoid(),
        title: frontMatter.title,
        excerpt: frontMatter.description || '',
        slug,
        parentId: contributingId,
        order: frontMatter.order || 0,
        useCustomLayout: false,
        allowChildren: false,
        hideInNav: false,
        noIndex: false,
        childPageMetaType: null,
        pageMeta: null,
        keywords: frontMatter.keywords?.map((kw) => kw.toString()) || [],
        hasSeparatorInNav: false,
      },
      readme,
    );
  });

// Migrate foundtions: Design
const designIndexFile = fs.readFileSync('content/design/index.md', 'utf8');
const {readme: designReadme, frontMatter: designFrontMatter} =
  parseMarkdown(designIndexFile);
const designId = nanoid();
createPage(
  {
    id: designId,
    title: designFrontMatter.title,
    excerpt: designFrontMatter.description,
    slug: 'design',
    parentId: null,
    order: designFrontMatter.order || 0,
    useCustomLayout: true,
    allowChildren: true,
    hideInNav: false,
    noIndex: false,
    childPageMetaType: null,
    pageMeta: null,
    keywords: designFrontMatter.keywords?.map((kw) => kw.toString()) || [],
    hasSeparatorInNav: false,
  },
  designReadme,
);
const designFilePaths = globby.sync(`content/design/*.md`);
designFilePaths
  .filter((filePath) => !filePath.endsWith('index.md'))
  .forEach((filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    const {readme, frontMatter} = parseMarkdown(file);
    const slug = filePath.slice(filePath.lastIndexOf('/') + 1, -3);
    createPage(
      {
        id: nanoid(),
        title: frontMatter.title,
        excerpt: frontMatter.description,
        slug,
        parentId: designId,
        order: frontMatter.order || 0,
        useCustomLayout: false,
        allowChildren: false,
        hideInNav: false,
        noIndex: false,
        childPageMetaType: null,
        pageMeta: null,
        keywords: frontMatter.keywords?.map((kw) => kw.toString()) || [],
        hasSeparatorInNav: false,
      },
      readme,
    );
  });

// Migrate foundations: Foundations
const foundationsIndexFile = fs.readFileSync(
  'content/foundations/index.md',
  'utf8',
);
const {readme: foundationsReadme, frontMatter: foundationsFrontMatter} =
  parseMarkdown(foundationsIndexFile);
const foundationsId = nanoid();
createPage(
  {
    id: foundationsId,
    title: foundationsFrontMatter.title,
    excerpt: foundationsFrontMatter.description,
    slug: 'foundations',
    parentId: null,
    order: foundationsFrontMatter.order || 0,
    useCustomLayout: true,
    allowChildren: true,
    hideInNav: false,
    noIndex: false,
    childPageMetaType: null,
    pageMeta: null,
    keywords: foundationsFrontMatter.keywords?.map((kw) => kw.toString()) || [],
    hasSeparatorInNav: true,
  },
  foundationsReadme,
);
const foundationsFilePaths = globby.sync(`content/foundations/*.md`);
foundationsFilePaths
  .filter((filePath) => !filePath.endsWith('index.md'))
  .forEach((filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    const {readme, frontMatter} = parseMarkdown(file);
    const slug = filePath.slice(filePath.lastIndexOf('/') + 1, -3);
    createPage(
      {
        id: nanoid(),
        title: frontMatter.title,
        excerpt: frontMatter.description,
        slug,
        parentId: foundationsId,
        order: frontMatter.order || 0,
        useCustomLayout: false,
        allowChildren: false,
        hideInNav: false,
        noIndex: false,
        childPageMetaType: null,
        pageMeta: null,
        keywords: frontMatter.keywords?.map((kw) => kw.toString()) || [],
        hasSeparatorInNav: false,
      },
      readme,
    );
  });

// Migrate foundations: Getting started
const gettingStartedIndexFile = fs.readFileSync(
  'content/getting-started/index.md',
  'utf8',
);
const {readme: gettingStartedReadme, frontMatter: gettingStartedFrontMatter} =
  parseMarkdown(gettingStartedIndexFile);
const gettingStartedId = nanoid();
createPage(
  {
    id: gettingStartedId,
    title: gettingStartedFrontMatter.title,
    excerpt: gettingStartedFrontMatter.description,
    slug: 'getting-started',
    parentId: null,
    order: gettingStartedFrontMatter.order,
    useCustomLayout: false,
    allowChildren: true,
    hideInNav: false,
    noIndex: false,
    childPageMetaType: null,
    pageMeta: null,
    keywords: gettingStartedFrontMatter.keywords?.map((kw) => kw.toString()),
    hasSeparatorInNav: false,
  },
  gettingStartedReadme,
);
const gettingStartedFilePaths = globby.sync(`content/getting-started/*.md`);
gettingStartedFilePaths
  .filter((filePath) => !filePath.endsWith('index.md'))
  .forEach((filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    const {readme, frontMatter} = parseMarkdown(file);
    const slug = filePath.slice(filePath.lastIndexOf('/') + 1, -3);

    createPage(
      {
        id: nanoid(),
        title: frontMatter.title,
        excerpt: frontMatter.description,
        slug,
        parentId: gettingStartedId,
        order: frontMatter.order,
        useCustomLayout: false,
        allowChildren: false,
        hideInNav: false,
        noIndex: false,
        childPageMetaType: null,
        pageMeta: null,
        keywords: frontMatter.keywords?.map((kw) => kw.toString()),
        hasSeparatorInNav: false,
      },
      readme,
    );
  });

// Migrate tools

// Migrate What's new

// Migrate Icons
createPage({
  id: nanoid(),
  title: 'Icons',
  excerpt: '',
  slug: 'icons',
  parentId: null,
  order: 9,
  useCustomLayout: true,
  allowChildren: false,
  hideInNav: false,
  noIndex: false,
  childPageMetaType: null,
  pageMeta: null,
  keywords: [],
  hasSeparatorInNav: false,
});

// Migrate tokens
createPage({
  id: nanoid(),
  title: 'Tokens',
  excerpt: '',
  slug: 'tokens',
  parentId: null,
  order: 8,
  useCustomLayout: true,
  allowChildren: false,
  hideInNav: false,
  noIndex: false,
  childPageMetaType: null,
  pageMeta: null,
  keywords: [],
  hasSeparatorInNav: false,
});

// Create file
const file = `import { Content } from './components/Editor/types';

/*
  Automatically generated file (created by /api/editor.tsx).
  Do not edit by hand.
*/

const pages : Content['pages'] = ${JSON.stringify(pages, null, 2)};

const images : Content['images'] = [];

export const content : Content = { pages, images };
`;

fs.writeFileSync('src/content.ts', file, 'utf8');
