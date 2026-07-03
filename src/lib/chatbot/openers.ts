// All visitor-facing chatbot copy, per language. Pure data + lookup only —
// this module is bundled into the client widget, so it MUST NOT import
// server-only modules (env, postgres, SDKs). Per-client customization for the
// resold chatbot happens by swapping this file's contents.

export type ChatStrings = {
  opener: string;
  defaultGreeting: string;
  exitIntent: string;
  afterHoursNote: string;
  teaser: string;
  dismissLabel: string;
};

const EN_DEFAULT_GREETING =
  "Howdy — I'm the Semper Fi Media concierge. Ask me about any of our services, pricing, or process. What can I help you find?";

const EN_EXIT_INTENT =
  "Hey — before you head out: want me to send over our full pricing sheet or a link to recent work? Drop your name and the best email or number and I'll get it to you, and have TJ follow up personally. No pressure.";

const EN_AFTER_HOURS_NOTE =
  " Quick heads-up — it's after hours here in Texas, so TJ's off the clock. Leave your info and he'll follow up first thing, by 9 AM.";

const EN_TEASER = 'Before you go — want pricing sent to you?';

const EN_DISMISS_LABEL = 'Dismiss';

// Most specific paths first so /corporate/music-videos wins over /corporate.
// Match rule: exact, or prefix + '/'. The '/' entry only matches exactly.
const EN_OPENERS: Array<[string, string]> = [
  [
    '/corporate/music-videos',
    "Music video? The standard package is $3,000 flat with 14-day delivery — or we build something custom. Want me to walk you through it?",
  ],
  [
    '/corporate/mission-and-tactical',
    "First responder, firearm, or veteran-owned brand? That's dead-center in our wheelhouse. Tell me about the project and I'll point you to the right package.",
  ],
  [
    '/corporate/faith-and-community',
    "Filming for a church, ministry, or nonprofit? Tell me about your story and I'll break down what a brand film runs.",
  ],
  [
    '/corporate/small-business',
    "Small-business brand films start at $1,500. Tell me what you're building and I'll find the right fit.",
  ],
  [
    '/corporate/conventions',
    "Covering a convention or event? I can scope coverage and pricing — what's the event, and when?",
  ],
  [
    '/corporate/birthday-parties',
    "Filming a birthday party? Give me the vibe and the date and I'll walk you through coverage options.",
  ],
  [
    '/corporate/quinceaneras',
    "Planning a quinceañera film? Let's talk about your day — I can break down coverage and pricing.",
  ],
  [
    '/corporate',
    "Working on a brand film or commercial? Tell me about your project and I'll break down which tier fits.",
  ],
  [
    '/weddings',
    "Looking at wedding films? I can break down the three packages, check if your date's open, or talk through what matters most for your day. Where do you want to start?",
  ],
  [
    '/social-reels',
    "Need vertical reels cut from your footage? I'll walk you through turnaround and pricing — what are you working with?",
  ],
  [
    '/pricing',
    "You're on the pricing page — want me to help you figure out which package actually fits what you need?",
  ],
  [
    '/film-production',
    "Production day rates run $1,500 (solo operator) to $5,500 (full crew) — and the Build Your Production Day configurator on this page prices your exact setup live. Want help scoping your shoot?",
  ],
  [
    '/work',
    "Browsing the portfolio? If something catches your eye, tell me which one — I'll break down what a film like it runs and how we'd approach yours.",
  ],
  [
    '/shoots',
    "That's our live feed of recent shoots — weddings, brand films, music videos, tactical work. Planning something yourself? Tell me what and when.",
  ],
  [
    '/about',
    "That's our story — Marine-led, one filmmaker carrying every project start to finish. What brought you in today? I can point you to the right service or pricing.",
  ],
  [
    '/contact',
    "Ready to talk to TJ? Before you book, I can answer pricing questions or brief him on your project so the call hits the ground running. What are you working on?",
  ],
  [
    '/refer',
    "The referral deal is simple: send an engaged friend our way, and once their wedding is filmed and paid you get $200 back. Want me to walk you through how it works?",
  ],
  [
    '/',
    "Howdy — I'm the Semper Fi Media concierge. Marine-led cinematic video and custom websites out of DFW: weddings, brand films, events, music videos, sites. What brought you in today?",
  ],
];

