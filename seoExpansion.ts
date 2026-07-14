import {
  LOCAL_LANDING_PAGES,
  REGION_RING_LABELS,
  getCitySlug,
  groupPagesByRing,
  type LocalLandingPageData,
} from "./seoRegion";
import type { ComparisonGuideData, SeoContentFaq } from "./seoContentPages";

export interface RingHubPageData {
  slug: string;
  ring: LocalLandingPageData["ring"];
  title: string;
  description: string;
  label: string;
  heading: string;
  intro: string;
  priority: string;
}

export interface RoomServicePageData {
  slug: string;
  name: string;
  intro: string;
  price: string;
  image: string;
  imageAlt: string;
  faqs: SeoContentFaq[];
}

export interface ContentHubPageData {
  slug: string;
  title: string;
  description: string;
  label: string;
  heading: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
  faqs: SeoContentFaq[];
  relatedLinks: Array<{ name: string; href: string }>;
  priority: string;
}

export interface HowToGuideData {
  slug: string;
  title: string;
  description: string;
  label: string;
  heading: string;
  intro: string;
  steps: Array<{ name: string; text: string }>;
  faqs: SeoContentFaq[];
  priority: string;
}

export interface TeamPersonPageData {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  experience: string;
  image: string;
  skills: string[];
  priority: string;
}

export interface ProjectPageData {
  slug: string;
  title: string;
  description: string;
  city: string;
  service: string;
  image: string;
  imageAlt: string;
  summary: string;
  priority: string;
}

export interface RoomComboPageData {
  slug: string;
  city: string;
  roomName: string;
  roomSlug: string;
  roomIntro: string;
  price: string;
}

export interface CityCommercialPageData {
  slug: string;
  city: string;
  citySlug: string;
  distanceKm: number;
  type: "kosten" | "offerte";
}

export const RING_HUB_PAGES: RingHubPageData[] = [
  {
    slug: "stukadoor-centrum-bergeijk",
    ring: "centrum",
    title: "Stukadoor Bergeijk centrum | Lokale stukadoors",
    description:
      "Stukadoor in Bergeijk zelf nodig? Stukadoorsteam De Kempen werkt vanuit Bergeijk voor glad pleisterwerk, schuurwerk, renovatie en betonlook.",
    label: "Centrum Bergeijk",
    heading: "Stukadoor in Bergeijk",
    intro: "Vanuit Bergeijk werken Jeroen, Bram en Kay voor woningen in het centrum en directe omgeving. Snelle lijnen en korte reistijd.",
    priority: "0.96",
  },
  {
    slug: "stukadoor-binnen-10-km-bergeijk",
    ring: "dichtbij",
    title: "Stukadoor binnen 10 km van Bergeijk | Dichtbij gelegen dorpen",
    description:
      "Stukadoor gezocht binnen 10 km van Bergeijk? Bekijk Hoogeloon, Westerhoven, Luyksgestel, Eersel, Gastel, Casteren en Duizel.",
    label: "Binnen 10 km",
    heading: "Stukadoor binnen 10 km van Bergeijk",
    intro: "Deze dorpen liggen het dichtst bij Bergeijk. Ideaal als u een stukadoor zoekt die snel kan langskomen voor advies en stucwerk.",
    priority: "0.95",
  },
  {
    slug: "stukadoor-10-20-km-bergeijk",
    ring: "regio",
    title: "Stukadoor 10–20 km van Bergeijk | Kempen en regio",
    description:
      "Stukadoor in de regio rond Bergeijk: Valkenswaard, Bladel, Reusel, Waalre, Veldhoven, Leende, Hilvarenbeek en meer.",
    label: "10–20 km regio",
    heading: "Stukadoor 10–20 km van Bergeijk",
    intro: "Ook iets verder rond Bergeijk werken wij graag voor glad pleisterwerk, renovatiestucwerk, schuurwerk en betonlook.",
    priority: "0.94",
  },
  {
    slug: "stukadoor-grensgemeenten-bergeijk",
    ring: "grens",
    title: "Stukadoor grensgemeenten | Lommel, Pelt, Achel en omgeving",
    description:
      "Stukadoor voor grensgemeenten rond Bergeijk: Lommel, Pelt, Achel, Overpelt en Neerpelt. Stucwerk net over de grens.",
    label: "Grensgemeenten",
    heading: "Stukadoor in grensgemeenten",
    intro: "Net over de grens in België en Limburg helpen wij ook met stucwerk, renovatie en betonlook binnen ons werkgebied.",
    priority: "0.93",
  },
];

