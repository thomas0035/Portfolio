/* Single source of truth for everything on the site.
   Edit this file, not the components. */

export const profile = {
  name: 'Thomas Biju Kavukatt',
  firstName: 'Thomas',
  title: 'Software Engineer · C++ Desktop Applications',
  tagline: 'I build the desktop software that sits between a thermal camera and the person operating it.',
  location: 'Kochi, Kerala, India',
  email: 'thomasbiju0035@gmail.com',
  github: 'https://github.com/thomas0035',
  linkedin: 'https://www.linkedin.com/in/thomas-biju-kavukatt-8ab0a5218/',
  resumePdf: '/Thomas_Biju_Kavukatt_Resume.pdf',
  relocation: 'Open to relocation anywhere in India',
  notice: '2 months (negotiable)',
  summary: [
    'One year at Digital Core Technologies building the desktop software for thermal imaging cameras in C++ (GTKmm, now moving to Qt): Ethernet streaming, on-device recording and storage, and a motorised zoom-lens controller.',
    'Comfortable with the parts most UI developers avoid: GStreamer pipelines, Ethernet camera streaming, and debugging a codebase that customers are already running.',
    'I build full-stack web and mobile apps on my own time, with the business rules living in Postgres rather than the client.',
  ],
  lookingFor:
    'C++ desktop, embedded-adjacent, or full-stack roles where the software talks to real hardware or real users.',
}

/* ---------- Skills ----------
   `usedIn` ids cross-reference experience + project ids below. */
export type Skill = { name: string; usedIn: string[]; note?: string }
export type SkillGroup = { id: string; label: string; skills: Skill[] }

export const skillGroups: SkillGroup[] = [
  {
    id: 'lang',
    label: 'Languages',
    skills: [
      { name: 'C++', usedIn: ['thermview'] },
      { name: 'Python', usedIn: ['veinchain'] },
      { name: 'TypeScript', usedIn: ['chorewars', 'cardwallet'] },
      { name: 'JavaScript', usedIn: ['chorewars', 'cardwallet'] },
      { name: 'SQL', usedIn: ['chorewars', 'cardwallet'] },
      { name: 'Java', usedIn: [] },
    ],
  },
  {
    id: 'desktop',
    label: 'Desktop / UI',
    skills: [
      { name: 'GTKmm', usedIn: ['thermview'] },
      { name: 'Glade', usedIn: ['thermview'] },
      { name: 'Qt', usedIn: ['thermview'], note: 'UI porting work' },
      { name: 'Event-driven GUI design', usedIn: ['thermview'] },
    ],
  },
  {
    id: 'video',
    label: 'Video & Imaging',
    skills: [
      { name: 'GStreamer pipelines', usedIn: ['thermview'] },
      { name: 'Ethernet / IP camera streaming', usedIn: ['thermview'] },
      { name: 'RTSP · H.264 / YUV422', usedIn: ['thermview'] },
      { name: 'On-device recording & storage', usedIn: ['thermview'] },
      { name: 'Real-time frame handling', usedIn: ['thermview'] },
      { name: 'Bad-pixel correction', usedIn: ['thermview'] },
      { name: 'Zoom / focus control for motorised optics', usedIn: ['thermview'] },
      { name: 'Near-infrared imaging', usedIn: ['veinchain'] },
    ],
  },
  {
    id: 'web',
    label: 'Web & Mobile',
    skills: [
      { name: 'React', usedIn: ['chorewars'] },
      { name: 'React Native / Expo', usedIn: ['cardwallet'] },
      { name: 'Node.js', usedIn: ['chorewars'] },
      { name: 'Supabase', usedIn: ['chorewars', 'cardwallet'], note: 'Postgres, Auth, RLS, Realtime' },
      { name: 'Postgres functions / RPC', usedIn: ['chorewars', 'cardwallet'] },
      { name: 'Row Level Security', usedIn: ['chorewars', 'cardwallet'] },
      { name: 'Tailwind', usedIn: ['chorewars'] },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git', usedIn: ['thermview', 'chorewars', 'cardwallet', 'veinchain'] },
      { name: 'Linux', usedIn: ['thermview'] },
      { name: 'Release builds & SDK integration', usedIn: ['thermview'] },
      { name: 'Vercel', usedIn: ['chorewars'] },
      { name: 'Android APK builds', usedIn: ['cardwallet'] },
    ],
  },
]

/* ---------- Experience as a GStreamer pipeline ----------
   Each element is one stage. Elements with `children` are bins. */
