import { defineType, defineField } from 'sanity';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'client', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Mission & Tactical', value: 'tactical' },
          { title: 'Faith & Community', value: 'faith' },
          { title: 'Small Business', value: 'small-business' },
          { title: 'Music Video', value: 'music' },
          { title: 'Wedding', value: 'wedding' },
          { title: 'Real Estate', value: 'real-estate' },
          { title: 'TV / Broadcast', value: 'tv' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'muxPlaybackId', type: 'string', title: 'Mux Playback ID' }),
    defineField({ name: 'poster', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  ],
});