export const ROOM_SERVICE_PAGES: RoomServicePageData[] = [
  {
    slug: "plafond-stucen",
    name: "Plafond stucen",
    intro:
      "Plafond stucen geeft een strak, egaal plafond dat klaar is voor schilderwerk of decoratief schuurwerk. Wij werken netjes met afplakken en duidelijke droogtijd.",
    price: "Richtprijs schuurwerk: €18 - €28 per m² · Glad pleisterwerk plafond: €15 - €25 per m²",
    image: "/images/schuurwerk_plafond.jpg",
    imageAlt: "Schuurwerk plafond met ambachtelijk draaiend patroon",
    faqs: [
      {
        question: "Wat kost een plafond laten stucen?",
        answer: "Glad pleisterwerk ligt vaak tussen €15 en €25 per m². Schuurwerk tussen €18 en €28 per m², afhankelijk van oppervlakte en hoogte.",
      },
      {
        question: "Hoe lang duurt het stucen van een plafond?",
        answer: "Dat hangt af van oppervlakte en afwerking. Een gemiddelde woonkamer plafond kan vaak in één tot enkele dagen worden afgewerkt.",
      },
    ],
  },
  {
    slug: "stucwerk-badkamer",
    name: "Stucwerk badkamer",
    intro:
      "Voor badkamers bieden wij betonlook en microcement: naadloos, waterdicht en onderhoudsvriendelijk. Ook renovatiestucwerk voor bestaande wanden.",
    price: "Richtprijs betonlook: €95 - €140 per m²",
    image: "/images/betonlook_badkamer.jpg",
    imageAlt: "Betonlook badkamer met microcement afwerking",
    faqs: [
      {
        question: "Is betonlook geschikt voor een natte douche?",
        answer: "Ja, microcement en betonlook kunnen waterdicht worden aangebracht in douches en badkamers.",
      },
      {
        question: "Doen jullie ook tegelwerk?",
        answer: "Nee, wij richten ons op stucwerk, pleisterwerk en betonlook — geen tegelzetterswerk.",
      },
    ],
  },
  {
    slug: "microcement-keuken",
    name: "Microcement keuken",
    intro:
      "Microcement in de keuken geeft een naadloze, moderne achterwand zonder voegen. Makkelijk schoon te houden en visueel rustig.",
    price: "Richtprijs: €95 - €140 per m²",
    image: "/images/betonlook_badkamer.jpg",
    imageAlt: "Microcement keuken achterwand met betonlook afwerking",
    faqs: [
      {
        question: "Kan microcement over bestaande tegels?",
        answer: "Soms wel, maar wij beoordelen eerst de ondergrond op locatie voor een duurzaam resultaat.",
      },
      {
        question: "Hoe onderhoud ik microcement?",
        answer: "Met milde reinigers en regelmatig impregneren blijft microcement lang mooi.",
      },
    ],
  },
  {
    slug: "wand-egaliseren",
    name: "Wand egaliseren",
    intro:
      "Wand egaliseren maakt oneffen of oude wanden weer vlak en klaar voor sausklaar pleisterwerk, behang of schilderwerk. Ideaal bij renovatie.",
    price: "Richtprijs renovatiestucwerk: afhankelijk van ondergrond",
    image: "/images/renovatie_stucwerk.jpg",
    imageAlt: "Renovatiestucwerk en wand egaliseren tijdens verbouwing",
    faqs: [
      {
        question: "Wanneer is wand egaliseren nodig?",
        answer: "Bij scheuren, oude lagen, oneffenheden of beschadigingen voordat u gaat schilderen of behangen.",
      },
      {
        question: "Is dit hetzelfde als glad pleisterwerk?",
        answer: "Egaliseren is vaak het herstel- en voorbereidingswerk; daarna volgt de eindlaag glad pleisterwerk.",
      },
    ],
  },
];