export type PipelineElement = {
  id: string
  element: string
  org: string
  role: string
  period: string
  location?: string
  summary: string
  bullets: string[]
  stack?: string[]
  children?: { element: string; title: string; detail: string }[]
}

export const pipeline: PipelineElement[] = [
  {
    id: 'rajagiri',
    element: 'rajagiri_src',
    org: 'Rajagiri School of Engineering & Technology',
    role: 'B.Tech, Computer Science & Engineering',
    period: '2021 – 2025',
    location: 'Kochi',
    summary: 'CGPA 7.88. Final-year project VeinChain: finger-vein biometrics with near-infrared imaging.',
    bullets: [
      'Final-year team project VeinChain: built the NIR capture rig and the capture pipeline, ResNet-50 matching, blockchain ledger for results.',
      'Class XII (CBSE), Devagiri CMI Public School, Kozhikode: 95.6%.',
    ],
  },
  {
    id: 'accel',
    element: 'accel_qa',
    org: 'Accel Limited',
    role: 'Software Testing Intern',
    period: 'Jul 2024',
    location: 'Kochi',
    summary: 'Functional testing on a client application.',
    bullets: [
      'Functional testing on a client application.',
      'Wrote up and tracked bugs with the development team.',
    ],
  },
  {
    id: 'dct-intern',
    element: 'dct_intern',
    org: 'Digital Core Technologies',
    role: 'Software Engineering Intern',
    period: 'Jul – Sep 2025',
    location: 'Kochi',
    summary: 'Joined the ThermView team. Converted to full-time after three months.',
    bullets: [
      'Onboarded onto ThermView, the C++/GTKmm desktop software for thermal imaging cameras.',
      'Started on the GTKmm front end and GStreamer camera pipeline.',
      'Converted to a full-time Software Engineer in October 2025.',
    ],
    stack: ['C++', 'GTKmm', 'GStreamer', 'Linux'],
  },
  {
    id: 'thermview',
    element: 'dct_engineer',
    org: 'Digital Core Technologies',
    role: 'Software Engineer',
    period: 'Oct 2025 – Present',
    location: 'Kochi',
    summary:
      'ThermView: desktop control and viewing software for thermal imaging cameras. Features ship to customers, so regressions are mine to chase.',
    bullets: [
      'Built the streaming and storage feature set for the Ethernet thermal camera: recording and snapshots saved to the camera’s own storage, a storage-format action, and a stream bitrate control, all driven from the GTKmm UI through the device SDK.',
      'Added network stream format selection (H.264 or YUV422). The GStreamer source pipeline is torn down and rebuilt on the fly for the chosen format, with capture controls gated to what the format supports.',
      'Fixed frame drops when several consumers read the same Ethernet stream by sourcing the RTSP feed once and sharing it across pipelines.',
      'Hardened recording against real-world failures: corrupted files when the device was rebooted, powered off or factory-reset mid-recording, format changes during a recording, and the app being closed while recording.',
      'Built the zoom and focus control front end for a motorised optical zoom-lens thermal camera: the operator-facing controls, wired to the lens over the device link.',
      'Added bad-pixel correction to the live view. The operator picks defective pixels with the mouse and scroll wheel on the running image and the correction applies immediately.',
      'Ported UI components as part of the ongoing move of ThermView from GTKmm to Qt.',
      'Cut and shipped ThermView releases, integrated firmware SDK updates, and kept the in-app user manual current. Features go out to customers, so regressions are mine to chase.',
    ],
    stack: ['C++', 'GTKmm', 'Glade', 'Qt', 'GStreamer', 'Linux'],
    children: [
      {
        element: 'streamstore',
        title: 'Stream & storage',
        detail:
          'On-device recording, snapshots, storage format and stream bitrate, from the UI through the SDK.',
      },
      {
        element: 'nwformat',
        title: 'H.264 / YUV422 pipelines',
        detail: 'Format selection with the GStreamer source pipeline rebuilt live for the chosen format.',
      },
      {
        element: 'rtsptee',
        title: 'Frame-drop fix',
        detail: 'One RTSP source shared across pipelines instead of several competing readers.',
      },
      {
        element: 'zoomfocus',
        title: 'Zoom & focus control',
        detail: 'Operator controls for a motorised zoom lens, wired over the device link.',
      },
      {
        element: 'badpixel',
        title: 'Bad-pixel correction',
        detail: 'Pick defective pixels on the live image; correction applies instantly.',
      },
      {
        element: 'qtport',
        title: 'GTKmm to Qt port',
        detail: 'Porting UI components to Qt as the app migrates.',
      },
    ],
  },
]