const ES_DEFAULT_GREETING =
  '¡Hola! Soy el conserje de Semper Fi Media. Pregúntame sobre nuestros servicios, precios o proceso. ¿Qué buscas hoy?';

const ES_EXIT_INTENT =
  'Oye — antes de que te vayas: ¿quieres que te mande la lista completa de precios o ejemplos de nuestro trabajo? Déjame tu nombre y tu correo o número, y TJ te contacta personalmente. Sin compromiso.';

const ES_AFTER_HOURS_NOTE =
  ' Un aviso rápido — ya estamos fuera de horario aquí en Texas, así que TJ no está disponible ahora mismo. Déjame tus datos y te contacta mañana a primera hora, para las 9 AM.';

const ES_TEASER = 'Antes de irte — ¿te mando los precios?';

const ES_DISMISS_LABEL = 'Cerrar';

// Keyed on the path with the '/es' language prefix stripped — getChatStrings
// normalizes '/es' → '/' and '/es/x' → '/x' before lookup, so the '/'-exact-only
// guard in lookupOpener protects the Spanish home entry the same way as English.
const ES_OPENERS: Array<[string, string]> = [
  [
    '/weddings',
    '¿Buscas video para tu boda? Tenemos tres paquetes desde $3,500. Te puedo explicar cada uno o revisar si tu fecha está libre. ¿Por dónde empezamos?',
  ],
  [
    '/quinceaneras',
    '¿Planeando los quince? Cuéntame de tu celebración y te explico la cobertura y los precios — filmamos tu día como una película.',
  ],
  [
    '/about',
    'Esa es nuestra historia — un Marine detrás de cada cámara, en cada proyecto. ¿Qué te trae por aquí? Te puedo orientar sobre servicios y precios.',
  ],
  [
    '/contact',
    '¿Listo para hablar con TJ? Antes de reservar, te puedo responder preguntas de precios o pasarle los detalles de tu proyecto. ¿Qué estás planeando?',
  ],
  [
    '/',
    '¡Hola! Soy el conserje de Semper Fi Media. Video cinematográfico dirigido por un veterano de la Marina, aquí en DFW — bodas, quinceañeras, videos para tu negocio o tu música. ¿En qué te puedo ayudar?',
  ],
];

function lookupOpener(map: Array<[string, string]>, p: string, fallback: string): string {
  for (const [prefix, text] of map) {
    if (p === prefix || (prefix !== '/' && p.startsWith(prefix + '/'))) return text;
  }
  return fallback;
}

export function getChatStrings(pathname: string): ChatStrings {
  const p = pathname || '/';
  const isSpanish = p === '/es' || p.startsWith('/es/');
  if (isSpanish) {
    const rest = p === '/es' ? '/' : p.slice('/es'.length);
    return {
      opener: lookupOpener(ES_OPENERS, rest, ES_DEFAULT_GREETING),
      defaultGreeting: ES_DEFAULT_GREETING,
      exitIntent: ES_EXIT_INTENT,
      afterHoursNote: ES_AFTER_HOURS_NOTE,
      teaser: ES_TEASER,
      dismissLabel: ES_DISMISS_LABEL,
    };
  }
  return {
    opener: lookupOpener(EN_OPENERS, p, EN_DEFAULT_GREETING),
    defaultGreeting: EN_DEFAULT_GREETING,
    exitIntent: EN_EXIT_INTENT,
    afterHoursNote: EN_AFTER_HOURS_NOTE,
    teaser: EN_TEASER,
    dismissLabel: EN_DISMISS_LABEL,
  };
}