export const VERBOUWING_HUB_PAGES: ContentHubPageData[] = [
  {
    slug: "stucwerk-bij-verbouwing",
    title: "Stucwerk bij verbouwing | Renovatie en herstel",
    description:
      "Stucwerk bij verbouwing in Bergeijk en omgeving. Wand egaliseren, renovatiestucwerk en strak pleisterwerk door lokale stukadoors.",
    label: "Verbouwing",
    heading: "Stucwerk bij verbouwing",
    intro:
      "Bij een verbouwing is stucwerk vaak het sluitstuk voordat u kunt schilderen of afwerken. Wij herstellen wanden, egaliseren oneffenheden en leveren sausklaar op.",
    sections: [
      {
        heading: "Wat wij doen bij verbouwingen",
        body: "Renovatiestucwerk, herstel van scheuren, egaliseren van wanden en plafonds, en sausklaar pleisterwerk voor nieuwe indelingen.",
      },
      {
        heading: "Planning en droogtijd",
        body: "Wij stemmen af met uw schilder of aannemer zodat droogtijd en oplevering goed lopen. Reken op ongeveer 1 dag droogtijd per mm laagdikte.",
      },
    ],
    faqs: [
      {
        question: "Kunnen jullie stucwerk combineren met een lopende verbouwing?",
        answer: "Ja, wij plannen graag mee zodat stucwerk op het juiste moment in de verbouwing gebeurt.",
      },
    ],
    relatedLinks: [
      { name: "Renovatiestucwerk", href: "/renovatiestucwerk" },
      { name: "Wand egaliseren", href: "/wand-egaliseren" },
      { name: "Kosten stucwerk", href: "/kosten-stucwerk" },
    ],
    priority: "0.91",
  },
  {
    slug: "stucwerk-uitbouw",
    title: "Stucwerk uitbouw | Nieuwe ruimte strak afwerken",
    description:
      "Stucwerk voor uitbouw in de Kempen. Pleisterwerk voor nieuwe wanden en plafonds na aanbouw of uitbreiding van uw woning.",
    label: "Uitbouw",
    heading: "Stucwerk bij uitbouw",
    intro:
      "Na een uitbouw wilt u nieuwe wanden en plafonds strak afgewerkt hebben. Wij pleisteren sausklaar zodat u direct verder kunt met schilderwerk.",
    sections: [
      {
        heading: "Nieuwbouw binnen bestaande woning",
        body: "Glad pleisterwerk op nieuwe gipsplaten of metselwerk, met aandacht voor hoeken, dagkanten en aansluitingen.",
      },
    ],
    faqs: [
      {
        question: "Wanneer kunnen jullie starten na een uitbouw?",
        answer: "Zodra de ruimte droog en stabiel is. Wij kijken graag mee wanneer stucwerk het beste past.",
      },
    ],
    relatedLinks: [
      { name: "Stucwerk nieuwbouw", href: "/stucwerk-nieuwbouw" },
      { name: "Glad pleisterwerk", href: "/glad-pleisterwerk" },
      { name: "Offerte berekenen", href: "/?tab=calculator" },
    ],
    priority: "0.9",
  },
  {
    slug: "stucwerk-zolder",
    title: "Stucwerk zolder | Plafond en wanden afwerken",
    description:
      "Zolder stucen in Bergeijk en omgeving. Plafonds en schuin wanden strak pleisteren voor een nette afwerking van uw zolderruimte.",
    label: "Zolder",
    heading: "Stucwerk op zolder",
    intro:
      "Een zolder verbouwen vraagt vaak om stucwerk op schuine wanden en plafonds. Wij werken netjes in compacte ruimtes en denken mee over de juiste afwerking.",
    sections: [
      {
        heading: "Schuine wanden en plafonds",
        body: "Glad pleisterwerk of schuurwerk op zolderplafonds, met aandacht voor isolatie, dampopenheid en droogtijd.",
      },
    ],
    faqs: [
      {
        question: "Is schuurwerk geschikt voor een zolderplafond?",
        answer: "Ja, schuurwerk geeft karakter en verbergt kleine oneffenheden — populair op zolderplafonds.",
      },
    ],
    relatedLinks: [
      { name: "Plafond stucen", href: "/plafond-stucen" },
      { name: "Schuurwerk plafond", href: "/schuurwerk-plafond" },
      { name: "Stukadoor Bergeijk", href: "/stukadoor-bergeijk" },
    ],
    priority: "0.9",
  },
];