/* ---------- Projects ----------
   Three zoom levels: 1x summary, 2x features, 4x architecture. */
export type Project = {
  id: string
  name: string
  year: string
  kind: string
  tagline: string
  stack: string[]
  features: string[]
  architecture: string[]
  links: { label: string; href: string }[]
  illustration: 'chorewars' | 'cardwallet' | 'veinchain'
  /* Screenshots in /public/projects. First one is shown in the lens; more become a thumbnail strip.
     Leave empty to fall back to the CSS/SVG illustration. */
  images: { src: string; alt: string }[]
}

export const projects: Project[] = [
  {
    id: 'chorewars',
    name: 'ChoreWars',
    year: '2026',
    kind: 'Web app · PWA',
    tagline:
      'Shared-house cleaning rotations with a weekly league. Live and used every day by the six people in my house.',
    stack: [
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind',
      'Supabase',
      'Postgres',
      'Realtime',
      'PWA',
      'Vercel',
    ],
    features: [
      'Who cleaned what last, who is next, and what is due, per area of the house.',
      'Volunteering, streaks, cooldowns and achievements feed a points league with a weekly champion.',
      'Realtime updates so everyone sees a completed chore the moment it happens.',
      'Installable PWA, so it lives on the home screen like a native app.',
    ],
    architecture: [
      'Every scoring rule (rotation advancement, volunteering, streaks, cooldowns, achievements) lives in Postgres functions.',
      'The browser never sends a points value. It only calls RPCs such as complete_cleaning(area_id), so nobody can farm points from the client.',
      'Row Level Security scopes every table to the house the user belongs to.',
    ],
    links: [
      { label: 'Live app', href: 'https://chore-wars-five.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/thomas0035/ChoreWars' },
    ],
    illustration: 'chorewars',
    images: [
      {
        src: '/projects/chorewars-home.png',
        alt: 'ChoreWars home: your turn, areas needing a hand, house status',
      },
      { src: '/projects/chorewars-league.png', alt: 'ChoreWars house league podium for the current round' },
      { src: '/projects/chorewars-profile.png', alt: 'ChoreWars profile with cleaning stats and streaks' },
    ],
  },
  {
    id: 'cardwallet',
    name: 'CardWallet',
    year: '2025',
    kind: 'Android app',
    tagline:
      'A card wallet for debit, credit, ID, membership and business cards. Built solo, runs on my phone as an APK.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Postgres', 'RLS'],
    features: [
      'Each card type gets its own layout, so a business card and a debit card look like what they are.',
      'Card details stay hidden until the user passes fingerprint or face authentication.',
      'No server of its own. The app talks to Supabase directly.',
    ],
    architecture: [
      "Postgres Row Level Security restricts every query to the signed-in user's own rows, so the database enforces privacy, not the app.",
      'A local biometric gate sits in front of any sensitive field render.',
      'Shipped as a signed Android APK built from the Expo project.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/thomas0035/CardWallet' }],
    illustration: 'cardwallet',
    images: [
      { src: '/projects/cardwallet-home.jpg', alt: 'CardWallet home screen listing masked cards' },
      {
        src: '/projects/cardwallet-card.jpg',
        alt: 'CardWallet card details with sensitive fields hidden behind biometrics',
      },
    ],
  },
  {
    id: 'veinchain',
    name: 'VeinChain',
    year: '2025',
    kind: 'Final-year project · Team',
    tagline: 'Finger-vein biometric authentication with a home-built near-infrared capture rig.',
    stack: ['Python', 'ResNet-50', 'NIR imaging', 'Blockchain'],
    features: [
      'Removed the IR-cut filter from a webcam and back-lit the finger with NIR LEDs, so veins absorb the light and show up dark.',
      'Capture pipeline and front end for enrolment and verification.',
      'Authentication results written to a blockchain ledger for tamper-evidence.',
    ],
    architecture: [
      'Hardware: modified webcam plus an NIR LED array behind the finger; the vein pattern is the darker region in the frame.',
      'A ResNet-50 model matches the captured vein pattern against enrolled templates.',
      'Each authentication event is appended to a ledger so results cannot be silently altered.',
    ],
    links: [],
    illustration: 'veinchain',
    images: [],
  },
]

export const navSections = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]
