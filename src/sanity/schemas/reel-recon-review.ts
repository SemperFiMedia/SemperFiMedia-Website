import { defineType, defineField } from 'sanity';
import { portableTextBlock } from './portable-text';

export const reelReconReview = defineType({
  name: 'reelReconReview',
  title: 'Reel Recon Review',
  type: 'document',
  fields: [
    defineField({ name: 'filmTitle', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'filmTitle', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'anticipated',
      options: {
        layout: 'radio',
        list: [
          { title: 'Anticipated (not yet reviewed)', value: 'anticipated' },
          { title: 'Reviewed (full rating live)', value: 'reviewed' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'poster',
      title: 'Film Poster (portrait)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image (landscape, optional — falls back to poster)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'releaseDate', type: 'date' }),
    defineField({ name: 'runtime', title: 'Runtime (minutes)', type: 'number' }),
    defineField({ name: 'director', type: 'string' }),
    defineField({ name: 'genres', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'whereToWatch',
      title: 'Where to Watch',
      type: 'string',
      description: 'e.g. "In theaters", "Disney+", "Netflix".',
    }),
    defineField({
      name: 'overallRating',
      title: 'Overall Rating (0–10)',
      type: 'number',
      description: 'Leave blank while status is Anticipated.',
      validation: (r) => r.min(0).max(10),
    }),
    defineField({
      name: 'subRatings',
      title: 'Craft Sub-Ratings (0–10)',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'cinematography',
          type: 'number',
          validation: (r) => r.min(0).max(10),
        }),
        defineField({
          name: 'actionRealism',
          title: 'Action / Realism',
          type: 'number',
          validation: (r) => r.min(0).max(10),
        }),
        defineField({ name: 'story', type: 'number', validation: (r) => r.min(0).max(10) }),
        defineField({ name: 'sound', type: 'number', validation: (r) => r.min(0).max(10) }),
      ],
    }),
    defineField({
      name: 'verdict',
      type: 'string',
      description: 'One punchy line. While Anticipated, use "Pending — full review on release."',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'Renders on the index and as the meta description.',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        portableTextBlock,
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: 'Describe the image for SEO and screen readers.',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption shown beneath the image.',
            }),
          ],
        },
      ],
    }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (r) => r.required() }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
      description: 'Pin to the top of the Reel Recon index.',
    }),
    defineField({ name: 'author', type: 'string', initialValue: 'TJ Gutierrez' }),
    defineField({
      name: 'authorTitle',
      type: 'string',
      initialValue: 'Founder · Marine Cinematographer',
    }),
    defineField({
      name: 'readingTime',
      type: 'number',
      description: 'Approximate reading time in minutes.',
    }),
    defineField({
      name: 'seoTitle',
      type: 'string',
      description: 'Override for the tab title and Google result. Blank uses film title.',
    }),
    defineField({
      name: 'seoDescription',
      type: 'text',
      rows: 2,
      description: 'Override for the meta description. Blank uses excerpt.',
    }),
  ],
});