export const HOWTO_GUIDES: HowToGuideData[] = [
  {
    slug: "scheuren-wand-stucen",
    title: "Scheuren in wand stucen | Herstel en advies",
    description:
      "Scheuren in uw wand? Lees wanneer stucen zinvol is en hoe stukadoors scheuren herstellen voordat u gaat schilderen.",
    label: "How-to",
    heading: "Scheuren in wand stucen",
    intro:
      "Scheuren in wanden komen vaak voor bij oude woningen of na settling. Niet elke scheur is hetzelfde — soms is herstel en renovatiestucwerk nodig voordat u weer strak kunt schilderen.",
    steps: [
      { name: "Scheur beoordelen", text: "Wij kijken of het een oppervlakkige scheur is of structureel beweging." },
      { name: "Ondergrond voorbereiden", text: "Losse delen verwijderen, eventueel wapeningsband of elastische filler." },
      { name: "Stucwerk aanbrengen", text: "Renovatiestucwerk of egaliseren tot de wand weer vlak is." },
      { name: "Droogtijd afwachten", text: "Pas schilderen als het stucwerk volledig droog en licht van kleur is." },
    ],
    faqs: [
      {
        question: "Komt elke scheur terug na stucen?",
        answer: "Bij bewegende ondergrond kan herhaling voorkomen. Wij adviseren de juiste herstelmethode per situatie.",
      },
    ],
    priority: "0.88",
  },
  {
    slug: "stucwerk-voorbereiden",
    title: "Stucwerk voorbereiden | Wat doet u zelf?",
    description:
      "Hoe bereidt u uw woning voor op stucwerk? Tips over ruimte, meubels, stroom en planning van stukadoors.",
    label: "How-to",
    heading: "Stucwerk voorbereiden",
    intro:
      "Goede voorbereiding helpt stukadoors sneller en netter te werken. Dit kunt u zelf doen voordat wij langskomen.",
    steps: [
      { name: "Ruimte leegmaken", text: "Haal meubels weg of dek alles goed af in de werkruimte." },
      { name: "Stopcontacten en plinten", text: "Verwijder losse plinten indien nodig; stopcontacten kunnen wij afplakken." },
      { name: "Stroom en toegang", text: "Zorg voor stroom en vrije toegang tot wanden en plafonds." },
      { name: "Planning afstemmen", text: "Stem droogtijd af met schilderwerk — stucwerk moet volledig drogen." },
    ],
    faqs: [
      {
        question: "Moet ik zelf afplakken?",
        answer: "Nee, wij verzorgen professioneel afplakken. U hoeft vooral ruimte te maken.",
      },
    ],
    priority: "0.87",
  },
  {
    slug: "wanneer-stukadoor-inschakelen",
    title: "Wanneer stukadoor inschakelen? | Timing en advies",
    description:
      "Wanneer schakelt u een stukadoor in bij nieuwbouw, verbouwing of renovatie? Praktisch advies van stukadoors rond Bergeijk.",
    label: "How-to",
    heading: "Wanneer een stukadoor inschakelen?",
    intro:
      "De juiste timing voorkomt dubbel werk. Wanneer u ons inschakelt hangt af van het type project.",
    steps: [
      { name: "Nieuwbouw", text: "Na metselwerk/gipsplaten en vóór schilderwerk — vaak laat in de bouwfase." },
      { name: "Verbouwing", text: "Na ruwbouwwerkzaamheden, vóór afwerking en inrichting." },
      { name: "Renovatie", text: "Zodra oude lagen zijn verwijderd en de ondergrond zichtbaar is." },
      { name: "Betonlook badkamer", text: "Vroeg in de planning — waterdichting en meerdere lagen vragen tijd." },
    ],
    faqs: [
      {
        question: "Kan ik al een offerte krijgen vóór de start?",
        answer: "Ja, via onze calculator of na opmeten op locatie.",
      },
    ],
    priority: "0.87",
  },
];

