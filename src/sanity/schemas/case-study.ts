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
          { title: 'Events & Conventions', value: 'events' },
          { title: 'Social Media Reel', value: 'social' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'muxPlaybackId', type: 'string', title: 'Mux Playback ID' }),
    defineField({ name: 'poster', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'processNotes',
      title: 'Process Notes',
      description:
        'Behind-the-scenes commentary. Short structured prose — "The Challenge", "The Approach", "Craft Notes", etc. Shows up on the case study detail page in a dedicated section.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'behindTheScenes',
      title: 'Behind-the-Scenes Gallery',
      description:
        'Stills from the shoot — on-set, lighting setups, director monitor, client shots. Renders in a gallery grid on the case study detail page.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: 'Caption' },
            { name: 'alt', type: 'string', title: 'Alt text', validation: (r) => r.required() },
          ],
        },
      ],
    }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  ],
});
