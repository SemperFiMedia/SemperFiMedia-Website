import { defineType, defineField } from 'sanity';

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'logoDark',
      type: 'image',
      title: 'Logo (for dark backgrounds)',
      options: { hotspot: true },
    }),
    defineField({ name: 'website', type: 'url' }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show in homepage logo wall',
    }),
    defineField({ name: 'order', type: 'number' }),
  ],
});