export const TEAM_PERSON_PAGES: TeamPersonPageData[] = [
  {
    slug: "jeroen-stukadoor",
    name: "Jeroen",
    role: "Mede-oprichter & specialist glad pleisterwerk",
    specialty: "Glad pleisterwerk & betonlook",
    bio: "Jeroen zit al meer dan 18 jaar in het vak. Hij is specialist in strak glad pleisterwerk en luxe betonlook badkamers.",
    experience: "18+ jaar ervaring",
    image: "/images/team/jeroen.jpg",
    skills: ["Glad stucwerk", "Betonlook", "Advies op locatie"],
    priority: "0.85",
  },
  {
    slug: "bram-stukadoor",
    name: "Bram",
    role: "Mede-oprichter & renovatie expert",
    specialty: "Nieuwbouw & renovatiestucwerk",
    bio: "Bram beoordeelt ondergronden zorgvuldig en zorgt voor strak pleisterwerk bij nieuwbouw en renovatie.",
    experience: "14 jaar ervaring",
    image: "/images/team/bram.jpg",
    skills: ["Renovatiestucwerk", "Nieuwbouw", "Projectplanning"],
    priority: "0.85",
  },
  {
    slug: "kay-stukadoor",
    name: "Kay",
    role: "Mede-oprichter & schuurwerk specialist",
    specialty: "Schuurwerk & decoratief stucwerk",
    bio: "Kay is meester in ambachtelijk schuurwerk met prachtige draaiende patronen op plafonds.",
    experience: "12 jaar ervaring",
    image: "/images/team/kay.jpg",
    skills: ["Schuurwerk", "Plafonds", "Nette oplevering"],
    priority: "0.85",
  },
];

