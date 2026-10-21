import { defineType, defineField } from 'sanity';
import { portableTextBlock } from './portable-text';

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
          { title: 'Events (general)', value: 'events' },
          { title: 'Convention', value: 'convention' },
          { title: 'Birthday Party', value: 'birthday' },
          { title: 'Quinceañera', value: 'quinceanera' },
          { title: 'Social Media Reel', value: 'social' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'muxPlaybackId', type: 'string', title: 'Mux Playback ID' }),
    defineField({
      name: 'youtubeUrl',
      type: 'url',
      title: 'YouTube URL',
      description:
        'For client-owned content (music videos, etc.) where the original lives on YouTube. If set, this is used instead of the Mux Playback ID.',
    }),
    defineField({
      name: 'moreVideos',
      title: 'More Videos',
      description:
        'Extra videos from the same production — trailers, BTS cuts, teasers. Each plays in its own block under the main video.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'extraVideo',
          fields: [
            { name: 'label', type: 'string', title: 'Eyebrow label', description: 'e.g. "EPISODE 2 · OFFICIAL TRAILER"' },
            { name: 'title', type: 'string', title: 'Title', validation: (r) => r.required() },
            { name: 'muxPlaybackId', type: 'string', title: 'Mux Playback ID', validation: (r) => r.required() },
            {
              name: 'aspect',
              type: 'string',
              title: 'Shape',
              options: { list: [{ title: 'Landscape 16:9', value: 'video' }, { title: 'Vertical 9:16', value: 'vertical' }] },
              initialValue: 'video',
            },
            { name: 'poster', type: 'image', title: 'Poster', description: 'Optional. Falls back to a frame from the video.' },
            { name: 'caption', type: 'text', rows: 2, title: 'Caption' },
          ],
          preview: { select: { title: 'title', subtitle: 'label' } },
        },
      ],
    }),
    defineField({ name: 'poster', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    defineField({ name: 'body', type: 'array', of: [portableTextBlock] }),
    defineField({
      name: 'processNotes',
      title: 'Process Notes',
      description:
        'Behind-the-scenes commentary. Short structured prose — "The Challenge", "The Approach", "Craft Notes", etc. Shows up on the case study detail page in a dedicated section.',
      type: 'array',
      of: [portableTextBlock],
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
