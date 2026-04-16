import { defineType, defineField } from 'sanity';
import { portableTextBlock } from './portable-text';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'One-to-two sentence summary that renders on the blog index and as the meta description.',
    }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'body',
      type: 'array',
      of: [portableTextBlock, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (r) => r.required() }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Gear & Cameras', value: 'gear' },
          { title: 'Wedding Guides', value: 'weddings' },
          { title: 'Behind the Scenes', value: 'bts' },
          { title: 'Industry & Craft', value: 'industry' },
          { title: 'How-To', value: 'how-to' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      type: 'string',
      initialValue: 'TJ Gutierrez',
    }),
    defineField({
      name: 'authorTitle',
      type: 'string',
      initialValue: 'Founder · Marine Certified Cinematographer',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
      description: 'Pin to the top of the blog index.',
    }),
    defineField({
      name: 'readingTime',
      type: 'number',
      description: 'Approximate reading time in minutes.',
    }),
    defineField({
      name: 'seoTitle',
      type: 'string',
      description: 'Override for the browser tab title and Google search result. Leave blank to use post title.',
    }),
    defineField({
      name: 'seoDescription',
      type: 'text',
      rows: 2,
      description: 'Override for the meta description. Leave blank to use excerpt.',
    }),
  ],
});