export const PROJECT_PAGES: ProjectPageData[] = [
  {
    slug: "referentie-glad-pleisterwerk-eersel",
    title: "Referentie glad pleisterwerk Eersel",
    description: "Voorbeeld van glad pleisterwerk in Eersel door Stukadoorsteam De Kempen — spiegelglad en sausklaar.",
    city: "Eersel",
    service: "Glad pleisterwerk",
    image: "/images/hero_stukadoor_werk.jpg",
    imageAlt: "Stukadoor aan het werk met glad pleisterwerk",
    summary: "Complete benedenverdieping strak gepleisterd, klaar voor schilderwerk.",
    priority: "0.82",
  },
  {
    slug: "referentie-betonlook-badkamer-bladel",
    title: "Referentie betonlook badkamer Bladel",
    description: "Betonlook badkamer in Bladel — naadloze microcement afwerking zonder tegels.",
    city: "Bladel",
    service: "Betonlook badkamer",
    image: "/images/betonlook_badkamer.jpg",
    imageAlt: "Betonlook badkamer referentie",
    summary: "Luxe betonlook wanden in een nieuwe badkamer, waterdicht afgewerkt.",
    priority: "0.82",
  },
  {
    slug: "referentie-renovatiestucwerk-reusel",
    title: "Referentie renovatiestucwerk Reusel",
    description: "Renovatiestucwerk in Reusel — oude wanden weer strak en klaar voor schilders.",
    city: "Reusel",
    service: "Renovatiestucwerk",
    image: "/images/renovatie_stucwerk.jpg",
    imageAlt: "Renovatiestucwerk referentie",
    summary: "Renovatiepleisterwerk waarna schilders direct aan de slag konden.",
    priority: "0.82",
  },
  {
    slug: "referentie-schuurwerk-westerhoven",
    title: "Referentie schuurwerk Westerhoven",
    description: "Schuurwerk plafond in Westerhoven — ambachtelijk draaiend patroon.",
    city: "Westerhoven",
    service: "Schuurwerk plafond",
    image: "/images/schuurwerk_plafond.jpg",
    imageAlt: "Schuurwerk plafond referentie",
    summary: "Plafond voorzien van decoratief schuurwerk met warme uitstraling.",
    priority: "0.82",
  },
  {
    slug: "referentie-pleisterwerk-hoogeloon",
    title: "Referentie pleisterwerk Hoogeloon",
    description: "Pleisterwerk in Hoogeloon door lokale stukadoors uit Bergeijk.",
    city: "Hoogeloon",
    service: "Glad pleisterwerk",
    image: "/images/pleisterwerk_toepassing.jpg",
    imageAlt: "Pleisterwerk toepassing referentie",
    summary: "Strak pleisterwerk op wanden in een verbouwing pal naast Bergeijk.",
    priority: "0.81",
  },
  {
    slug: "referentie-nieuwbouw-bergeijk",
    title: "Referentie stucwerk nieuwbouw Bergeijk",
    description: "Nieuwbouwwoning in Bergeijk sausklaar gepleisterd door Stukadoorsteam De Kempen.",
    city: "Bergeijk",
    service: "Stucwerk nieuwbouw",
    image: "/images/hero_stukadoor_werk.jpg",
    imageAlt: "Stucwerk nieuwbouw Bergeijk",
    summary: "Complete nieuwbouwwoning strak gepleisterd en sausklaar opgeleverd.",
    priority: "0.83",
  },
];

