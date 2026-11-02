import { defineType, defineField } from 'sanity';

/**
 * One shoot (or one recurring model) on a client reels page such as
 * /social-reels/fleming-photos. Shoots are listed newest first by shootDate,
 * and the reels inside a shoot newest first by shotAt, so adding a reel from
 * the Studio puts it where it belongs without touching code.
 */
export const reelShoot = defineType({
  name: 'reelShoot',
  title: 'Reel Shoot',
  type: 'document',
  fields: [
    defineField({
      name: 'client',
      type: 'string',
      description: 'Exactly as the client page expects it, e.g. "Fleming Photos".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Section heading',
      description: 'e.g. "Whitley." or "Hats, boots, lace, and leopard."',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Used for the jump links on the page.',
      options: { source: 'nav', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nav',
      type: 'string',
      title: 'Jump bar name',
      description: 'Short, e.g. "Whitley", "Planet V".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      title: 'Eyebrow label',
      description: 'e.g. "SHOOT · PLANET V · 2025". Put the year in it.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'blurb', type: 'text', rows: 2 }),
    defineField({
      name: 'shootDate',
      type: 'date',
      description: 'Newest shoot goes to the top of the page. For a recurring model, use the date of her latest work.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Lead when dates tie',
      description: 'When two sections share a shoot date, the featured one goes first. Use for a recurring model.',
      initialValue: false,
    }),
    defineField({
      name: 'reels',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'reel',
          fields: [
            { name: 'title', type: 'string', validation: (r) => r.required() },
            { name: 'credit', type: 'string', description: 'Model or subject, shown under the reel.' },
            {
              name: 'muxPlaybackId',
              type: 'string',
              title: 'Mux Playback ID',
              validation: (r) => r.required(),
            },
            {
              name: 'aspect',
              type: 'string',
              title: 'Shape',
              options: {
                list: [
                  { title: 'Vertical 9:16', value: 'vertical' },
                  { title: 'Landscape 16:9', value: 'video' },
                ],
              },
              initialValue: 'vertical',
            },
            {
              name: 'cover',
              type: 'image',
              description: 'Cover in the client template. Falls back to a frame from the video.',
            },
            {
              name: 'shotAt',
              type: 'date',
              title: 'Shot on',
              description: 'Newest first within the section. Leave blank to keep list order.',
            },
          ],
          preview: { select: { title: 'title', subtitle: 'credit', media: 'cover' } },
        },
      ],
    }),
  ],
  orderings: [
    { title: 'Newest shoot first', name: 'shootDateDesc', by: [{ field: 'shootDate', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'label', media: 'reels.0.cover' },
  },
});
