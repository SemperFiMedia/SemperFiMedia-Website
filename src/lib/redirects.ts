export const REDIRECTS = [
  { source: '/services-5', destination: '/corporate', permanent: true },
  { source: '/cinema-wedding', destination: '/weddings', permanent: true },
  { source: '/faqs', destination: '/about#faq', permanent: true },
  { source: '/agency-services', destination: '/corporate', permanent: true },
  { source: '/branded-content', destination: '/corporate', permanent: true },
  { source: '/experiential-marketing', destination: '/corporate', permanent: true },
  { source: '/a-la-carte-services', destination: '/pricing', permanent: true },
  { source: '/wedding-videos', destination: '/weddings', permanent: true },
  { source: '/party-event-videos', destination: '/corporate', permanent: true },
  { source: '/music-videos', destination: '/corporate/music-videos', permanent: true },
  { source: '/drone-capture-real-estate', destination: '/corporate', permanent: true },
  { source: '/real-estate-videos', destination: '/corporate', permanent: true },
  // The artist is Arron Michael. These two case studies were published under a
  // misspelled slug; the old addresses keep their links and search standing.
  { source: '/work/aaron-michael-make-it-work', destination: '/work/arron-michael-make-it-work', permanent: true },
  { source: '/work/aaron-michael-feels-like-the-first-time', destination: '/work/arron-michael-feels-like-the-first-time', permanent: true },
];