export const EXTRA_COMPARISON_GUIDES: ComparisonGuideData[] = [
  {
    slug: "betonlook-vs-microcement",
    title: "Betonlook vs microcement | Verschil uitgelegd",
    description: "Wat is het verschil tussen betonlook en microcement? Uitleg voor badkamers en keukens rond Bergeijk.",
    label: "Betonlook vergelijken",
    heading: "Betonlook vs microcement",
    intro: "Beide termen worden vaak door elkaar gebruikt. In de praktijk gaat het om een naadloze cementgebonden afwerking.",
    leftTitle: "Betonlook",
    rightTitle: "Microcement",
    rows: [
      { label: "Uitstraling", left: "Industriële betonlook", right: "Fijne, naadloze cementlaag" },
      { label: "Toepassing", left: "Badkamer, keuken, accent", right: "Badkamer, keuken, vloer" },
      { label: "Waterdicht", left: "Ja, met juiste systeem", right: "Ja, met juiste systeem" },
      { label: "Prijs", left: "Maatwerk €95–€140/m²", right: "Maatwerk €95–€140/m²" },
    ],
    leftPros: ["Trendy industriële look", "Naadloos en hygiënisch", "Geschikt voor natte ruimtes"],
    rightPros: ["Zeer dunne laag", "Flexibel op ondergronden", "Luxe en modern"],
    conclusion: "Voor de meeste klanten is het resultaat vergelijkbaar — wij adviseren op locatie welk systeem past bij uw badkamer of keuken.",
    faqs: [{ question: "Is microcement hetzelfde als betonstuc?", answer: "Het zijn verwante systemen; wij leggen uit welk product het beste past." }],
    relatedLinks: [
      { name: "Betonlook badkamer", href: "/betonlook-badkamer" },
      { name: "Microcement keuken", href: "/microcement-keuken" },
      { name: "Kosten stucwerk", href: "/kosten-stucwerk" },
    ],
  },
  {
    slug: "sausklaar-vs-schilderklaar-stucwerk",
    title: "Sausklaar vs schilderklaar stucwerk",
    description: "Verschil tussen sausklaar en schilderklaar stucwerk uitgelegd door stukadoors in de Kempen.",
    label: "Afwerking vergelijken",
    heading: "Sausklaar vs schilderklaar",
    intro: "De eindafwerking bepaalt wat u daarna kunt doen met uw wanden en plafonds.",
    leftTitle: "Sausklaar",
    rightTitle: "Schilderklaar",
    rows: [
      { label: "Doel", left: "Direct klaar voor schilder", right: "Extra fijn afgewerkt" },
      { label: "Prijs", left: "Standaard richtprijs", right: "Vaak iets meer werk" },
      { label: "Geschikt voor", left: "Schilderwerk", right: "Latex / hoogglans" },
    ],
    leftPros: ["Meest gekozen", "Prima basis voor latex", "Efficiënt in prijs"],
    rightPros: ["Extra strak resultaat", "Minder voorbereiding voor schilder", "Geschikt voor hoogwaardige afwerking"],
    conclusion: "Niet zeker welke afwerking u nodig heeft? Wij adviseren op basis van uw schilderplan.",
    faqs: [{ question: "Kan ik behangen op sausklaar?", answer: "Ja, sausklaar is ook geschikt als basis voor behang." }],
    relatedLinks: [
      { name: "Glad pleisterwerk", href: "/glad-pleisterwerk" },
      { name: "Stucwerk droogtijd", href: "/stucwerk-droogtijd" },
    ],
  },
  {
    slug: "stucwerk-vs-spackspuiten",
    title: "Stucwerk vs spackspuiten | Alternatief in de Kempen",
    description: "Spackspuiten of traditioneel stucwerk? Waarom Stukadoorsteam De Kempen kiest voor glad pleisterwerk en schuurwerk.",
    label: "Alternatief spackspuiten",
    heading: "Stucwerk vs spackspuiten",
    intro: "Wij doen geen spackspuiten of dunpleister. Dit is waarom glad pleisterwerk en schuurwerk een sterker alternatief zijn.",
    leftTitle: "Glad pleisterwerk (wij)",
    rightTitle: "Spackspuiten (niet bij ons)",
    rows: [
      { label: "Afwerking", left: "Strak en duurzaam", right: "Dunne laag, snel" },
      { label: "Reparatie", left: "Goed lokaal te herstellen", right: "Lastiger bij schade" },
      { label: "Uitstraling", left: "Vakmanschap op maat", right: "Industrieel proces" },
    ],
    leftPros: ["Strakke kwaliteit", "Lokale stukadoors", "Renovatie én nieuwbouw"],
    rightPros: ["Snel op grote vlakken", "Lage m²-prijs soms", "Industrieel"],
    conclusion: "Zoekt u spackspuiten in Bergeijk? Wij helpen u graag met een duurzaam alternatief in glad pleisterwerk.",
    faqs: [{ question: "Doen jullie spackspuiten?", answer: "Nee, wij bieden dit bewust niet aan." }],
    relatedLinks: [
      { name: "Glad pleisterwerk", href: "/glad-pleisterwerk" },
      { name: "Veelgestelde vragen", href: "/veelgestelde-vragen" },
    ],
  },
  {
    slug: "renovatiestucwerk-vs-glad-pleisterwerk",
    title: "Renovatiestucwerk vs glad pleisterwerk",
    description: "Wanneer kiest u renovatiestucwerk en wanneer glad pleisterwerk? Advies voor woningen in de Kempen.",
    label: "Renovatie vs glad",
    heading: "Renovatiestucwerk vs glad pleisterwerk",
    intro: "Renovatiestucwerk en glad pleisterwerk overlappen, maar de aanpak verschilt.",
    leftTitle: "Renovatiestucwerk",
    rightTitle: "Glad pleisterwerk",
    rows: [
      { label: "Ondergrond", left: "Oud, beschadigd", right: "Nieuw of egaal" },
      { label: "Werk", left: "Herstel + egaliseren", right: "Aanbrengen eindlaag" },
      { label: "Prijs", left: "Afhankelijk van schade", right: "€15–€25/m² richtlijn" },
    ],
    leftPros: ["Herstelt bestaande wanden", "Ideaal bij verbouwing", "Maatwerk per muur"],
    rightPros: ["Strak eindresultaat", "Efficiënt bij nieuwbouw", "Sausklaar oplevering"],
    conclusion: "Bij twijfel komen wij langs om de ondergrond te beoordelen.",
    faqs: [{ question: "Kan renovatiestucwerk direct glad worden?", answer: "Ja, herstel en egaliseren leiden tot een glad eindresultaat." }],
    relatedLinks: [
      { name: "Renovatiestucwerk", href: "/renovatiestucwerk" },
      { name: "Wand egaliseren", href: "/wand-egaliseren" },
    ],
  },
];

