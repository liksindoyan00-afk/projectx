/* English copy. Shape of this object defines the Dict type used for all languages.
   Placeholders: {days} reply time, {n} count, {email} address. */

const en = {
  langName: 'English',
  skip: 'Skip to content',
  nav: {
    services: 'Services',
    process: 'Process',
    results: 'Results',
    about: 'About',
    faq: 'FAQ',
    contact: 'Contact',
  },
  header: {
    home: 'BridgePath home',
    enquire: 'Enquire',
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
    where: 'Online worldwide · In person in Yerevan',
  },
  footer: {
    tagline: 'Senior admissions advice for students applying to universities abroad.',
    pages: 'Pages',
    contact: 'Contact',
    where: 'Online worldwide · In person in Yerevan',
    privacy: 'Privacy policy',
    wa: 'Message on WhatsApp',
    enquire: 'Enquire',
  },
  cta: {
    title: 'Begin with an honest assessment. A conversation costs nothing.',
    button: 'Enquire',
  },
  stat: { of: 'of', ofItalic: true },
  meta: {
    home: {
      title: 'BridgePath — Academic Advisory & Consulting',
      description:
        'Full-service university admissions advisory in Yerevan and online: profile evaluation, shortlists, essays and applications for bachelor’s, master’s and funded PhD.',
    },
    services: {
      title: 'Services — Profile Evaluation and Full Admission Consulting | BridgePath',
      description: 'Two ways to begin: a written profile evaluation, or full admission consulting through to the final decision.',
    },
    process: {
      title: 'Process — Fourteen weeks, mapped | BridgePath',
      description: 'How an application comes together, stage by stage: evaluation, roadmap, applications, letters and interviews.',
    },
    results: {
      title: 'Results — Where our students were admitted | BridgePath',
      description: 'Admissions results, universities and funding outcomes for BridgePath students.',
    },
    about: {
      title: 'About — A deliberately small advisory practice | BridgePath',
      description: 'Who we are, how we work and the families we serve, online worldwide and in person in Yerevan.',
    },
    faq: {
      title: 'FAQ — Questions families ask us | BridgePath',
      description: 'Answers about services, fees, timing, essays and results.',
    },
    contact: {
      title: 'Contact — Send an enquiry | BridgePath',
      description: 'Tell us where you are starting from. A conversation costs nothing.',
    },
    privacy: { title: 'Privacy policy | BridgePath', description: 'How BridgePath collects and uses your information.' },
    notFound: { title: 'Page not found | BridgePath', description: 'This page is not on the map.' },
  },

  home: {
    eyebrow: 'Admission season 2026/27',
    title: 'A place at a top university is not a lottery. It is a process.',
    lead: 'Full-service admissions advisory — from the first honest assessment to the letter that says yes.',
    primary: 'Request an assessment',
    secondary: 'How we work',
    heroImageAlt: 'A quiet university library in natural light',
    hard: {
      eyebrow: 'Why this is hard',
      title: 'Admissions abroad leave little room for error',
      items: [
        {
          title: 'One application season',
          body: 'Most universities accept applications once a year. Every test, document and deadline has to land inside the same few months.',
        },
        {
          title: 'Rejection is rarely about grades',
          body: 'Strong students are turned down for an unbalanced shortlist, a generic essay or a missed detail, more often than for their marks.',
        },
        {
          title: 'The next chance is a year away',
          body: 'An application that does not succeed usually means waiting a full cycle to try again.',
        },
      ],
    },
    who: {
      eyebrow: 'Who we work with',
      title: 'Students at three stages, and the families behind them',
      items: [
        {
          tag: 'Bachelor’s',
          title: 'School leavers',
          body: 'Final-year students applying for undergraduate study in the US, the UK and Europe.',
        },
        {
          tag: 'Master’s · Funded PhD',
          title: 'Undergraduates',
          body: 'Students applying for master’s programmes or fully funded doctoral positions abroad.',
        },
        {
          tag: 'Families',
          title: 'Parents',
          body: 'Families who want a clear plan, realistic expectations and one senior adviser accountable throughout.',
        },
      ],
    },
    ways: {
      eyebrow: 'Two ways to begin',
      title: 'Start with an assessment, or with the whole process',
      items: [
        {
          title: 'Profile Evaluation',
          body: 'A written assessment of where the student stands today and which universities are realistic.',
        },
        {
          title: 'Full Admission Consulting',
          body: 'Strategy, shortlist, essays, documents and interviews, managed with you through to the final decision.',
        },
      ],
      button: 'Request pricing',
    },
    results: {
      eyebrow: 'Results',
      caption: 'students admitted to at least one target university',
      dotsLabel: '{a} of {t} students admitted',
      where: 'Where our students have been admitted',
      all: 'See all results',
    },
    testimonialPlaceholder: {
      quote: '[Testimonial quote: two or three sentences in the student’s or parent’s own words about the process and the outcome.]',
      author: '[First name]',
      university: '[University]',
    },
  },

  services: {
    eyebrow: 'Services',
    title: 'Two ways to begin.',
    titleEm: 'Most families start with the first.',
    jump: [
      { title: 'Profile Evaluation', sub: 'Where the student stands, and what is realistic' },
      { title: 'Full Admission Consulting', sub: 'The whole process, through to the final decision' },
    ],
    one: {
      label: 'Service I',
      title: 'Profile Evaluation',
      lead: 'A written assessment of where the student stands today and which universities are realistic.',
      steps: [
        { title: 'In-depth interview', body: 'A long conversation with the student and parents about goals, interests, constraints and timeline.' },
        { title: 'Document review', body: 'Transcripts, test scores, activities and any existing drafts, read in full.' },
        { title: 'Chance assessment', body: 'An honest view of the student’s position at each university under consideration.' },
        { title: 'Alternatives', body: 'Where a target is out of reach, realistic options that keep the same level of ambition.' },
      ],
      answer: 'It ends with a straight answer to one question:',
      answerEm: 'is this list realistic?',
    },
    two: {
      label: 'Service II',
      title: 'Full Admission Consulting',
      lead: 'Strategy, shortlist, essays, documents and interviews, managed with you through to the final decision.',
      includedLabel: 'Included',
      included: [
        { title: 'Full profile evaluation', note: 'Everything in Service I' },
        { title: 'Individualised roadmap', note: '' },
        { title: 'University list construction', note: 'Reach, target and safe' },
        { title: 'Complete application file', note: '' },
        { title: 'Personal statements and essays', note: '' },
        { title: 'Deadline management', note: '' },
        { title: 'Submission and follow-up', note: '' },
      ],
      scopeLabel: 'Priced by scope',
      scopeNote: 'Added only where the student needs it',
      scope: [
        'Exam preparation through our tutor network',
        'Scholarship and funding research',
        'Recommendation letter preparation',
        'Interview preparation',
      ],
    },
    compare: {
      eyebrow: 'Side by side',
      title: 'What each service includes',
      col0: 'What’s included',
      included: 'Included',
      byScope: 'By scope',
      notIncluded: 'Not included',
      rows: [
        { group: 'Evaluation', label: 'In-depth interview', p: 'y', f: 'y' },
        { group: '', label: 'Document review', p: 'y', f: 'y' },
        { group: '', label: 'Chance assessment', p: 'y', f: 'y' },
        { group: '', label: 'Alternatives', p: 'y', f: 'y' },
        { group: 'Applications', label: 'Individualised roadmap', p: 'n', f: 'y' },
        { group: '', label: 'University list construction (reach / target / safe)', p: 'n', f: 'y' },
        { group: '', label: 'Complete application file', p: 'n', f: 'y' },
        { group: '', label: 'Personal statements and essays', p: 'n', f: 'y' },
        { group: '', label: 'Deadline management', p: 'n', f: 'y' },
        { group: '', label: 'Submission and follow-up', p: 'n', f: 'y' },
        { group: 'Priced by scope', label: 'Exam preparation through our tutor network', p: 'n', f: 's' },
        { group: '', label: 'Scholarship and funding research', p: 'n', f: 's' },
        { group: '', label: 'Recommendation letter preparation', p: 'n', f: 's' },
        { group: '', label: 'Interview preparation', p: 'n', f: 's' },
      ],
      fees: 'Fees are confirmed in writing after the evaluation, once the scope is known.',
    },
    button: 'Request pricing',
  },

  process: {
    eyebrow: 'Process',
    title: 'Fourteen weeks, mapped.',
    legendCore: 'Core stage',
    legendOptional: 'Optional, priced by scope',
    hint: 'Select a stage to see what happens.',
    weekShort: 'W',
    stage: 'Stage',
    optional: 'Optional',
    optionalScope: 'Optional · priced by scope',
    happens: 'What happens',
    receives: 'What the family receives',
    stages: [
      {
        from: 1, to: 2, weeks: 'Weeks 1–2', title: 'Introduction and evaluation', optional: false,
        happens: 'An interview with the student and parents, a full review of documents and results, and a candid assessment of chances.',
        receives: 'A written profile evaluation and a first view of which universities are realistic.',
      },
      {
        from: 3, to: 3, weeks: 'Week 3', title: 'Individualised roadmap', optional: false,
        happens: 'We agree the university list, balanced across reach, target and safe, and set every deadline and task.',
        receives: 'A written roadmap: the list, the calendar, and who is responsible for each step.',
      },
      {
        from: 4, to: 10, weeks: 'Weeks 4–10', title: 'Application preparation', optional: false,
        happens: 'Personal statements and essays drafted and revised, application files assembled and checked, submissions made on schedule.',
        receives: 'Complete, submitted applications and a short progress note each week.',
      },
      {
        from: 11, to: 13, weeks: 'Weeks 11–13', title: 'Recommendation letters', optional: true,
        happens: 'We brief referees and help structure their letters so they support the rest of the application.',
        receives: 'Referee briefing notes and a tracked record of every letter received.',
      },
      {
        from: 13, to: 14, weeks: 'Weeks 13–14', title: 'Interview preparation', optional: true,
        happens: 'Mock interviews modelled on each university’s format, with written feedback after every session.',
        receives: 'Feedback notes and prepared answers to the questions most likely to come up.',
      },
    ],
    when: {
      eyebrow: 'When to start',
      title: 'The earlier the better.',
      quote: 'A late start costs choices,',
      quoteEm: 'not just time.',
      body: 'Fourteen weeks is the working minimum. Starting earlier leaves room for testing, a considered shortlist and essays that go through several drafts. Starting late narrows the list to universities whose deadlines can still be met.',
    },
  },

  results: {
    eyebrow: 'Results',
    title: 'students admitted to at least one of their target universities',
    legendYes: 'Admitted to a target university',
    legendNo: 'Not admitted',
    admissions: 'Admissions',
    whereTitle: 'Where they went',
    graduateNote: 'Graduate admissions: {n}; the remainder undergraduate.',
    funding: {
      eyebrow: 'Funding',
      title: 'Almost every admitted student received financial support',
      partial: 'Partial award',
      full: 'Full ride',
    },
    testimonials: { eyebrow: 'In their words', title: 'Students and parents' },
    testimonialPlaceholder: {
      featured: '[Featured quote: three or four sentences in the student’s or parent’s own words about the process and the outcome.]',
      quote: '[Quote: two or three sentences in their own words.]',
      author: '[First name]',
      university: '[University]',
    },
  },

  about: {
    eyebrow: 'About · Who we are',
    title: 'A deliberately small advisory practice.',
    lead: 'For four years we have advised a limited number of students each cycle, working online with families worldwide and in person in Yerevan.',
    facts: ['Four years', 'Online worldwide', 'In person in Yerevan'],
    heroImageAlt: 'A reading room in early light',
    four: {
      eyebrow: 'How we are different',
      title: 'Four things that decide the outcome',
      items: [
        { title: 'Advisors who have been admitted themselves', body: 'Our advisors have been through the same admissions they now guide students through.' },
        { title: 'The honest assessment comes first', body: 'Before any plan, a clear view of where the student stands and what is realistic.' },
        { title: 'A deliberately small practice', body: 'We take on a limited number of students each cycle, so each one is advised personally.' },
        { title: 'We stay to the end', body: 'From the first meeting to the final decision, and the letters that follow.' },
      ],
    },
    principles: {
      eyebrow: 'Our principles',
      title: 'How we work with every family',
      items: [
        { title: 'Candour about chances', body: 'We tell families what we see, including when it is not what they hoped to hear.' },
        { title: 'No templates', body: 'Every list, essay and plan is written for one student.' },
        { title: 'One point of responsibility', body: 'One senior advisor is accountable for the whole application.' },
      ],
      guarantee: 'We do not guarantee admission.',
      guaranteeEm: 'No honest advisor can.',
      imageAlt: 'An annotated draft, books and a desk lamp',
    },
    markets: {
      eyebrow: 'Markets we serve',
      title: 'Families across six regions',
      body: 'Based in Yerevan. Consultations in English, Russian or Armenian, online or in person.',
      homeBase: 'Home base',
      items: [
        { name: 'Armenia', note: 'Home base', home: true },
        { name: 'Georgia', note: '', home: false },
        { name: 'Russia', note: '', home: false },
        { name: 'Central Asia', note: '', home: false },
        { name: 'Middle East', note: '', home: false },
        { name: 'East Asia', note: 'Applying to the US & Europe', home: false },
      ],
    },
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions families ask us',
    topics: 'Topics',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
    still: 'Still have a question?',
    groups: [
      {
        id: 'getting-started',
        name: 'Getting started',
        items: [
          { q: 'Do you work online or in person?', a: 'Both. We work online with families worldwide, and in person in Yerevan.' },
          { q: 'Which languages do you work in?', a: 'English, Russian and Armenian. Meetings can switch between them as the family prefers.' },
          { q: 'Can parents attend the meetings?', a: 'Yes. Parents are welcome at every meeting, and we always involve them in key decisions.' },
          {
            q: 'Which countries and universities do you cover?',
            a: 'Mainly the United States, the United Kingdom, Canada and Europe, along with international campuses such as NYU Abu Dhabi and NYU Shanghai.',
          },
        ],
      },
      {
        id: 'services-and-fees',
        name: 'Services and fees',
        items: [
          {
            q: 'What’s the difference between Profile Evaluation and Full Consulting?',
            a: 'Profile Evaluation is a written assessment of where the student stands and which universities are realistic. Full Admission Consulting includes that evaluation and then manages the whole application through to the final decision.',
          },
          {
            q: 'Why aren’t prices listed?',
            a: 'Fees depend on scope: the programme, the number of universities and any additional services. They are confirmed in writing after the evaluation, once the scope is known.',
          },
          { q: 'Do you help with scholarships?', a: 'Yes. Scholarship and funding research is available as part of Full Admission Consulting, priced by scope.' },
        ],
      },
      {
        id: 'process-and-timing',
        name: 'Process and timing',
        items: [
          { q: 'When should we start?', a: 'As early as possible. A late start costs choices, not just time. Our core process takes fourteen weeks.' },
          { q: 'Do you write the essays?', a: 'No. We guide and edit; the student writes. Admissions officers read for the student’s own voice, and so do we.' },
        ],
      },
      {
        id: 'results',
        name: 'Results',
        items: [
          {
            q: 'Do you guarantee admission?',
            a: 'No, and no honest advisor can: the final decision belongs to the university. What we control is the quality of the shortlist, the strength of each application and that every deadline is met.',
          },
        ],
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'A conversation costs nothing.',
    reply: 'We reply within {days} working days.',
    labels: { email: 'Email', mobile: 'Mobile', telegram: 'Telegram', whatsapp: 'WhatsApp', instagram: 'Instagram', linkedin: 'LinkedIn' },
    calls: 'Available for calls',
    visit: 'In person in Yerevan by appointment',
    visitSub: 'Online with families worldwide',
  },

  form: {
    eyebrow: 'Enquiry',
    title: 'Tell us where you are starting from',
    intro: 'About three minutes. Fields marked * are required.',
    s1: 'About you',
    s2: 'Your plans',
    s3: 'Message',
    name: 'Full name',
    namePh: 'As in your passport',
    role: 'I am',
    email: 'Email',
    phone: 'Phone',
    whatsapp: 'WhatsApp number',
    sameAsPhone: 'Same as phone',
    telegram: 'Telegram username',
    optional: 'optional',
    level: 'Applying for',
    year: 'Intended start year',
    yearPh: 'Select a year',
    unis: 'Target universities',
    unisHint: 'if known',
    unisPh: 'e.g. Columbia, Sorbonne',
    countries: 'Target countries',
    countriesHint: 'select any',
    service: 'Service of interest',
    message: 'Anything we should know',
    messagePh: 'Current school or university, grades, tests taken, questions you have',
    consentBefore: 'I agree that BridgePath may use these details to reply to my enquiry, as described in the',
    consentLink: 'privacy policy',
    consentAfter: '.',
    honeypot: 'Leave this field empty',
    submit: 'Send enquiry',
    sending: 'Sending…',
    errors: {
      name: 'Please enter your full name.',
      role: 'Please choose Student or Parent.',
      emailEmpty: 'Please enter your email address.',
      email: 'Please enter a complete email address.',
      phone: 'Please enter a phone number, including the country code.',
      level: 'Please choose a programme level.',
      year: 'Please choose a start year.',
      service: 'Please choose one, or “Not sure yet”.',
      consent: 'Please confirm before sending.',
      summaryOne: 'Please check the highlighted field.',
      summaryMany: 'Please check the {n} highlighted fields.',
      failed: 'We could not send your enquiry. Your answers are kept; please try again, or message us on WhatsApp.',
      rateLimited: 'Too many enquiries were sent from this connection. Please wait a few minutes, or message us on WhatsApp.',
    },
    success: {
      eyebrow: 'Enquiry received',
      title: 'Thank you — we’ll be in touch within {days} days',
      body: 'A copy of your enquiry has been sent to {email}. If something is urgent, message us directly.',
      wa: 'Message us on WhatsApp',
      again: 'Send another enquiry',
    },
  },

  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy policy',
    updated: 'Last updated [date] · Version [x.x]',
    contents: 'Contents',
    template:
      'Template only. Section headings and prompts show the structure; final wording must be written or approved by your legal adviser, and published in Armenian, Russian and English.',
    summary: '[Short summary in plain language: what we collect when you enquire, why, and that we never sell it.]',
    sections: [
      { id: 'who-we-are', title: 'Who we are', body: '[Legal name of BridgePath, registered address in Yerevan, registration number, and the contact for privacy questions.]', list: [] as string[] },
      {
        id: 'what-we-collect',
        title: 'What we collect',
        body: '[The information collected through the enquiry form and in consultations.]',
        list: [
          'Contact details: name, email, phone, WhatsApp and Telegram (if given)',
          'Study plans: programme level, start year, target countries and universities',
          'Anything written in the message field',
          'Technical data: language, page visited, time of submission',
        ],
      },
      { id: 'why', title: 'Why we use it', body: '[The purposes and the legal basis: replying to the enquiry, preparing a consultation, and contract performance for clients.]', list: [] as string[] },
      { id: 'storage', title: 'Where it is stored and who sees it', body: '[The systems used (email provider, CRM, messaging apps), where their servers are, and who at BridgePath has access.]', list: [] as string[] },
      { id: 'retention', title: 'How long we keep it', body: '[Retention periods for enquiries that do not become clients, and for client files.]', list: [] as string[] },
      { id: 'rights', title: 'Your rights', body: '[How to request a copy, correction or deletion, and how to withdraw consent. Response time.]', list: [] as string[] },
      { id: 'cookies', title: 'Cookies and analytics', body: '[Which cookies are set (language preference, analytics if any) and how to refuse them.]', list: [] as string[] },
      { id: 'contact', title: 'Contact', body: '[Email for privacy requests and the postal address.]', list: [] as string[] },
    ],
  },

  notFound: {
    eyebrow: 'Error 404',
    title: 'This page is not on the map.',
    body: 'The link may be out of date, or the page may have moved. Everything else is where you left it.',
    home: 'Back to home',
    contact: 'Contact us',
  },

  /** Email sent to the family after they submit the form. */
  autoreply: {
    subject: 'We received your enquiry — BridgePath',
    greeting: 'Dear {name},',
    body: 'Thank you for contacting BridgePath. We have received your enquiry and will reply within {days} working days. A copy of what you sent is below.',
    signoff: 'BridgePath · Academic Advisory & Consulting',
  },
};

export default en;
export type Dict = typeof en;
