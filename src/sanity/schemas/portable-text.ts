// Shared Portable Text block definition.
//
// Overrides Sanity's default link annotation so authors can link to internal
// routes ("/pricing", "/weddings") as well as external URLs (http/https),
// email (mailto:), and phone (tel:). Sanity's default URL validator rejects
// relative paths, which breaks internal blog/case-study linking.

export const portableTextBlock = {
  type: 'block',
  marks: {
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          {
            name: 'href',
            type: 'string',
            title: 'URL',
            validation: (Rule: { required: () => { custom: (fn: (value?: string) => true | string) => unknown } }) =>
              Rule.required().custom((value?: string) => {
                if (!value) return 'URL is required';
                if (
                  value.startsWith('/') ||
                  /^https?:\/\//.test(value) ||
                  value.startsWith('mailto:') ||
                  value.startsWith('tel:')
                ) {
                  return true;
                }
                return 'URL must start with /, http://, https://, mailto:, or tel:';
              }),
          },
        ],
      },
    ],
  },
};
