import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'author', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'authorTitle', type: 'string' }),
    defineField({
      name: 'source',
      type: 'string',
      options: { list: ['Google', 'Direct', 'LinkedIn'] },
    }),
    defineField({ name: 'rating', type: 'number', validation: (r) => r.min(1).max(5) }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'reviewDate', type: 'date' }),
  ],
});