export function buildRoomComboPages(): RoomComboPageData[] {
  return ROOM_SERVICE_PAGES.flatMap((room) =>
    LOCAL_LANDING_PAGES.map((location) => ({
      slug: `${room.slug}-${getCitySlug(location)}`,
      city: location.city,
      roomName: room.name,
      roomSlug: room.slug,
      roomIntro: room.intro,
      price: room.price,
    }))
  );
}

export function buildCityCommercialPages(type: "kosten" | "offerte"): CityCommercialPageData[] {
  return LOCAL_LANDING_PAGES.map((location) => ({
    slug: type === "kosten" ? `kosten-stucwerk-${getCitySlug(location)}` : `offerte-stukadoor-${getCitySlug(location)}`,
    city: location.city,
    citySlug: getCitySlug(location),
    distanceKm: location.distanceKm,
    type,
  }));
}

export function getRingHubCityLinks(ring: LocalLandingPageData["ring"]): LocalLandingPageData[] {
  return groupPagesByRing()[ring].sort((left, right) => left.distanceKm - right.distanceKm);
}

export function getAllExpansionSitemapUrls(): Array<{ loc: string; priority: string }> {
  return [
    ...RING_HUB_PAGES.map((page) => ({ loc: `/${page.slug}`, priority: page.priority })),
    ...ROOM_SERVICE_PAGES.map((page) => ({ loc: `/${page.slug}`, priority: "0.89" })),
    ...buildRoomComboPages().map((page) => ({ loc: `/${page.slug}`, priority: "0.68" })),
    ...buildCityCommercialPages("kosten").map((page) => ({ loc: `/${page.slug}`, priority: "0.86" })),
    ...buildCityCommercialPages("offerte").map((page) => ({ loc: `/${page.slug}`, priority: "0.87" })),
    ...VERBOUWING_HUB_PAGES.map((page) => ({ loc: `/${page.slug}`, priority: page.priority })),
    ...HOWTO_GUIDES.map((page) => ({ loc: `/${page.slug}`, priority: page.priority })),
    ...TEAM_PERSON_PAGES.map((page) => ({ loc: `/${page.slug}`, priority: page.priority })),
    ...PROJECT_PAGES.map((page) => ({ loc: `/${page.slug}`, priority: page.priority })),
    { loc: "/offerte-stukadoor", priority: "0.92" },
  ];
}
