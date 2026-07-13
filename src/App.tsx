import React, { useState, useEffect, useRef } from "react";
import { 
  Calculator, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  User, 
  MessageSquare, 
  Send, 
  AlertCircle, 
  Award, 
  ThumbsUp, 
  Menu, 
  X, 
  Lock, 
  Trash2, 
  Calendar,
  Euro,
  FileText,
  BadgeCheck,
  Zap,
  ShieldCheck,
  Briefcase,
  Layout,
  LayoutGrid,
  Grid,
  Star
} from "lucide-react";
import { PlasterService, TeamMember, QuoteRequest, ChatMessage, Review } from "./types";
import { AdvancedQuoteCalculator } from "./AdvancedQuoteCalculator";
import { BrandImage } from "./BrandImage";

const IMAGES = {
  hero: "/images/hero_interior.jpg",
  betonlook: "/images/betonlook_wall.jpg",
  vakwerk: "/images/stukadoor_vakwerk.jpg",
  schuurwerk: "/images/hero_interior.jpg",
  renovatie: "/images/stukadoor_vakwerk.jpg",
  team: {
    jeroen: "/images/team/jeroen.jpg",
    bram: "/images/team/bram.jpg",
    kay: "/images/team/kay.jpg",
  },
};

const SHOWCASE = [
  {
    src: IMAGES.hero,
    alt: "Glad afgewerkt interieur met strak stucwerk",
    title: "Glad pleisterwerk",
    subtitle: "Spiegelglad en sausklaar",
    objectPosition: "center",
  },
  {
    src: IMAGES.betonlook,
    alt: "Betonlook badkamer afwerking",
    title: "Betonlook",
    subtitle: "Waterdicht en naadloos",
    objectPosition: "center",
  },
  {
    src: IMAGES.vakwerk,
    alt: "Stukadoor aan het werk in de Kempen",
    title: "Vakwerk op locatie",
    subtitle: "Netjes en stofarm",
    objectPosition: "center top",
  },
];

// Constant Data for Services
const SERVICES: PlasterService[] = [
  {
    id: "glad-pleisterwerk",
    title: "Glad Pleisterwerk",
    shortDesc: "Vlijmscherpe en spiegelgladde wanden en plafonds, perfect sausklaar afgewerkt.",
    longDesc: "Glad pleisterwerk is de absolute koning onder de wandafwerkingen. Onze stukadoors maken uw ruwe wanden en plafonds perfect glad door gipsmortel aan te brengen, uit te vlakken en tot in de finesse af te pleisteren. Dit type stucwerk is ideaal voor moderne woningen en zorgt voor een zeer strakke, luxe uitstraling.",
    minPrice: 15,
    maxPrice: 25,
    pros: ["Spiegelgladde, moderne afwerking", "Direct klaar om te sausen of schilderen", "Verhoogt de waarde van uw woning"],
    cons: ["Gevoeliger voor krasjes dan structuurwerk", "Hogere droogtijd door dikkere laag gips"],
    bestFor: "Woonkamers, slaapkamers en plafonds in zowel bestaande bouw als renovatie.",
    dryingTime: "ca. 1 dag per mm dikte (meestal 7-10 dagen)",
    image: IMAGES.hero
  },
  {
    id: "betonlook",
    title: "Betonlook & Microcement",
    shortDesc: "Luxe, waterdichte en naadloze afwerking voor badkamers, keukens en vloeren.",
    longDesc: "Wilt u een trendy, industriële en bovendien onderhoudsvriendelijke look? Betonlook (ook wel microcement genoemd) is een naadloze, cementgebonden afwerking die volledig waterdicht is. Ideaal voor de badkamer (zelfs in de natte douchehoek!), keuken achterwand of als designvloer. Het is hygiënisch en zeer makkelijk schoon te houden.",
    minPrice: 95,
    maxPrice: 140,
    pros: ["100% waterdicht en naadloos", "Geen vuile voegen meer in de badkamer", "Zeer exclusieve en luxe uitstraling"],
    cons: ["Hogere prijsklasse door intensief handwerk in meerdere lagen", "Vereist specialistische applicatie"],
    bestFor: "Badkamers, inloopdouches, keukens en exclusieve accentwanden.",
    dryingTime: "Volledig belastbaar na 5-7 dagen",
    image: IMAGES.betonlook
  },
  {
    id: "schuurwerk",
    title: "Decoratief Schuurwerk",
    shortDesc: "Prachtige, vochtregulerende plafonds met een klassiek draaiend zandpatroon.",
    longDesc: "Schuurwerk is een traditionele stucafwerking met een gipsachtige mortel waaraan fijn zand is toegevoegd. Door deze met een speciale spons in cirkelvormige bewegingen te bewerken, ontstaat er een schitterend, vlammend draai-effect dat prachtig reageert op lichtinval. Bovendien is schuurwerk vochtregulerend.",
    minPrice: 18,
    maxPrice: 28,
    pros: ["Prachtig vlammend effect bij lichtinval", "Vochtregulerend (ideaal voor natte ruimtes)", "Hoeft na droging niet meer gesausd te worden"],
    cons: ["Moeilijker over te schilderen in de toekomst", "Gevoelig voor beschadiging bij aanraking op muren"],
    bestFor: "Plafonds in woonkamers, hallen en badkamers.",
    dryingTime: "3 tot 5 dagen",
    image: IMAGES.schuurwerk
  },
  {
    id: "renovatiestucwerk",
    title: "Renovatiepleisterwerk",
    shortDesc: "Oude, beschadigde of ongelijke wanden weer strak en klaar voor schilderwerk.",
    longDesc: "Renovatiepleisterwerk is bedoeld voor bestaande woningen, verbouwingen en herstelwerk. We beoordelen eerst de ondergrond, herstellen beschadigingen waar nodig en werken wanden of plafonds strak af zodat ze klaar zijn voor sauswerk, behang of verdere afwerking.",
    minPrice: 18,
    maxPrice: 35,
    pros: ["Geschikt voor bestaande bouw en verbouwing", "Herstelt oneffenheden en beschadigingen", "Duidelijk advies per ondergrond"],
    cons: ["Prijs hangt sterk af van de staat van de ondergrond", "Voorbereiding en herstelwerk kunnen extra tijd vragen"],
    bestFor: "Renovaties, verbouwingen, herstelwerk en bestaande woningen met ongelijke wanden.",
    dryingTime: "afhankelijk van laagdikte en herstelwerk",
    image: IMAGES.renovatie
  },
];

const SERVICE_SEO_SLUGS: Record<string, string> = {
  "glad-pleisterwerk": "/glad-pleisterwerk",
  betonlook: "/betonlook-badkamer",
  schuurwerk: "/schuurwerk-plafond",
  renovatiestucwerk: "/renovatiestucwerk",
};

// Constant Data for the 3 ZZP'ers
const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Jeroen",
    role: "Mede-oprichter & Specialist Glad Pleisterwerk",
    specialty: "Glad Pleisterwerk & Betonlook",
    bio: "Jeroen zit al meer dan 18 jaar in het vak en is de perfectionist van het team. Hij houdt van strakke lijnen en modern design. Als u kiest voor betonlook in uw badkamer of een vlijmscherp glad gestuukte woonkamer, staat Jeroen gegarandeerd op de steiger.",
    experience: "18+ jaar ervaring",
    avatar: IMAGES.team.jeroen,
    skills: [
      { name: "Glad Stucwerk", percentage: 98 },
      { name: "Betonlook/Microcement", percentage: 95 },
      { name: "Klantcontact & Advies", percentage: 90 }
    ]
  },
  {
    name: "Bram",
    role: "Mede-oprichter & Renovatie Expert",
    specialty: "Nieuwbouw & Renovatie",
    bio: "Bram is de specialist op het gebied van renovatie en strak pleisterwerk. Hij beoordeelt ondergronden zorgvuldig, werkt netjes en zorgt ervoor dat de planning strak op schema blijft.",
    experience: "14 jaar ervaring",
    avatar: IMAGES.team.bram,
    skills: [
      { name: "Renovatie Stucwerk", percentage: 99 },
      { name: "Renovatiewerk", percentage: 88 },
      { name: "Projectplanning", percentage: 92 }
    ]
  },
  {
    name: "Kay",
    role: "Mede-oprichter & Schuurwerk Specialist",
    specialty: "Schuurwerk, Pleisterwerk & Gevels",
    bio: "Kay is onze vrolijke kracht en de meester in decoratieve afwerkingen. Met zijn vaste hand draait hij de mooiste schuurwerk-patronen op uw plafond en laat hij de werkplek altijd brandschoon achter.",
    experience: "12 jaar ervaring",
    avatar: IMAGES.team.kay,
    skills: [
      { name: "Schuurwerk", percentage: 97 },
      { name: "Sier- & Schuurwerk", percentage: 94 },
      { name: "Gevelstuc & Isolatie", percentage: 85 }
    ]
  }
];

// Local Reviews
const REVIEWS: Review[] = [
  {
    name: "Familie Van de Sande",
    city: "Eersel",
    rating: 5,
    date: "25 mei 2026",
    service: "Glad Pleisterwerk & Plafond",
    text: "Jeroen en Bram hebben onze hele benedenverdieping gestuukt. Wat een vakmannen! De muren zijn echt zo glad als een spiegel. Ze werken heel netjes en dekken alles perfect af. Aanrader voor iedereen in de Kempen!"
  },
  {
    name: "Goran S.",
    city: "Bladel",
    rating: 5,
    date: "14 juni 2026",
    service: "Betonlook Badkamer",
    text: "Heel blij met de betonlook wanden in onze nieuwe badkamer, gemaakt door Jeroen. Geen tegels en voegen meer, heerlijk schoonmaken. Duidelijke afspraken, snelle offerte en topkwaliteit geleverd."
  },
  {
    name: "Annelies de Kroon",
    city: "Reusel",
    rating: 5,
    date: "3 juli 2026",
    service: "Renovatie Pleisterwerk",
    text: "Voor onze woning in Reusel hebben we het team ingeschakeld voor renovatiepleisterwerk. Binnen een paar dagen waren de wanden strak en konden de schilders aan de slag. Super service en heel vriendelijk team."
  },
  {
    name: "Robert & Monique",
    city: "Bergeijk",
    rating: 5,
    date: "29 juni 2026",
    service: "Schuurwerk Plafond",
    text: "Kay heeft ons plafond voorzien van schuurwerk. Het ziet er schitterend uit, echt ambachtelijk handwerk met die prachtige draaiingen. Heel gezellige mannen ook, echte Brabantse gemoedelijkheid!"
  }
];

// Kempen Cities for SEO & targeting
const KEMPEN_CITIES = [
  "Bergeijk", "Westerhoven", "Luyksgestel", "Eersel", "Valkenswaard",
  "Duizel", "Hapert", "Steensel", "Bladel", "Reusel",
  "Lommel", "Pelt", "Riethoven", "Dommelen", "Borkel en Schaft", "Waalre", "Veldhoven",
];

const LOCAL_SEO_CITY_SLUGS: Record<string, string> = {
  Bergeijk: "bergeijk",
  Westerhoven: "westerhoven",
  Luyksgestel: "luyksgestel",
  Eersel: "eersel",
  Valkenswaard: "valkenswaard",
  Duizel: "duizel",
  Hapert: "hapert",
  Steensel: "steensel",
  Lommel: "lommel",
  Pelt: "pelt",
  Riethoven: "riethoven",
  Dommelen: "dommelen",
  "Borkel en Schaft": "borkel-en-schaft",
  Waalre: "waalre",
  Veldhoven: "veldhoven",
  Bladel: "bladel",
  Reusel: "reusel",
};

const TARGET_SERVICE_AREAS = [
  {
    city: "Bergeijk",
    text: "Stukadoor nodig in Bergeijk? Wij helpen met glad pleisterwerk, plafonds, renovatie en betonlook voor woningen in Bergeijk en omliggende dorpen.",
  },
  {
    city: "Westerhoven",
    text: "Voor stucwerk in Westerhoven komen Jeroen, Bram en Kay graag langs voor advies, inmeten en een duidelijke richtprijs.",
  },
  {
    city: "Luyksgestel",
    text: "In Luyksgestel verzorgen wij strak pleisterwerk, schuurwerk en renovatiestucwerk voor verbouw en renovatie.",
  },
  {
    city: "Eersel",
    text: "Zoekt u een stukadoor in Eersel? Wij leveren sausklaar pleisterwerk, schuurwerk en nette afwerking van wanden en plafonds.",
  },
  {
    city: "Valkenswaard",
    text: "Ook in Valkenswaard kunt u terecht voor professioneel stucwerk, betonlook badkamers en complete wand- en plafondafwerking.",
  },
  {
    city: "Duizel",
    text: "Voor woningen in Duizel bieden wij persoonlijk advies, heldere planning en strak afgewerkt stucwerk zonder onnodige voorrijkosten.",
  },
  {
    city: "Hapert",
    text: "In Hapert helpen wij met glad pleisterwerk, schuurwerk en renovatiestucwerk voor zowel kleine als grotere projecten.",
  },
  {
    city: "Steensel",
    text: "Voor stucwerk in Steensel werkt u direct met lokale vakmannen die netjes werken en duidelijke afspraken maken.",
  },
  {
    city: "Riethoven",
    text: "In Riethoven verzorgen wij strak pleisterwerk, herstelwerk en plafonds voor particuliere woningen en renovaties.",
  },
  {
    city: "Dommelen",
    text: "Voor stucwerk in Dommelen en omgeving leveren wij duidelijke offertes, nette afwerking en advies over droogtijd en schilderklaar opleveren.",
  },
  {
    city: "Borkel en Schaft",
    text: "Ook in Borkel en Schaft komen wij langs voor glad stucwerk, schuurwerk en renovatie van wanden en plafonds.",
  },
  {
    city: "Waalre",
    text: "Voor woningen in Waalre bieden wij professioneel pleisterwerk, schuurwerk en betonlook met een strakke planning.",
  },
  {
    city: "Veldhoven",
    text: "In Veldhoven helpen wij met stucwerk voor nieuwbouw en verbouw, van sausklaar pleisterwerk tot complete plafondafwerking.",
  },
  {
    city: "Bladel",
    text: "Ook in Bladel verzorgen wij glad pleisterwerk, schuurwerk en betonlook voor woningen en verbouwingen.",
  },
  {
    city: "Reusel",
    text: "Voor stucwerk in Reusel kunt u terecht voor advies op locatie, duidelijke prijzen en strak afgewerkte wanden.",
  },
  {
    city: "Lommel",
    text: "Ook net over de grens in Lommel kunnen wij meedenken over strak stucwerk, renovatie, pleisterwerk en betonlook afwerking.",
  },
  {
    city: "Pelt",
    text: "Voor Pelt en omgeving bieden wij advies en uitvoering voor glad pleisterwerk, schuurwerk en nette wand- en plafondafwerking.",
  },
];

const SEO_FAQS: { question: string; answer: React.ReactNode }[] = [
  {
    question: "Wat kost een stukadoor in de Kempen gemiddeld?",
    answer: (
      <>
        Voor glad pleisterwerk ligt de richtprijs vaak tussen €15 en €25 per m². Schuurwerk ligt vaak tussen €18 en €28 per m² en betonlook/microcement is maatwerk. Bekijk onze{" "}
        <a href="/stukadoor-prijzen" className="text-brand-clay-600 font-semibold hover:underline">
          richtprijzen per dienst
        </a>
        .
      </>
    ),
  },
  {
    question: "Werken jullie binnen 20 km van Bergeijk?",
    answer: (
      <>
        Ja, wij richten ons vooral op stucwerk binnen ongeveer 20 km van Bergeijk. Bekijk ons volledige{" "}
        <a href="/werkgebied" className="text-brand-clay-600 font-semibold hover:underline">
          werkgebied
        </a>{" "}
        met lokale pagina&apos;s per plaats.
      </>
    ),
  },
  {
    question: "Hoe lang moet stucwerk drogen voordat er geschilderd kan worden?",
    answer: (
      <>
        Gemiddeld droogt stucwerk ongeveer 1 dag per millimeter laagdikte bij goede ventilatie en normale temperatuur. Meer uitleg staat op onze pagina over{" "}
        <a href="/stucwerk-droogtijd" className="text-brand-clay-600 font-semibold hover:underline">
          stucwerk droogtijd
        </a>
        .
      </>
    ),
  },
  {
    question: "Kunnen jullie ook nieuwbouwwoningen strak pleisteren?",
    answer: (
      <>
        Ja, wij kunnen nieuwbouwwoningen strak pleisteren en sausklaar afwerken. Bekijk{" "}
        <a href="/glad-pleisterwerk" className="text-brand-clay-600 font-semibold hover:underline">
          glad pleisterwerk
        </a>{" "}
        voor meer informatie.
      </>
    ),
  },
  {
    question: "Doen jullie ook renovatiestucwerk in bestaande woningen?",
    answer: (
      <>
        Ja, wij herstellen en pleisteren bestaande wanden en plafonds bij verbouwingen en renovaties. Meer over{" "}
        <a href="/renovatiestucwerk" className="text-brand-clay-600 font-semibold hover:underline">
          renovatiestucwerk
        </a>
        .
      </>
    ),
  },
  {
    question: "Maken jullie betonlook badkamers en microcement?",
    answer: (
      <>
        Ja, betonlook en microcement zijn geschikt voor badkamers, keukens en accentwanden. Bekijk{" "}
        <a href="/betonlook-badkamer" className="text-brand-clay-600 font-semibold hover:underline">
          betonlook badkamer
        </a>{" "}
        of neem contact op voor advies op locatie.
      </>
    ),
  },
];

type ActiveTab = "home" | "services" | "team" | "calculator" | "contact" | "reviews" | "admin";
type LayoutStyle = "clean-pro" | "split" | "centered" | "bento" | "bento-dark" | "editorial" | "blueprint" | "red-blue" | "premium-blue" | "mega-wordmark" | "poster-split" | "stamp-brand";

const NAV_TABS: { id: ActiveTab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "services", label: "Onze Diensten" },
  { id: "team", label: "Ons Team (3 ZZP'ers)" },
  { id: "calculator", label: "Offerte-Calculator" },
  { id: "reviews", label: "Klantervaringen" },
  { id: "contact", label: "Contact & Aanvraag" }
];

const SERVICE_PAGE_SLUGS: Record<string, string> = {
  "glad-pleisterwerk": "glad-pleisterwerk",
  "betonlook": "betonlook-badkamer",
  "schuurwerk": "schuurwerk-plafond",
  "renovatiestucwerk": "renovatiestucwerk",
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layoutStyle] = useState<LayoutStyle>("bento");

  // Quote Calculator State
  const [calcService, setCalcService] = useState<string>("glad-pleisterwerk");
  const [calcArea, setCalcArea] = useState<number>(50);
  const [calcName, setCalcName] = useState<string>("");
  const [calcEmail, setCalcEmail] = useState<string>("");
  const [calcPhone, setCalcPhone] = useState<string>("");
  const [calcCity, setCalcCity] = useState<string>("Eersel");
  const [calcDesc, setCalcDesc] = useState<string>("");
  const [calcSuccess, setCalcSuccess] = useState<boolean>(false);
  const [calcLoading, setCalcLoading] = useState<boolean>(false);
  const [calcError, setCalcError] = useState<string>("");

  // Contact Form State
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactCity, setContactCity] = useState<string>("Eersel");
  const [contactType, setContactType] = useState<string>("glad-pleisterwerk");
  const [contactArea, setContactArea] = useState<string>("");
  const [contactMsg, setContactMsg] = useState<string>("");
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);
  const [contactLoading, setContactLoading] = useState<boolean>(false);
  const [contactError, setContactError] = useState<string>("");

  // AI Chat State
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "Hoi! Ik ben StucAdviseur, de slimme assistent van Stukadoorsteam De Kempen. Vraag me gerust alles over stucwerk, droogtijden, prijzen of welk type stucwerk het beste bij uw project in de Kempen past! Wat kan ik voor u betekenen?",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Selected Service Detail Modal
  const [selectedService, setSelectedService] = useState<PlasterService | null>(null);

  // Admin Panel State
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminQuotes, setAdminQuotes] = useState<QuoteRequest[]>([]);
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string>("");

  // Auto scroll to chat end
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatOpen]);

  // Load quotes for admin if authenticated
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminQuotes();
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    const pageMeta: Record<ActiveTab, { title: string; description: string }> = {
      home: {
        title: "Stukadoor binnen 20 km van Bergeijk | Eersel, Valkenswaard, Luyksgestel",
        description: "Stukadoorsteam De Kempen werkt binnen 20 km van Bergeijk: Westerhoven, Luyksgestel, Eersel, Valkenswaard, Duizel, Hapert, Steensel, Lommel, Pelt, Riethoven, Dommelen, Waalre, Veldhoven, Bladel en Reusel.",
      },
      services: {
        title: "Stucwerk diensten | Glad pleisterwerk, schuurwerk en betonlook",
        description: "Bekijk de stucwerk diensten van Stukadoorsteam De Kempen: glad pleisterwerk, schuurwerk, betonlook, microcement en renovatiestucwerk.",
      },
      team: {
        title: "Over Jeroen, Bram en Kay | Stukadoorsteam De Kempen",
        description: "Maak kennis met de lokale vakmannen achter Stukadoorsteam De Kempen.",
      },
      calculator: {
        title: "Offerte calculator stucwerk | Stukadoorsteam De Kempen",
        description: "Bereken online een richtprijs voor uw stucwerk en vraag vrijblijvend een offerte aan.",
      },
      reviews: {
        title: "Klantervaringen | Stukadoorsteam De Kempen",
        description: "Lees ervaringen van klanten uit Eersel, Bladel, Reusel en de Kempen.",
      },
      contact: {
        title: "Contact stukadoor binnen 20 km van Bergeijk | Stukadoorsteam De Kempen",
        description: "Vraag advies of een vrijblijvende offerte aan voor stucwerk binnen 20 km van Bergeijk, waaronder Eersel, Valkenswaard, Luyksgestel, Hapert, Steensel, Lommel, Pelt, Bladel en Reusel.",
      },
      admin: {
        title: "Leadbeheer | Stukadoorsteam De Kempen",
        description: "Beheer binnengekomen offerte-aanvragen.",
      },
    };

    const meta = pageMeta[activeTab];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  }, [activeTab]);

  // Fetch admin quotes from API
  const fetchAdminQuotes = async () => {
    setAdminLoading(true);
    setAdminError("");
    try {
      const res = await fetch("/api/quotes");
      if (!res.ok) throw new Error("Fout bij ophalen van offertes.");
      const data = await res.json();
      setAdminQuotes(data);
    } catch (err: any) {
      setAdminError(err.message || "Er ging iets fout.");
    } finally {
      setAdminLoading(false);
    }
  };

  // Delete/Archive quote from Admin panel
  const handleDeleteQuote = async (id: string) => {
    if (!window.confirm("Weet u zeker dat u deze offerte-aanvraag wilt archiveren/verwijderen?")) return;
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Kon offerte niet verwijderen.");
      // Refresh list
      setAdminQuotes(prev => prev.filter(q => q.id !== id));
    } catch (err: any) {
      alert(`Fout: ${err.message}`);
    }
  };

  // Calculate instant estimated price range
  const getEstimatedPriceRange = (serviceId: string, area: number) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return { min: 0, max: 0 };
    return {
      min: service.minPrice * area,
      max: service.maxPrice * area
    };
  };

  const currentCalcEstimate = getEstimatedPriceRange(calcService, calcArea);

  // Handle Quote Submission (Calculator)
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcName || !calcEmail || !calcPhone || !calcArea) {
      setCalcError("Vul alstublieft uw naam, e-mailadres, telefoonnummer en oppervlakte in.");
      return;
    }
    setCalcLoading(true);
    setCalcError("");

    const selectedServiceObj = SERVICES.find(s => s.id === calcService);
    const estimatedPrice = Math.round((currentCalcEstimate.min + currentCalcEstimate.max) / 2);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: calcName,
          email: calcEmail,
          phone: calcPhone,
          city: calcCity,
          plasterType: selectedServiceObj?.title || calcService,
          area: calcArea,
          description: calcDesc,
          estimatedPrice
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Aanvraag kon niet worden verstuurd.");
      }

      setCalcSuccess(true);
      // Reset form
      setCalcName("");
      setCalcEmail("");
      setCalcPhone("");
      setCalcDesc("");
    } catch (err: any) {
      setCalcError(err.message || "Er is een serverfout opgetreden. Probeer het later opnieuw.");
    } finally {
      setCalcLoading(false);
    }
  };

  // Handle Contact Form Submission (Simple redirect to quote API with 0 area or custom info)
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone) {
      setContactError("Vul alstublieft uw naam, e-mailadres en telefoonnummer in.");
      return;
    }
    setContactLoading(true);
    setContactError("");

    const selectedServiceObj = SERVICES.find(s => s.id === contactType);
    const areaVal = Number(contactArea) || 0;
    const est = getEstimatedPriceRange(contactType, areaVal);
    const estimatedPrice = Math.round((est.min + est.max) / 2);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          city: contactCity,
          plasterType: selectedServiceObj?.title || contactType,
          area: areaVal,
          description: contactMsg || "Algemene contactaanvraag",
          estimatedPrice
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Aanvraag kon niet worden verstuurd.");
      }

      setContactSuccess(true);
      // Reset form
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactArea("");
      setContactMsg("");
    } catch (err: any) {
      setContactError(err.message || "Er is een serverfout opgetreden.");
    } finally {
      setContactLoading(false);
    }
  };

  // Handle Chat message send to server-side Gemini AI
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");
    setChatLoading(true);

    try {
      // Map history to simple role/content for the backend proxy
      const historyPayload = chatMessages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          history: historyPayload
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kon geen verbinding maken met AI.");
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "model",
        content: data.reply,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        content: `Oeps! Er ging iets mis bij het praten met StucAdviseur: ${err.message}. Controleer uw internetverbinding of probeer het zo meteen nog eens.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Admin login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "kempenstuc") {
      setIsAdminAuthenticated(true);
      setAdminError("");
    } else {
      setAdminError("Onjuist wachtwoord. Tip: gebruik 'kempenstuc' voor demo doeleinden.");
    }
  };

  // Quick action to open chat with prefilled question
  const askStucAdviseur = (question: string) => {
    setChatOpen(true);
    setChatInput(question);
  };

  return (
    <div className="min-h-screen bg-brand-beige-50 bg-plaster-texture flex flex-col selection:bg-brand-clay-300 selection:text-brand-dark-950">
      
      {/* Header & Navigation */}
      <header id="app-header" className="sticky top-0 z-40 bg-brand-beige-50/95 backdrop-blur-lg border-b border-brand-beige-200/80 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => { setActiveTab("home"); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <img
                src="/logo-stukadoorsteam-de-kempen.png"
                alt="Stukadoorsteam De Kempen - vakwerk door teamwork"
                className="h-14 w-auto max-w-[210px] object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {NAV_TABS.map((tab) => (
                <button
                  id={`nav-btn-${tab.id}`}
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-brand-clay-500 text-white shadow-sm"
                      : "text-brand-dark-800 hover:bg-brand-beige-100 hover:text-brand-clay-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Quick Actions & Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="btn-quick-call"
                onClick={() => askStucAdviseur("Wat kost glad pleisterwerk gemiddeld?")}
                className="hidden lg:flex items-center gap-2 bg-brand-beige-100 text-brand-clay-700 hover:bg-brand-beige-200 px-4 py-2 rounded-lg font-medium text-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-brand-clay-500" />
                <span>StucAdviseur AI</span>
              </button>

              <button
                id="btn-header-calculator"
                onClick={() => { setActiveTab("calculator"); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="hidden sm:flex items-center gap-2 bg-brand-clay-500 hover:bg-brand-clay-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-brand-clay-500/20 transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>Offerte berekenen</span>
              </button>

              <button
                id="btn-admin-panel-toggle"
                onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }}
                className="hidden xl:flex p-2 rounded-lg border border-brand-beige-300 text-brand-dark-800 hover:bg-brand-beige-100 text-xs items-center gap-1.5 transition-all"
                title="Beheer Leads (Admin)"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Leadbeheer</span>
              </button>

              <button
                id="btn-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-brand-dark-800 hover:bg-brand-beige-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div id="mobile-navigation" className="md:hidden bg-brand-beige-50 border-t border-brand-beige-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn">
            {NAV_TABS.map((tab) => (
              <button
                id={`mobile-nav-btn-${tab.id}`}
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({top: 0, behavior: 'smooth'});
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium text-base transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-clay-500 text-white"
                    : "text-brand-dark-800 hover:bg-brand-beige-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="pt-4 border-t border-brand-beige-200 flex flex-col gap-2">
              <a href="tel:+31497123456" className="flex items-center gap-3 px-4 py-2 text-brand-dark-800 font-medium">
                <Phone className="w-5 h-5 text-brand-clay-500" />
                <span>Bel direct: 0497 - 123 456</span>
              </a>
              <button
                id="mobile-btn-calculator"
                onClick={() => { setActiveTab("calculator"); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="w-full bg-brand-clay-500 hover:bg-brand-clay-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                <span>Offerte berekenen</span>
              </button>
              <button
                id="mobile-btn-stucadviseur"
                onClick={() => { setChatOpen(true); setMobileMenuOpen(false); }}
                className="w-full bg-brand-beige-200 text-brand-clay-700 font-medium py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-brand-clay-500" />
                <span>Open StucAdviseur AI</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main className="flex-grow">
        
        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <div id="section-home" className="animate-fadeIn">

            {/* LAYOUT 0: STRAK PROFESSIONEEL */}
            {layoutStyle === "clean-pro" && (
              <section className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-7 space-y-8">
                      <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-900">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span>Stukadoors uit de Brabantse Kempen</span>
                      </div>

                      <div className="space-y-5">
                        <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.06em] text-blue-950">
                          Stukadoors Team
                          <span className="block text-red-600">De Kempen</span>
                        </h1>
                        <p className="max-w-2xl text-lg sm:text-xl leading-relaxed text-slate-700">
                          Strak stucwerk, heldere afspraken en vakmannen die zelf op de steiger staan. Voor pleisterwerk, schuurwerk, betonlook en renovatiestucwerk in de Kempen.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-red-600/15 transition-all flex items-center justify-center gap-2"
                        >
                          <Calculator className="w-5 h-5" />
                          <span>Bereken uw richtprijs</span>
                        </button>
                        <button
                          onClick={() => { setActiveTab("contact"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-blue-950 hover:bg-blue-900 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Phone className="w-5 h-5" />
                          <span>Vraag advies aan</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        {[
                          ["3 vakmannen", "Jeroen, Bram en Kay"],
                          ["5 jaar garantie", "NOA afbouwkwaliteit"],
                          ["Geen voorrijkosten", "In de hele Kempen"]
                        ].map(([title, subtitle]) => (
                          <div key={title} className="border-t border-slate-200 pt-4">
                            <p className="font-display font-bold text-blue-950">{title}</p>
                            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="relative">
                        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-100 to-red-100"></div>
                        <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-2xl aspect-[4/5]">
                          <img
                            src="/src/assets/images/hero_interior_1783519698007.jpg"
                            alt="Strak afgewerkt stucwerk door Stukadoors Team De Kempen"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=900";
                            }}
                          />
                          <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Professioneel afgewerkt</p>
                            <p className="mt-2 font-display text-xl font-bold text-blue-950">Glad, netjes en klaar voor schilderwerk.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* LAYOUT 1: MODERN SPLIT */}
            {layoutStyle === "split" && (
              <>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-12 pb-20 md:py-24">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      
                      {/* Hero Left Content */}
                      <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-brand-beige-100 border border-brand-beige-300 text-brand-clay-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5 text-brand-clay-500" />
                          <span>Actief in de hele Brabantse Kempen</span>
                        </div>

                        <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-brand-dark-900 leading-none tracking-tighter">
                          Stukadoor Team <br className="hidden sm:inline" />
                          <span className="text-brand-clay-600">De Kempen</span>
                        </h1>
                        <p className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-brand-dark-800 tracking-tight">
                          Vakmanschap & Spiegelglad resultaat
                        </p>

                        <p className="text-base sm:text-lg text-brand-dark-800 leading-relaxed max-w-xl">
                          Wij zijn <strong className="text-brand-dark-950 font-semibold">Stukadoorsteam De Kempen</strong>: 3 ervaren en vakkundige ZZP'ers (Jeroen, Bram en Kay). Samen leveren we topkwaliteit pleisterwerk, schuurwerk en betonlook in Eersel, Bladel, Reusel, Bergeijk, Valkenswaard en omstreken.
                        </p>

                        {/* USP Icons */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                          <div className="flex items-center gap-2 text-brand-dark-800 text-sm">
                            <CheckCircle className="w-4 h-4 text-brand-clay-600 flex-shrink-0" />
                            <span>3 Vakkundige ZZP'ers</span>
                          </div>
                          <div className="flex items-center gap-2 text-brand-dark-800 text-sm">
                            <CheckCircle className="w-4 h-4 text-brand-clay-600 flex-shrink-0" />
                            <span>Vrijblijvende Offerte</span>
                          </div>
                          <div className="flex items-center gap-2 text-brand-dark-800 text-sm">
                            <CheckCircle className="w-4 h-4 text-brand-clay-600 flex-shrink-0" />
                            <span>5 Jaar Garantie</span>
                          </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <button
                            id="hero-cta-calc"
                            onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                            className="bg-brand-clay-500 hover:bg-brand-clay-600 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-brand-clay-500/20 transition-all text-center flex items-center justify-center gap-2"
                          >
                            <Calculator className="w-5 h-5" />
                            <span>Bereken direct uw prijs</span>
                          </button>
                          <button
                            id="hero-cta-chat"
                            onClick={() => setChatOpen(true)}
                            className="bg-brand-beige-100 hover:bg-brand-beige-200 text-brand-clay-700 font-medium px-8 py-4 rounded-xl border border-brand-beige-300 transition-all text-center flex items-center justify-center gap-2"
                          >
                            <Sparkles className="w-5 h-5 text-brand-clay-500" />
                            <span>Vraag StucAdviseur AI</span>
                          </button>
                        </div>

                        {/* Local Targeting Links */}
                        <div className="pt-4 text-xs text-brand-clay-700/80">
                          <span className="font-semibold block mb-1.5 uppercase tracking-wide">Wij zijn dagelijks actief in:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {KEMPEN_CITIES.slice(0, 10).map((city, idx) => (
                              <span key={idx} className="bg-white/60 border border-brand-beige-200 px-2 py-0.5 rounded text-brand-dark-800">
                                stucen in {city}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Hero Right Image & Visual Cards */}
                      <div className="lg:col-span-5 relative mt-8 lg:mt-0">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-square lg:aspect-[4/5] bg-brand-beige-200">
                          <img 
                            src="/src/assets/images/stukadoor_vakwerk_1783519725470.jpg" 
                            alt="Stukadoor De Kempen aan het werk" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image doesn't load immediately
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600";
                            }}
                          />
                          
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-900/40 via-transparent to-transparent"></div>

                          {/* Floating Badge */}
                          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-brand-beige-100 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-brand-clay-100 flex items-center justify-center text-brand-clay-700">
                              <Award className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-display font-semibold text-sm text-brand-dark-900">Trots lid van NOA</p>
                              <p className="text-xs text-brand-clay-600">Gegarandeerde branchekwaliteit & afbouwgarantie</p>
                            </div>
                          </div>
                        </div>

                        {/* Backing decorative shapes */}
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-clay-200 rounded-full blur-2xl opacity-40 -z-10"></div>
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-brand-beige-300 rounded-full blur-3xl opacity-30 -z-10"></div>
                      </div>

                    </div>
                  </div>
                </section>

                {/* Region Callout Banner */}
                <section className="bg-brand-dark-900 text-brand-beige-100 py-12">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                      <div className="md:col-span-1 space-y-2">
                        <h2 className="font-display font-semibold text-2xl text-white">Geen voorrijkosten in de Kempen</h2>
                        <p className="text-brand-beige-300 text-sm">
                          Omdat wij stukadoors uit de regio zijn, rekenen we nooit extra reiskosten. Wij komen gratis bij u langs voor inspectie en advies.
                        </p>
                      </div>
                      <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {["Bladel", "Eersel", "Reusel", "Bergeijk"].map((c, i) => (
                          <div key={i} className="bg-brand-dark-800 border border-brand-dark-950 p-4 rounded-xl text-center">
                            <MapPin className="w-5 h-5 text-brand-clay-500 mx-auto mb-2" />
                            <span className="font-display font-medium text-white block text-sm">{c}</span>
                            <span className="text-[10px] text-brand-clay-300">Stucadoor in de buurt</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* LAYOUT 2: CENTERED IMPACT */}
            {layoutStyle === "centered" && (
              <>
                <section className="relative overflow-hidden pt-16 pb-20 md:py-28 bg-gradient-to-b from-brand-beige-100 to-transparent">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 bg-brand-beige-200 border border-brand-beige-300 text-brand-clay-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mx-auto">
                      <MapPin className="w-3.5 h-3.5 text-brand-clay-600" />
                      <span>Actief in de hele Brabantse Kempen</span>
                    </div>

                    <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-9xl text-brand-dark-900 leading-none tracking-tighter">
                      Stukadoor Team <br className="hidden sm:inline" />
                      <span className="text-brand-clay-600">De Kempen</span>
                    </h1>
                    <p className="font-display text-xl sm:text-3xl font-bold text-brand-dark-800 tracking-tight max-w-2xl mx-auto">
                      Vakmanschap & Spiegelglad resultaat
                    </p>

                    <p className="text-base sm:text-xl text-brand-dark-800 leading-relaxed max-w-2xl mx-auto">
                      Wij zijn <strong className="text-brand-dark-950 font-semibold">Stukadoorsteam De Kempen</strong>: 3 ervaren en vakkundige ZZP'ers (Jeroen, Bram en Kay). Samen leveren we topkwaliteit pleisterwerk, schuurwerk en betonlook in de Kempen.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 py-2">
                      <div className="flex items-center gap-2 text-brand-dark-800 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 text-brand-clay-600" />
                        <span>3 Vakkundige ZZP'ers</span>
                      </div>
                      <div className="flex items-center gap-2 text-brand-dark-800 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 text-brand-clay-600" />
                        <span>Vrijblijvende Offerte</span>
                      </div>
                      <div className="flex items-center gap-2 text-brand-dark-800 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 text-brand-clay-600" />
                        <span>5 Jaar NOA Garantie</span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                      <button
                        onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                        className="bg-brand-clay-500 hover:bg-brand-clay-600 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-brand-clay-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Calculator className="w-5 h-5" />
                        <span>Bereken direct uw prijs</span>
                      </button>
                      <button
                        onClick={() => setChatOpen(true)}
                        className="bg-white hover:bg-brand-beige-100 text-brand-clay-700 font-medium px-8 py-4 rounded-xl border border-brand-beige-300 shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-5 h-5 text-brand-clay-500" />
                        <span>Vraag StucAdviseur AI</span>
                      </button>
                    </div>

                    {/* Grote sfeerafbeelding gecentreerd */}
                    <div className="pt-10 max-w-3xl mx-auto">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[16/9] bg-brand-beige-200">
                        <img 
                          src="/src/assets/images/stukadoor_vakwerk_1783519725470.jpg" 
                          alt="Stukadoor De Kempen aan het werk" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-900/50 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 right-4 bg-brand-dark-900/80 backdrop-blur-sm text-brand-beige-100 text-xs px-3 py-1.5 rounded-lg border border-brand-dark-800">
                          Vakwerk op locatie in Reusel
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Backing decorative shapes */}
                  <div className="absolute top-1/2 left-10 w-64 h-64 bg-brand-clay-200 rounded-full blur-3xl opacity-30 -z-10 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 right-10 w-64 h-64 bg-brand-beige-300 rounded-full blur-3xl opacity-40 -z-10 -translate-y-1/2"></div>
                </section>

                {/* Gereduceerde Region Callout Banner */}
                <section className="bg-brand-dark-900 text-brand-beige-100 py-10">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                    <h2 className="font-display font-semibold text-xl text-white">Geen reiskosten in de gehele Kempen</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                      {["Bladel", "Eersel", "Reusel", "Bergeijk", "Valkenswaard"].map((c, i) => (
                        <span key={i} className="bg-brand-dark-800 border border-brand-dark-950 px-4 py-2 rounded-xl text-xs font-medium text-brand-beige-100 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-clay-500" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* LAYOUT 3: BENTO GRID */}
            {layoutStyle === "bento" && (
              <section className="py-14 md:py-20 bg-gradient-to-b from-white via-brand-beige-100/50 to-brand-beige-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="md:col-span-2 min-h-[420px] bg-gradient-to-br from-brand-dark-950 via-brand-dark-900 to-brand-dark-800 text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden group border border-brand-dark-800/50">
                      <BrandImage
                        src={IMAGES.hero}
                        alt=""
                        loading="eager"
                        zoom={false}
                        overlay={false}
                        className="absolute inset-0"
                        imageClassName="opacity-50"
                        objectPosition="center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark-950/92 via-brand-dark-900/88 to-brand-dark-800/80" aria-hidden="true" />
                      <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-clay-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                      <div className="absolute left-8 top-8 h-16 w-16 rounded-full border border-white/10" />
                      <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-brand-beige-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                          <MapPin className="w-3 h-3 text-brand-clay-400" />
                          <span>Binnen 20 km van Bergeijk</span>
                        </div>
                        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-none tracking-tighter">
                          Stukadoorsteam <br/>
                          <span className="text-brand-clay-500">De Kempen</span>
                        </h1>
                        <p className="text-brand-beige-200 text-sm sm:text-base max-w-xl leading-relaxed">
                          Jeroen, Bram & Kay leveren strak stucwerk in Bergeijk, Westerhoven, Luyksgestel, Eersel, Valkenswaard, Duizel, Hapert, Steensel en omliggende dorpen.
                        </p>
                      </div>

                      <div className="relative z-10 flex flex-col sm:flex-row gap-4 pt-8">
                        <button
                          onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-brand-clay-500 hover:bg-brand-clay-600 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-brand-clay-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                        >
                          <Calculator className="w-4 h-4" />
                          <span>Offerte berekenen</span>
                        </button>
                        <button
                          onClick={() => { setActiveTab("contact"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Phone className="w-4 h-4 text-brand-clay-400" />
                          <span>Gratis advies</span>
                        </button>
                      </div>
                    </div>

                    <div className="card-soft p-4 flex flex-col justify-between transition-all">
                      <BrandImage
                        src={IMAGES.vakwerk}
                        alt="Strak stucwerk door Stukadoorsteam De Kempen"
                        badge="Vakwerk op locatie"
                        className="rounded-2xl aspect-[4/3] md:aspect-square flex-grow"
                        objectPosition="center top"
                      />
                      <div className="pt-4 text-center">
                        <p className="font-display font-bold text-base text-brand-dark-900">Gratis advies op locatie</p>
                        <p className="text-xs text-brand-dark-800/70">Inmeten en meedenken zonder voorrijkosten</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-beige-200 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                      <div>
                        <div className="h-10 w-10 rounded-xl bg-brand-beige-100 flex items-center justify-center text-brand-clay-600 mb-4">
                          <User className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-brand-dark-900">Direct contact met de vakmannen</h3>
                        <p className="text-xs text-brand-dark-800 leading-relaxed mt-1">
                          Geen anonieme planning: Jeroen, Bram en Kay denken zelf mee en voeren het werk netjes uit.
                        </p>
                      </div>
                      <button
                        onClick={() => { setActiveTab("team"); window.scrollTo({top:0, behavior:'smooth'}); }}
                        className="text-brand-clay-600 hover:text-brand-clay-700 text-xs font-semibold flex items-center gap-1 group pt-2"
                      >
                        <span>Ontmoet Jeroen, Bram & Kay</span>
                        <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-brand-beige-100 to-white rounded-3xl p-6 shadow-sm border border-brand-beige-200 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                      <div>
                        <div className="h-10 w-10 rounded-xl bg-brand-clay-500 text-white flex items-center justify-center mb-4">
                          <Calculator className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-brand-dark-900">Offerte berekenen</h3>
                        <p className="text-xs text-brand-dark-800 leading-relaxed mt-3">
                          Gebruik onze online calculator voor een live prijsindicatie. Daarna kunt u direct een vrijblijvende offerte aanvragen.
                        </p>
                      </div>
                      <button
                        onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                        className="text-brand-clay-600 hover:text-brand-clay-700 text-xs font-semibold flex items-center gap-1 group"
                      >
                        <span>Offerte berekenen</span>
                        <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-beige-200 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center gap-1 text-brand-clay-500 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-brand-clay-500 text-brand-clay-500" />
                          ))}
                        </div>
                        <h3 className="font-display font-bold text-base text-brand-dark-900">"Spiegelglad werk!"</h3>
                        <p className="text-xs text-brand-dark-800 italic mt-1.5 line-clamp-3">
                          "Onze hele nieuwbouwwoning in Eersel is door het team strak gepleisterd. Het resultaat is echt fenomenaal, spiegelglad en snel!"
                        </p>
                        <p className="text-[11px] text-brand-clay-600 mt-2 font-medium">— Fam. van de Gevel, Eersel</p>
                      </div>
                      <button
                        onClick={() => { setActiveTab("reviews"); window.scrollTo({top:0, behavior:'smooth'}); }}
                        className="text-brand-clay-600 hover:text-brand-clay-700 text-xs font-semibold flex items-center gap-1 group"
                      >
                        <span>Lees al onze reviews</span>
                        <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>

                  <section className="mt-10">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay-600 block">
                          Ons werk
                        </span>
                        <h2 className="section-title text-2xl sm:text-3xl text-brand-dark-900 mt-1">
                          Strak stucwerk, mooi in beeld
                        </h2>
                      </div>
                      <button
                        onClick={() => { setActiveTab("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-brand-clay-600 hover:text-brand-clay-700"
                      >
                        Bekijk alle diensten
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {SHOWCASE.map((item) => (
                        <article key={item.title} className="card-soft overflow-hidden transition-all">
                          <BrandImage
                            src={item.src}
                            alt={item.alt}
                            className="h-56 md:h-64"
                            objectPosition={item.objectPosition}
                            badge={item.title}
                          />
                          <div className="p-4">
                            <p className="font-display font-bold text-brand-dark-900">{item.title}</p>
                            <p className="text-xs text-brand-dark-800/70 mt-1">{item.subtitle}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: ShieldCheck, title: "5 jaar garantie", subtitle: "NOA afbouwkwaliteit" },
                      { icon: MapPin, title: "Geen voorrijkosten", subtitle: "Binnen 20 km Bergeijk" },
                      { icon: Award, title: "3 vakmannen", subtitle: "Jeroen, Bram & Kay" },
                      { icon: ThumbsUp, title: "Stofvrij schuren", subtitle: "Professionele afzuiging" },
                    ].map(({ icon: Icon, title, subtitle }) => (
                      <div key={title} className="bg-white rounded-2xl border border-brand-beige-200 p-4 flex items-start gap-3 shadow-sm">
                        <div className="h-9 w-9 rounded-xl bg-brand-clay-100 text-brand-clay-600 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm text-brand-dark-900">{title}</p>
                          <p className="text-[11px] text-brand-dark-800/70 mt-0.5">{subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <section className="mt-12 bg-white rounded-3xl border border-brand-beige-200 shadow-sm p-6 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-5 space-y-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay-600 block">
                          Lokale stukadoor in de Kempen
                        </span>
                        <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-dark-900">
                          Stucwerk binnen 20 km van Bergeijk
                        </h2>
                        <p className="text-sm text-brand-dark-800 leading-relaxed">
                          Zoekt u een stukadoor dichtbij Bergeijk? Wij richten ons op woningen binnen ongeveer 20 km van Bergeijk, waaronder Westerhoven, Luyksgestel, Eersel, Valkenswaard, Duizel, Hapert, Steensel, Lommel, Pelt, Riethoven, Dommelen, Waalre, Veldhoven, Bladel en Reusel.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                          <a href="/werkgebied" className="inline-flex items-center gap-1.5 bg-brand-clay-500 hover:bg-brand-clay-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                            Werkgebied bekijken
                            <ChevronRight className="w-3.5 h-3.5" />
                          </a>
                          <a href="/stukadoor-prijzen" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-clay-600 hover:text-brand-clay-700 px-2 py-2">
                            Richtprijzen
                          </a>
                          <a href="/diensten" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-clay-600 hover:text-brand-clay-700 px-2 py-2">
                            Alle diensten
                          </a>
                        </div>
                      </div>
                      <div className="lg:col-span-7 space-y-5">
                        <div className="flex flex-wrap gap-2">
                          {KEMPEN_CITIES.map((city) => {
                            const slug = LOCAL_SEO_CITY_SLUGS[city];
                            if (!slug) {
                              return (
                                <span key={city} className="rounded-full bg-brand-beige-100 border border-brand-beige-200 px-3 py-1.5 text-xs font-medium text-brand-dark-800">
                                  stukadoor {city}
                                </span>
                              );
                            }
                            return (
                              <a key={city} href={`/stukadoor-${slug}`} className="rounded-full bg-brand-beige-100 border border-brand-beige-200 px-3 py-1.5 text-xs font-medium text-brand-dark-900 hover:border-brand-clay-400 hover:text-brand-clay-700 hover:bg-brand-clay-100/50 transition-colors">
                                stukadoor {city}
                              </a>
                            );
                          })}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { label: "Glad pleisterwerk voor wanden en plafonds", href: "/glad-pleisterwerk" },
                            { label: "Renovatiepleisterwerk voor wanden en plafonds", href: "/renovatiestucwerk" },
                            { label: "Schuurwerk voor een ambachtelijke plafondafwerking", href: "/schuurwerk-plafond" },
                            { label: "Betonlook en microcement voor badkamer of keuken", href: "/betonlook-badkamer" },
                          ].map((item) => (
                            <a key={item.href} href={item.href} className="flex items-start gap-2 text-sm text-brand-dark-800 hover:text-brand-clay-700 transition-colors bg-brand-beige-50/80 rounded-xl p-3 border border-brand-beige-100 hover:border-brand-clay-300">
                              <CheckCircle className="w-4 h-4 text-brand-clay-500 mt-0.5 flex-shrink-0" />
                              <span>{item.label}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="mt-8 bg-white rounded-3xl border border-brand-beige-200 shadow-sm p-6 sm:p-8">
                    <div className="max-w-3xl space-y-3 mb-6">
                      <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay-600 block">
                        Werkgebied
                      </span>
                      <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-dark-900">
                        Stukadoor per plaats binnen 20 km van Bergeijk
                      </h2>
                      <p className="text-sm text-brand-dark-800 leading-relaxed">
                        Door ons werkgebied bewust compact te houden, kunnen we snel komen kijken, duidelijk adviseren en zonder onnodige reiskosten werken in dorpen rondom Bergeijk.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {TARGET_SERVICE_AREAS.map((area) => (
                        <article key={area.city} className="rounded-2xl bg-brand-beige-50 border border-brand-beige-200 p-5 hover:border-brand-clay-300 hover:shadow-sm transition-all">
                          <h3 className="font-display font-bold text-lg text-brand-dark-900">
                            Stukadoor {area.city}
                          </h3>
                          <p className="text-sm text-brand-dark-800 leading-relaxed mt-2">
                            {area.text}
                          </p>
                          <a
                            href={`/stukadoor-${LOCAL_SEO_CITY_SLUGS[area.city] ?? area.city.toLowerCase().replaceAll(" ", "-")}`}
                            className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-brand-clay-600 hover:text-brand-clay-700"
                          >
                            Lees meer over stucwerk in {area.city}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </a>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 bg-brand-dark-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
                      <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay-400 block">
                        Veelgestelde vragen
                      </span>
                      <h2 className="font-display font-bold text-2xl sm:text-3xl mt-3">
                        Antwoorden over stucwerk, prijzen en droogtijd
                      </h2>
                      <p className="text-sm text-brand-beige-200 leading-relaxed mt-4">
                        Snel antwoord op de meest gestelde vragen over stucwerk, richtprijzen en droogtijd in de Kempen.
                      </p>
                    </div>
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {SEO_FAQS.map((faq) => (
                        <article key={faq.question} className="bg-white rounded-2xl border border-brand-beige-200 p-5 shadow-sm hover:border-brand-clay-300 hover:shadow-md transition-all">
                          <h3 className="font-display font-bold text-base text-brand-dark-900">
                            {faq.question}
                          </h3>
                          <p className="text-sm text-brand-dark-800 leading-relaxed mt-2">
                            {faq.answer}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>

                </div>
              </section>
            )}

            {/* LAYOUT 4: BENTO GRID (DONKER) */}
            {layoutStyle === "bento-dark" && (
              <section className="py-12 bg-brand-dark-950 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  {/* Bento Grid Container */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* CARD 1: Main Welcome & Brand (Large - spans 2 columns on md/lg) */}
                    <div className="md:col-span-2 bg-gradient-to-br from-brand-dark-900 to-brand-dark-800 border border-brand-dark-800 rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-clay-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-brand-clay-500/10 border border-brand-clay-500/20 text-brand-clay-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                          <MapPin className="w-3 h-3 text-brand-clay-500" />
                          <span>Brabantse Kempen</span>
                        </div>
                        <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-none tracking-tighter text-white">
                          Stukadoor Team <br/>
                          <span className="text-brand-clay-500">De Kempen</span>
                        </h2>
                        <p className="text-brand-beige-100 text-sm sm:text-base max-w-xl leading-relaxed opacity-90">
                          Jeroen, Bram & Kay: drie gepassioneerde lokale ZZP'ers verenigd in één hecht team. Wij garanderen u de allerbeste kwaliteit stucwerk, pleisterwerk en betonlook in de Kempen met 5 jaar NOA afbouwgarantie.
                        </p>
                      </div>

                      <div className="relative z-10 flex flex-col sm:flex-row gap-4 pt-8">
                        <button
                          onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-brand-clay-500 hover:bg-brand-clay-600 text-white font-medium px-6 py-3.5 rounded-xl shadow-lg shadow-brand-clay-500/20 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Calculator className="w-4 h-4" />
                          <span>Offerte berekenen</span>
                        </button>
                        <button
                          onClick={() => setChatOpen(true)}
                          className="bg-brand-dark-800 hover:bg-brand-dark-700 text-brand-beige-100 border border-brand-dark-700 font-medium px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Sparkles className="w-4 h-4 text-brand-clay-500" />
                          <span>StucAdviseur AI</span>
                        </button>
                      </div>
                    </div>

                    {/* CARD 2: Image Showcase (1 col) */}
                    <div className="bg-brand-dark-900 border border-brand-dark-800 rounded-3xl p-4 shadow-2xl flex flex-col justify-between">
                      <div className="rounded-2xl overflow-hidden aspect-[4/3] md:aspect-square flex-grow bg-brand-dark-950 relative">
                        <img 
                          src="/src/assets/images/stukadoor_vakwerk_1783519725470.jpg" 
                          alt="Vakwerk" 
                          className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600";
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-brand-clay-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                          100% Kwaliteit
                        </div>
                      </div>
                      <div className="pt-4 text-center">
                        <p className="font-display font-bold text-base text-white">Geen voorrijkosten</p>
                        <p className="text-xs text-brand-clay-400">Gratis advies & opmeten ter plaatse</p>
                      </div>
                    </div>

                    {/* CARD 3: Direct ZZP Team Info (1 col) */}
                    <div className="bg-brand-dark-900 border border-brand-dark-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <div className="h-10 w-10 rounded-xl bg-brand-clay-500/20 text-brand-clay-400 flex items-center justify-center mb-4">
                          <User className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-white">Ons Team van 3</h3>
                        <p className="text-xs text-brand-beige-200 leading-relaxed mt-1 opacity-80 font-normal">
                          Jeroen (glad pleisterwerk), Bram (renovatie) & Kay (schuurwerk en betonlook). Samen vangen we elk project op!
                        </p>
                      </div>
                      <button
                        onClick={() => { setActiveTab("team"); window.scrollTo({top:0, behavior:'smooth'}); }}
                        className="text-brand-clay-400 hover:text-brand-clay-300 text-xs font-semibold flex items-center gap-1 group pt-2"
                      >
                        <span>Ontmoet Jeroen, Bram & Kay</span>
                        <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* CARD 4: Offerte calculator (1 col) */}
                    <div className="bg-gradient-to-br from-brand-dark-900 to-brand-dark-950 border border-brand-dark-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <div className="h-10 w-10 rounded-xl bg-brand-clay-500 text-white flex items-center justify-center mb-4">
                          <Calculator className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-white">Offerte berekenen</h3>
                        <p className="text-xs text-brand-beige-100 leading-relaxed mt-3 opacity-90">
                          Gebruik onze online calculator voor een live prijsindicatie en vraag direct een offerte aan.
                        </p>
                      </div>
                      <button
                        onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                        className="text-brand-clay-400 hover:text-brand-clay-300 text-xs font-semibold flex items-center gap-1 group"
                      >
                        <span>Offerte berekenen</span>
                        <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* CARD 5: Live Review Snippet (1 col) */}
                    <div className="bg-brand-dark-900 border border-brand-dark-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-1 text-amber-500 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Sparkles key={i} className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                          ))}
                        </div>
                        <h3 className="font-display font-bold text-base text-white">"Spiegelglad werk!"</h3>
                        <p className="text-xs text-brand-beige-200 italic mt-1.5 line-clamp-3 opacity-85 leading-relaxed font-normal">
                          "Onze hele nieuwbouwwoning in Eersel is door het team strak gepleisterd. Het resultaat is echt fenomenaal, spiegelglad en snel!"
                        </p>
                        <p className="text-[11px] text-brand-clay-400 mt-2 font-medium">— Fam. van de Gevel, Eersel</p>
                      </div>
                      <button
                        onClick={() => { setActiveTab("reviews"); window.scrollTo({top:0, behavior:'smooth'}); }}
                        className="text-brand-clay-400 hover:text-brand-clay-300 text-xs font-semibold flex items-center gap-1 group"
                      >
                        <span>Lees al onze reviews</span>
                        <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>

                </div>
              </section>
            )}

            {/* LAYOUT 5: MODERN TIJDSCHRIFT (EDITORIAL) */}
            {layoutStyle === "editorial" && (
              <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  {/* Editorial Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    
                    {/* Left Column: Big Statement & Brand Info */}
                    <div className="lg:col-span-8 space-y-8">
                      <div className="inline-flex items-center gap-2 border-l-4 border-brand-clay-500 pl-3">
                        <span className="text-xs font-bold text-brand-clay-700 uppercase tracking-widest">Gespecialiseerd Stucadoorsteam</span>
                      </div>

                      <h1 className="font-display font-black text-6xl sm:text-8xl lg:text-9xl text-brand-dark-900 tracking-tighter leading-none">
                        Stukadoor Team <br/>
                        <span className="text-brand-clay-600 block mt-2">De Kempen</span>
                      </h1>

                      <p className="text-xl text-brand-dark-800 font-medium leading-relaxed max-w-2xl">
                        Drie zelfstandige vakmannen. Eén perfect resultaat. Jeroen, Bram en Kay bundelen hun krachten om uw muren om te toveren tot spiegelglad stucwerk.
                      </p>

                      <p className="text-base text-brand-dark-800 leading-relaxed max-w-xl">
                        Geen gedoe met grote anonieme bedrijven. Bij ons heeft u direct contact met de stukadoor die op de steiger staat. Wij werken snel, netjes en met uiterste precisie in de hele Brabantse Kempen.
                      </p>

                      {/* Editorial Stats */}
                      <div className="grid grid-cols-3 gap-6 pt-6 border-t border-brand-beige-200">
                        <div>
                          <p className="font-display font-black text-3xl sm:text-4xl text-brand-clay-600">3</p>
                          <p className="text-xs text-brand-dark-800 font-semibold uppercase tracking-wider mt-1">ZZP Vakmannen</p>
                        </div>
                        <div>
                          <p className="font-display font-black text-3xl sm:text-4xl text-brand-clay-600">100%</p>
                          <p className="text-xs text-brand-dark-800 font-semibold uppercase tracking-wider mt-1">Kempen Regio</p>
                        </div>
                        <div>
                          <p className="font-display font-black text-3xl sm:text-4xl text-brand-clay-600">5jr</p>
                          <p className="text-xs text-brand-dark-800 font-semibold uppercase tracking-wider mt-1">NOA Garantie</p>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-brand-dark-900 hover:bg-brand-dark-950 text-white font-medium px-8 py-4 rounded-none transition-all flex items-center justify-center gap-2 tracking-wide uppercase text-xs"
                        >
                          <Calculator className="w-4 h-4" />
                          <span>Prijsindicatie Berekenen</span>
                        </button>
                        <button
                          onClick={() => setChatOpen(true)}
                          className="bg-white hover:bg-brand-beige-50 text-brand-dark-900 border-2 border-brand-dark-900 font-medium px-8 py-4 rounded-none transition-all flex items-center justify-center gap-2 tracking-wide uppercase text-xs"
                        >
                          <Sparkles className="w-4 h-4 text-brand-clay-600" />
                          <span>Praat met StucAI</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Giant Portrait Showcase & Floating Highlight */}
                    <div className="lg:col-span-4 space-y-8">
                      <div className="relative rounded-none overflow-hidden bg-brand-beige-200 aspect-[3/4] border-8 border-brand-beige-100 shadow-xl">
                        <img 
                          src="/src/assets/images/stukadoor_vakwerk_1783519725470.jpg" 
                          alt="Vakmanschap" 
                          className="w-full h-full object-cover filter contrast-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600";
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-dark-900/60 p-6 text-white">
                          <p className="text-xs uppercase tracking-widest font-semibold opacity-85">Reusel, Noord-Brabant</p>
                          <p className="font-display font-bold text-lg mt-1">Traditioneel pleisterwerk</p>
                        </div>
                      </div>

                      {/* Pull Quote Card */}
                      <div className="bg-brand-beige-50 p-6 border-l-4 border-brand-clay-500">
                        <p className="text-sm text-brand-dark-800 italic leading-relaxed font-medium">
                          "Wij leveren geen half werk. Als het stucwerk niet spiegelglad is, zijn wij niet tevreden. Wij wonen en werken in de Kempen en willen dat onze reputatie altijd vlekkeloos blijft."
                        </p>
                        <p className="text-xs font-bold text-brand-clay-700 uppercase tracking-wider mt-3">— Jeroen, Bram & Kay</p>
                      </div>
                    </div>

                  </div>

                </div>
              </section>
            )}

            {/* LAYOUT 6: BLUEPRINT PRO */}
            {layoutStyle === "blueprint" && (
              <section className="relative overflow-hidden bg-blue-950 text-white py-16 md:py-24">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#60a5fa 1px, transparent 1px), linear-gradient(90deg, #60a5fa 1px, transparent 1px)", backgroundSize: "42px 42px" }}></div>
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-600/30 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7 space-y-7">
                      <div className="inline-flex items-center gap-2 bg-white/10 border border-blue-300/30 text-blue-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
                        <ShieldCheck className="w-4 h-4 text-red-400" />
                        <span>Strak gepland. Strak gestuct.</span>
                      </div>
                      <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-none tracking-tighter">
                        Precisie op <span className="text-red-500">elk vlak</span>
                      </h1>
                      <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl">
                        Een technische, betrouwbare uitstraling voor klanten die zekerheid zoeken: duidelijke planning, nette werkplek en strak eindresultaat door drie vakmannen uit De Kempen.
                      </p>
                      <div className="grid grid-cols-3 gap-3 max-w-xl">
                        {[
                          ["3", "ZZP vakmannen"],
                          ["5jr", "NOA garantie"],
                          ["0", "voorrijkosten"]
                        ].map(([value, label]) => (
                          <div key={label} className="rounded-2xl border border-blue-300/25 bg-white/10 p-4 backdrop-blur">
                            <p className="font-display text-3xl font-black text-white">{value}</p>
                            <p className="mt-1 text-[11px] uppercase tracking-wider text-blue-100">{label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-red-950/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Calculator className="w-5 h-5" />
                          <span>Bereken mijn project</span>
                        </button>
                        <button
                          onClick={() => setChatOpen(true)}
                          className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-5 h-5 text-red-400" />
                          <span>Vraag advies</span>
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="relative rounded-[2rem] border border-blue-300/30 bg-white/10 p-4 shadow-2xl backdrop-blur">
                        <div className="overflow-hidden rounded-[1.5rem] aspect-[4/5] bg-blue-900">
                          <img
                            src="/src/assets/images/stukadoor_vakwerk_1783519725470.jpg"
                            alt="Strak stucwerk van Stukadoorsteam De Kempen"
                            className="h-full w-full object-cover mix-blend-luminosity opacity-90"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800";
                            }}
                          />
                        </div>
                        <div className="absolute -bottom-6 left-8 right-8 rounded-2xl bg-white text-blue-950 p-5 shadow-xl">
                          <p className="text-xs font-bold uppercase tracking-widest text-red-600">Projectzekerheid</p>
                          <p className="font-display text-xl font-black">Opmeten, plannen, opleveren.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* LAYOUT 7: ROOD/BLAUW ACTIE */}
            {layoutStyle === "red-blue" && (
              <section className="relative overflow-hidden bg-white py-14 md:py-20">
                <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 bg-red-600"></div>
                <div className="absolute inset-y-0 right-0 hidden lg:block w-1/2 bg-blue-950"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <div className="text-white rounded-3xl lg:rounded-none p-8 md:p-12 min-h-[520px] flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white text-red-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                          <Zap className="w-4 h-4" />
                          <span>Pak direct uw voordeel</span>
                        </div>
                        <h1 className="font-display font-black text-5xl sm:text-7xl leading-none tracking-tighter">
                          Snel een <span className="text-blue-950">strakke wand?</span>
                        </h1>
                        <p className="text-lg text-red-50 leading-relaxed max-w-xl">
                          Een krachtige actie-layout met veel contrast. Ideaal als u bezoekers snel naar de offerte-calculator of contactaanvraag wilt sturen.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 pt-8">
                        <button
                          onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Euro className="w-5 h-5" />
                          <span>Prijs berekenen</span>
                        </button>
                        <button
                          onClick={() => { setActiveTab("contact"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-white hover:bg-red-50 text-red-700 font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Phone className="w-5 h-5" />
                          <span>Neem contact op</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-950 text-white rounded-3xl lg:rounded-none p-8 md:p-12 min-h-[520px] flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute -right-16 top-12 h-56 w-56 rounded-full bg-red-600/30 blur-3xl"></div>
                      <div className="relative z-10 rounded-3xl overflow-hidden border-8 border-white/10 aspect-[16/10] bg-blue-900 shadow-2xl">
                        <img
                          src="/src/assets/images/hero_interior_1783519698007.jpg"
                          alt="Afgewerkte ruimte met stucwerk"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=900";
                          }}
                        />
                      </div>
                      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8">
                        {["Glad pleisterwerk", "Schuurwerk", "Betonlook"].map((service) => (
                          <div key={service} className="rounded-2xl bg-white/10 border border-white/15 p-4">
                            <CheckCircle className="w-5 h-5 text-red-400 mb-3" />
                            <p className="text-sm font-bold">{service}</p>
                            <p className="text-xs text-blue-100 mt-1">Snel advies op maat</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* LAYOUT 8: PREMIUM TRUST */}
            {layoutStyle === "premium-blue" && (
              <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-red-50 py-16 md:py-24">
                <div className="absolute left-1/2 top-0 h-full w-px bg-blue-100 hidden lg:block"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 space-y-7">
                      <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Award className="w-4 h-4 text-red-600" />
                        <span>Premium uitstraling voor vakwerk</span>
                      </div>
                      <h1 className="font-display font-black text-5xl sm:text-7xl leading-none tracking-tighter text-blue-950">
                        De nette keuze voor <span className="text-red-600">perfect stucwerk</span>
                      </h1>
                      <p className="text-lg text-blue-950/75 leading-relaxed max-w-xl">
                        Rustiger, betrouwbaarder en professioneler. Deze variant voelt premium aan en gebruikt rood vooral voor actieknoppen en accenten.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Calculator className="w-5 h-5" />
                          <span>Vrijblijvende offerte</span>
                        </button>
                        <button
                          onClick={() => setChatOpen(true)}
                          className="bg-blue-950 hover:bg-blue-900 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span>Stel een vraag</span>
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 rounded-[2rem] bg-blue-950 p-6 text-white shadow-2xl">
                          <p className="text-xs font-bold uppercase tracking-widest text-red-400">Waarom deze layout werkt</p>
                          <p className="font-display text-3xl font-black mt-3">Veel vertrouwen, minder drukte.</p>
                          <p className="text-sm text-blue-100 mt-3 max-w-lg">Sterk voor een lokaal vakbedrijf dat professioneel en bereikbaar wil overkomen.</p>
                        </div>
                        <div className="rounded-[2rem] bg-white border border-blue-100 p-6 shadow-lg">
                          <BadgeCheck className="w-8 h-8 text-red-600 mb-5" />
                          <p className="font-display text-2xl font-black text-blue-950">5 jaar</p>
                          <p className="text-sm text-blue-950/70">garantie op afbouwkwaliteit</p>
                        </div>
                        <div className="rounded-[2rem] bg-red-600 p-6 shadow-lg text-white">
                          <MapPin className="w-8 h-8 mb-5" />
                          <p className="font-display text-2xl font-black">Kempen</p>
                          <p className="text-sm text-red-50">lokaal team, korte lijnen</p>
                        </div>
                        <div className="col-span-2 rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl aspect-[16/8] bg-blue-100">
                          <img
                            src="/src/assets/images/betonlook_wall_1783519711432.jpg"
                            alt="Premium betonlook afwerking"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* LAYOUT 9: MEGA WORDMARK */}
            {layoutStyle === "mega-wordmark" && (
              <section className="relative overflow-hidden bg-blue-950 text-white min-h-[760px] flex items-center py-16">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.35),transparent_40%)]"></div>
                <div className="absolute inset-x-0 top-8 text-center pointer-events-none">
                  <p className="font-display font-black text-[16vw] leading-[0.78] tracking-[-0.09em] uppercase text-white/5 select-none">
                    Kempen
                  </p>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-600/15 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-red-100">
                      <MapPin className="h-4 w-4" />
                      <span>De naam groot in beeld</span>
                    </div>
                    <h1 className="font-display font-black uppercase text-[17vw] sm:text-[14vw] lg:text-[10.8rem] leading-[0.78] tracking-[-0.08em]">
                      Stukadoors
                      <span className="block text-red-500">Team</span>
                      <span className="block text-blue-200">De Kempen</span>
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                      <p className="lg:col-span-7 text-lg sm:text-xl text-blue-100 max-w-3xl leading-relaxed">
                        Een opvallende merk-layout: eerst de naam, daarna pas de details. Ideaal als u wilt dat bezoekers “Stukadoors Team De Kempen” direct onthouden.
                      </p>
                      <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-4">
                        <button
                          onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-red-950/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Calculator className="w-5 h-5" />
                          <span>Offerte berekenen</span>
                        </button>
                        <button
                          onClick={() => setChatOpen(true)}
                          className="bg-white text-blue-950 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-5 h-5 text-red-600" />
                          <span>StucAdviseur</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* LAYOUT 10: POSTER SPLIT */}
            {layoutStyle === "poster-split" && (
              <section className="bg-white py-10 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="overflow-hidden rounded-[2.5rem] shadow-2xl border border-blue-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="bg-red-600 text-white p-8 sm:p-12 lg:p-16 min-h-[560px] flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs font-black uppercase tracking-[0.28em]">Stucwerk / Brabant</span>
                          <span className="rounded-full bg-blue-950 px-4 py-2 text-xs font-black">Sinds vakdag 1</span>
                        </div>
                        <h1 className="font-display font-black uppercase text-6xl sm:text-8xl lg:text-9xl leading-[0.78] tracking-[-0.08em]">
                          Stukadoors<br />
                          Team<br />
                          <span className="text-blue-950">De Kempen</span>
                        </h1>
                        <div className="flex flex-wrap gap-3">
                          {["Glad", "Snel", "Lokaal", "Netjes"].map((label) => (
                            <span key={label} className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-red-700">
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-blue-950 text-white p-8 sm:p-12 lg:p-16 min-h-[560px] flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-600/30 blur-3xl"></div>
                        <div className="relative z-10 rounded-[2rem] overflow-hidden border-8 border-white/10 aspect-[4/3] bg-blue-900 shadow-xl">
                          <img
                            src="/src/assets/images/stukadoor_vakwerk_1783519725470.jpg"
                            alt="Stukadoors Team De Kempen aan het werk"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=900";
                            }}
                          />
                        </div>
                        <div className="relative z-10 space-y-6 pt-8">
                          <p className="text-xl font-semibold leading-relaxed text-blue-50">
                            Posterachtig, krachtig en direct herkenbaar. De naam is groot genoeg om als echte campagnekop te werken.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <button
                              onClick={() => { setActiveTab("contact"); window.scrollTo({top:0, behavior:'smooth'}); }}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              <Phone className="w-5 h-5" />
                              <span>Neem contact op</span>
                            </button>
                            <button
                              onClick={() => { setActiveTab("services"); window.scrollTo({top:0, behavior:'smooth'}); }}
                              className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-7 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              <ChevronRight className="w-5 h-5" />
                              <span>Bekijk diensten</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* LAYOUT 11: STEMPEL MERK */}
            {layoutStyle === "stamp-brand" && (
              <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-16 md:py-24">
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "repeating-linear-gradient(-12deg, transparent 0 22px, rgba(255,255,255,0.18) 22px 24px)" }}></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-5 space-y-6">
                      <div className="inline-flex items-center gap-2 bg-white text-blue-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                        <BadgeCheck className="w-4 h-4 text-red-600" />
                        <span>Lokaal vakwerk</span>
                      </div>
                      <p className="text-lg text-blue-100 leading-relaxed">
                        Een robuuste variant met een groot stempelgevoel. Past goed als u stoer, lokaal en betrouwbaar wilt overkomen.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ["Jeroen", "Glad pleisterwerk"],
                          ["Bram", "Renovatie"],
                          ["Kay", "Schuurwerk"],
                          ["Kempen", "Geen voorrijkosten"]
                        ].map(([title, subtitle]) => (
                          <div key={title} className="rounded-2xl bg-white/10 border border-white/15 p-4">
                            <p className="font-display font-black text-xl">{title}</p>
                            <p className="text-xs text-blue-100 mt-1">{subtitle}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="relative rounded-[2.5rem] border-[10px] border-red-600 bg-white p-5 sm:p-8 text-blue-950 shadow-2xl rotate-[-2deg]">
                        <div className="border-4 border-blue-950 rounded-[1.75rem] p-6 sm:p-10 text-center">
                          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.35em] text-red-600">Gecertificeerd vakteam</p>
                          <h1 className="font-display font-black uppercase text-5xl sm:text-7xl lg:text-8xl leading-[0.82] tracking-[-0.07em] mt-5">
                            Stukadoors<br />
                            Team<br />
                            De Kempen
                          </h1>
                          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                            <button
                              onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              <Calculator className="w-5 h-5" />
                              <span>Prijs berekenen</span>
                            </button>
                            <button
                              onClick={() => setChatOpen(true)}
                              className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-7 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              <MessageSquare className="w-5 h-5" />
                              <span>Vraag advies</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

             {/* Who We Are Intro & Pricing Calculator (hidden in bento since they are integrated into bento cards) */}
            {!layoutStyle.startsWith("bento") && (
              <>
                {/* Who We Are Intro (3 ZZP'ers) */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
                    <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-dark-900">
                      Drie ervaren ZZP'ers, één aanspreekpunt
                    </h2>
                    <p className="text-brand-dark-800">
                      Wij zijn Jeroen, Bram en Kay. Drie zelfstandige ondernemers die de handen in elkaar hebben geslagen. Voor u betekent dit: de flexibiliteit en betrokkenheid van een lokale ZZP'er, met de slagkracht van een groter team!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TEAM_MEMBERS.map((member, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-brand-beige-200 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
                        <div>
                          {/* Avatar placeholder / placeholder-initials */}
                          <div className="h-24 w-24 rounded-full mx-auto bg-brand-beige-100 border-2 border-brand-clay-500 flex items-center justify-center text-brand-clay-600 font-display font-bold text-2xl mb-4 overflow-hidden relative">
                            <span className="relative z-10">{member.name[0]}</span>
                            <div className="absolute inset-0 bg-brand-clay-500/10 group-hover:scale-110 transition-transform"></div>
                          </div>

                          <h3 className="font-display font-bold text-xl text-brand-dark-900 text-center">{member.name}</h3>
                          <p className="text-xs text-brand-clay-600 font-semibold text-center mb-2">{member.role}</p>
                          <p className="text-xs text-center text-brand-dark-800 bg-brand-beige-50 px-2 py-1 rounded-full mb-4 inline-block mx-auto w-full max-w-[200px] border border-brand-beige-200">
                            ⭐ {member.specialty}
                          </p>
                          
                          <p className="text-sm text-brand-dark-800 leading-relaxed text-center mb-6 italic">
                            "{member.bio}"
                          </p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-brand-beige-100">
                          <div className="flex justify-between items-center text-xs text-brand-dark-800 font-medium">
                            <span>Ervaring</span>
                            <span className="text-brand-clay-600 font-semibold">{member.experience}</span>
                          </div>
                          <div className="space-y-1.5">
                            {member.skills.slice(0, 2).map((skill, sIdx) => (
                              <div key={sIdx}>
                                <div className="flex justify-between text-[11px] text-brand-dark-800">
                                  <span>{skill.name}</span>
                                  <span>{skill.percentage}%</span>
                                </div>
                                <div className="h-1.5 bg-brand-beige-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-brand-clay-500 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 bg-brand-beige-100 rounded-2xl p-6 border border-brand-beige-300 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h4 className="font-display font-semibold text-lg text-brand-dark-900">Wilt u direct kennismaken of advies ter plaatse?</h4>
                      <p className="text-sm text-brand-dark-800">Jeroen, Bram of Kay komt graag even langs om uw wanden op te meten en advies te geven.</p>
                    </div>
                    <button
                      id="btn-schedule-visit"
                      onClick={() => { setActiveTab("contact"); window.scrollTo({top:0, behavior:'smooth'}); }}
                      className="bg-brand-clay-600 hover:bg-brand-clay-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Maak afspraak ter plaatse</span>
                    </button>
                  </div>
                </section>

                {/* Quick Pricing Calculator Preview */}
                <section className="py-20 bg-brand-beige-100/50 border-t border-b border-brand-beige-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-1.5 bg-white border border-brand-beige-300 text-brand-clay-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                          <Calculator className="w-3.5 h-3.5 text-brand-clay-500" />
                          <span>Eerlijkheid & Transparantie</span>
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-dark-900">
                          Altijd een eerlijke prijsindicatie vooraf
                        </h2>
                        <p className="text-brand-dark-800">
                          Geen verrassingen achteraf. Gebruik onze handige online calculator om binnen één minuut een betrouwbare indicatie te berekenen voor uw specifieke stucproject in de Kempen.
                        </p>
                        
                        <ul className="space-y-3">
                          {[
                            "Prijs per m² inclusief materiaal and gips",
                            "Direct duidelijkheid over droogtijden",
                            "Mogelijkheid om direct uw gewenste startweek op te geven",
                            "Altijd inclusief vakkundige voorbereiding en afplakken"
                          ].map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-sm text-brand-dark-800">
                              <CheckCircle className="w-5 h-5 text-brand-clay-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          id="home-preview-calc-btn"
                          onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0, behavior:'smooth'}); }}
                          className="bg-brand-clay-500 hover:bg-brand-clay-600 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
                        >
                          <span>Naar de Offerte Calculator</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Visual Plaster Application */}
                      <div className="bg-white rounded-2xl p-6 shadow-xl border border-brand-beige-200 space-y-6">
                        <h3 className="font-display font-bold text-xl text-brand-dark-900 border-b border-brand-beige-100 pb-3">Richtprijzen Stucwerk Kempen</h3>
                        
                        <div className="space-y-4">
                          {SERVICES.slice(0, 4).map((service, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-brand-beige-50 rounded-xl hover:bg-brand-beige-100 transition-colors">
                              <div>
                                <span className="font-display font-semibold text-brand-dark-900 block text-sm">{service.title}</span>
                                <span className="text-xs text-brand-clay-600">Richtprijs per m²</span>
                              </div>
                              <div className="text-right">
                                <span className="font-display font-bold text-base text-brand-dark-900">€{service.minPrice} - €{service.maxPrice}</span>
                                <span className="text-[10px] text-brand-dark-800 block">excl. btw</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-brand-beige-100/70 rounded-xl p-3 text-xs text-brand-clay-700 flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>Let op: De uiteindelijke prijs hangt af van de staat van de muren en de dikte van de aan te brengen laag. Onze ZZP'ers komen graag gratis bij u in de Kempen kijken om een definitieve prijs te geven.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* AI Assistant Banner */}
            <section className="py-16 bg-gradient-to-br from-brand-clay-500 to-brand-clay-700 text-white relative overflow-hidden">
              <BrandImage
                src={IMAGES.betonlook}
                alt=""
                zoom={false}
                overlay={false}
                className="absolute inset-0 opacity-25"
                objectPosition="center"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-clay-600/95 via-brand-clay-600/90 to-brand-clay-800/95" aria-hidden="true" />
              <div className="absolute inset-0 bg-plaster-texture opacity-10" aria-hidden="true" />
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
                <div className="h-14 w-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto text-brand-beige-50 shadow-inner">
                  <Sparkles className="w-8 h-8 text-brand-beige-100" />
                </div>
                <h2 className="font-display font-bold text-3xl sm:text-4xl">Hebt u een vraag over stucwerk?</h2>
                <p className="text-brand-beige-100 text-base sm:text-lg max-w-2xl mx-auto">
                  Onze slimme AI-assistent <strong>StucAdviseur</strong> is getraind met de gezamenlijke kennis van Jeroen, Bram en Kay. Vraag hem alles over droogtijden, geschikte afwerkingen voor badkamers of nieuwbouw!
                </p>

                {/* Predefined Questions */}
                <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto pt-2">
                  {[
                    "Hoe lang moet stucwerk drogen?",
                    "Kan betonlook in de douche?",
                    "Wat is beter: glad pleisterwerk of schuurwerk?",
                    "Stucen jullie ook buitengevels?"
                  ].map((q, idx) => (
                    <button
                      id={`preset-question-${idx}`}
                      key={idx}
                      onClick={() => askStucAdviseur(q)}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs px-3.5 py-2 rounded-full transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    id="btn-home-chat-trigger"
                    onClick={() => setChatOpen(true)}
                    className="bg-white text-brand-clay-700 hover:bg-brand-beige-50 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
                  >
                    Start chat met AI StucAdviseur
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: ONZE DIENSTEN */}
        {activeTab === "services" && (
          <div id="section-services" className="animate-fadeIn">
            <div className="relative overflow-hidden bg-brand-dark-950 text-white">
              <BrandImage
                src={IMAGES.hero}
                alt=""
                overlay={false}
                zoom={false}
                className="absolute inset-0 opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-950/95 via-brand-dark-900/85 to-brand-dark-800/70" />
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center space-y-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay-400 block">Wat we doen</span>
                <h1 className="font-display font-bold text-3xl sm:text-5xl tracking-tight">Professionele wand- en plafondafwerking</h1>
                <p className="text-brand-beige-200 text-base max-w-2xl mx-auto">
                  Strak, modern, ambachtelijk of luxe waterdicht — voor elke klus de juiste specialist uit de Kempen.
                </p>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SERVICES.map((service, idx) => (
                <div key={idx} className="card-soft overflow-hidden flex flex-col justify-between transition-all group">
                  <div>
                    <BrandImage
                      src={service.image}
                      alt={service.title}
                      badge={`€${service.minPrice}–€${service.maxPrice} / m²`}
                      className="h-60 md:h-64"
                      objectPosition={service.id === "schuurwerk" ? "top center" : service.id === "betonlook" ? "center" : "center"}
                      loading={idx < 2 ? "eager" : "lazy"}
                    />

                    <div className="p-6 space-y-4">
                      <h3 className="font-display font-bold text-xl text-brand-dark-900">{service.title}</h3>
                      <p className="text-sm text-brand-dark-800 leading-relaxed">
                        {service.shortDesc}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-1.5 pt-2">
                        {service.pros.slice(0, 2).map((pro, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-brand-dark-800">
                            <CheckCircle className="w-3.5 h-3.5 text-brand-clay-600 mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-brand-beige-100 flex gap-2">
                    <button
                      id={`btn-service-detail-${service.id}`}
                      onClick={() => setSelectedService(service)}
                      className="flex-1 bg-brand-beige-100 hover:bg-brand-beige-200 text-brand-clay-700 font-semibold text-xs py-3 rounded-lg text-center transition-colors"
                    >
                      Lees meer & droogtijd
                    </button>
                    <button
                      id={`btn-service-calc-${service.id}`}
                      onClick={() => {
                        setCalcService(service.id);
                        setActiveTab("calculator");
                        window.scrollTo({top:0, behavior:'smooth'});
                      }}
                      className="bg-brand-clay-500 hover:bg-brand-clay-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
                      title="Bereken prijs"
                    >
                      <Calculator className="w-4 h-4" />
                    </button>
                  </div>
                  {SERVICE_PAGE_SLUGS[service.id] && (
                    <div className="px-6 pb-6 -mt-3">
                      <a
                        href={`/${SERVICE_PAGE_SLUGS[service.id]}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-clay-600 hover:text-brand-clay-700"
                      >
                        Meer over {service.title}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quality badge banner */}
            <div className="mt-16 bg-white rounded-2xl p-8 border border-brand-beige-200 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div className="space-y-2">
                  <div className="h-10 w-10 bg-brand-clay-100 text-brand-clay-700 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-semibold text-brand-dark-900">5 Jaar NOA Garantie</h4>
                  <p className="text-xs text-brand-dark-800">Als erkend afbouwbedrijf bieden we volledige garantie op de hechting en kwaliteit van ons gipswerk.</p>
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-10 bg-brand-clay-100 text-brand-clay-700 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-semibold text-brand-dark-900">Stofvrij Opschuren</h4>
                  <p className="text-xs text-brand-dark-800">Wij beschikken over professionele Festool schuurmachines met klasse M stofafzuiging. Minimale overlast in uw woning!</p>
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-10 bg-brand-clay-100 text-brand-clay-700 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-semibold text-brand-dark-900">Klantgerichte Service</h4>
                  <p className="text-xs text-brand-dark-800">We communiceren helder via WhatsApp of bellen u direct op om afspraken te bevestigen. Geen administratieve rompslomp.</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* TAB 3: ONS TEAM */}
        {activeTab === "team" && (
          <div id="section-team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay-600 block">De stukadoors</span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-brand-dark-900">Drie Toegewijde Vakmensen</h1>
              <p className="text-brand-dark-800 text-base">
                Zonder tussenpersonen of dure kantoormedewerkers. Wij staan zelf op de steiger en garanderen dat het stucwerk in uw woning met uiterste precisie wordt aangebracht.
              </p>
            </div>

            {/* Team Layout */}
            <div className="space-y-16">
              {TEAM_MEMBERS.map((member, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white rounded-3xl p-8 shadow-md border border-brand-beige-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                    idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Photo Left/Right */}
                  <div className={`lg:col-span-4 ${idx % 2 === 1 ? "lg:order-last" : ""}`}>
                    <div className="aspect-square rounded-2xl overflow-hidden relative group ring-4 ring-brand-beige-100 shadow-lg">
                      <BrandImage
                        src={member.avatar}
                        alt={`${member.name} - stukadoor bij Stukadoorsteam De Kempen`}
                        zoom={true}
                        className="h-full"
                        objectPosition="center top"
                      />
                      <div className="absolute bottom-4 left-4 z-10 bg-brand-dark-900/90 backdrop-blur-sm text-brand-beige-100 px-3 py-1.5 rounded-lg text-xs font-semibold">
                        {member.experience}
                      </div>
                    </div>
                  </div>

                  {/* Bio Content */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <span className="text-brand-clay-600 text-xs font-bold uppercase tracking-wide block mb-1">{member.role}</span>
                      <h3 className="font-display font-bold text-2xl text-brand-dark-900">Ontmoet {member.name}</h3>
                    </div>

                    <p className="text-brand-dark-800 text-base leading-relaxed">
                      {member.bio}
                    </p>

                    <div className="bg-brand-beige-50 rounded-xl p-4 border border-brand-beige-200">
                      <h4 className="font-display font-semibold text-sm text-brand-dark-900 mb-3 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-brand-clay-500" />
                        <span>Core specialiteiten en vaardigheden:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {member.skills.map((skill, sIdx) => (
                          <div key={sIdx} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-brand-dark-800">
                              <span>{skill.name}</span>
                              <span className="text-brand-clay-600">{skill.percentage}%</span>
                            </div>
                            <div className="h-2 bg-brand-beige-100 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-clay-500 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        id={`btn-team-ask-${member.name}`}
                        onClick={() => askStucAdviseur(`Kan ${member.name} mij adviseren over ${member.specialty.split('&')[0].trim()}?`)}
                        className="bg-brand-beige-100 hover:bg-brand-beige-200 text-brand-clay-700 font-semibold text-xs px-5 py-3 rounded-xl transition-all inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4 text-brand-clay-500" />
                        <span>Vraag advies aan {member.name} (via AI)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CALCULATOR */}
        {activeTab === "calculator" && (
          <div className="bg-gradient-to-b from-brand-beige-100/40 to-brand-beige-50 animate-fadeIn">
            <AdvancedQuoteCalculator />
          </div>
        )}

        {/* Oude eenvoudige calculator - bewaard maar niet meer weergegeven */}
        {false && activeTab === "calculator" && (
          <div id="section-calculator" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay-600 block">Eenvoudig online berekenen</span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-brand-dark-900">Prijs Calculator & Offerte-Aanvraag</h1>
              <p className="text-brand-dark-800 text-base max-w-2xl mx-auto">
                Selecteer uw type stucwerk, voer de geschatte oppervlakte in en bereken direct uw richtprijs. Tevreden met de prijs? Verstuur uw aanvraag en we nemen binnen 24 uur contact op!
              </p>
            </div>

            {calcSuccess ? (
              <div id="calculator-success-message" className="bg-white rounded-3xl p-8 text-center shadow-xl border border-brand-beige-200 space-y-6 animate-fadeIn">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="font-display font-bold text-2xl text-brand-dark-900">Bedankt voor uw aanvraag!</h2>
                <p className="text-brand-dark-800 max-w-md mx-auto">
                  We hebben uw gegevens goed ontvangen. Jeroen, Bram of Kay zal uw aanvraag bekijken en binnen 24 uur telefonisch of via e-mail contact met u opnemen om uw wensen door te nemen of een afspraak te plannen.
                </p>
                <div className="pt-4">
                  <button
                    id="btn-calc-reset"
                    onClick={() => setCalcSuccess(false)}
                    className="bg-brand-clay-500 hover:bg-brand-clay-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                  >
                    Nieuwe berekening maken
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl border border-brand-beige-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
                
                {/* Form controls (7 columns) */}
                <form onSubmit={handleQuoteSubmit} className="md:col-span-7 p-6 sm:p-8 space-y-6">
                  <h3 className="font-display font-semibold text-lg text-brand-dark-900 border-b border-brand-beige-100 pb-3">1. Voer uw projectgegevens in</h3>
                  
                  {calcError && (
                    <div id="calculator-error-box" className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-xs text-red-700 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{calcError}</span>
                    </div>
                  )}

                  {/* Plaster Type Select */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-brand-dark-900 uppercase tracking-wider">Type Stucwerk</label>
                    <select
                      id="calc-select-service"
                      value={calcService}
                      onChange={(e) => setCalcService(e.target.value)}
                      className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm text-brand-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-clay-500"
                    >
                      {SERVICES.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.title} (ca. €{service.minPrice} - €{service.maxPrice}/m²)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Surface area input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-semibold text-brand-dark-900 uppercase tracking-wider">Aantal vierkante meters (m²)</label>
                      <span className="text-xs font-bold text-brand-clay-600 bg-brand-clay-100 px-2 py-0.5 rounded-full">{calcArea} m²</span>
                    </div>
                    <input
                      id="calc-input-area-range"
                      type="range"
                      min="10"
                      max="300"
                      step="5"
                      value={calcArea}
                      onChange={(e) => setCalcArea(Number(e.target.value))}
                      className="w-full h-2 bg-brand-beige-200 rounded-lg appearance-none cursor-pointer accent-brand-clay-500"
                    />
                    <div className="flex justify-between text-[10px] text-brand-dark-800 font-medium">
                      <span>10 m²</span>
                      <span>100 m²</span>
                      <span>200 m²</span>
                      <span>300 m² +</span>
                    </div>
                    <div className="pt-2">
                      <input
                        id="calc-input-area-num"
                        type="number"
                        min="5"
                        max="1000"
                        value={calcArea}
                        onChange={(e) => setCalcArea(Number(e.target.value))}
                        className="w-32 bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-3 py-2 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                        placeholder="Voer getal in"
                      />
                      <span className="text-xs text-brand-dark-800 ml-2 font-medium">m² handmatig invoeren</span>
                    </div>
                  </div>

                  <h3 className="font-display font-semibold text-lg text-brand-dark-900 border-b border-brand-beige-100 pb-3 pt-4">2. Uw contactgegevens</h3>

                  {/* Personal info fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-brand-dark-900 uppercase tracking-wider">Uw Naam *</label>
                      <input
                        id="calc-input-name"
                        type="text"
                        required
                        value={calcName}
                        onChange={(e) => setCalcName(e.target.value)}
                        placeholder="Bijv. Peter van de Ven"
                        className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-brand-dark-900 uppercase tracking-wider">Telefoonnummer *</label>
                      <input
                        id="calc-input-phone"
                        type="tel"
                        required
                        value={calcPhone}
                        onChange={(e) => setCalcPhone(e.target.value)}
                        placeholder="Bijv. 0612345678"
                        className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-brand-dark-900 uppercase tracking-wider">E-mailadres *</label>
                      <input
                        id="calc-input-email"
                        type="email"
                        required
                        value={calcEmail}
                        onChange={(e) => setCalcEmail(e.target.value)}
                        placeholder="Bijv. peter@voorbeeld.nl"
                        className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-brand-dark-900 uppercase tracking-wider">Woonplaats in de Kempen</label>
                      <select
                        id="calc-select-city"
                        value={calcCity}
                        onChange={(e) => setCalcCity(e.target.value)}
                        className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                      >
                        {KEMPEN_CITIES.map((c, i) => (
                          <option key={i} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-brand-dark-900 uppercase tracking-wider">Korte toelichting (Optioneel)</label>
                    <textarea
                      id="calc-input-desc"
                      rows={3}
                      value={calcDesc}
                      onChange={(e) => setCalcDesc(e.target.value)}
                      placeholder="Bijv: nieuwbouwwoning, muren sausklaar maken, gewenste start in oktober."
                      className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                    />
                  </div>

                  <button
                    id="calc-submit-btn"
                    type="submit"
                    disabled={calcLoading}
                    className="w-full bg-brand-clay-500 hover:bg-brand-clay-600 disabled:bg-brand-clay-300 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {calcLoading ? (
                      <span>Versturen...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Vrijblijvende Offerte Aanvragen</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Estimate Result Panel (5 columns) */}
                <div className="md:col-span-5 bg-brand-dark-900 text-white p-6 sm:p-8 flex flex-col justify-between space-y-8">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-1.5 bg-brand-dark-800 text-brand-clay-300 border border-brand-dark-950 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      <Euro className="w-3.5 h-3.5" />
                      <span>Directe Berekening</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs text-brand-clay-300 uppercase tracking-wide block">Gekozen stucwerk</span>
                      <span className="font-display font-bold text-xl text-white block">
                        {SERVICES.find(s => s.id === calcService)?.title}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-brand-clay-300 uppercase tracking-wide block">Geschatte Oppervlakte</span>
                      <span className="font-display font-semibold text-lg text-white block">{calcArea} m²</span>
                    </div>

                    {/* BIG ESTIMATED PRICE DISPLAY */}
                    <div className="border-t border-brand-dark-800 pt-6 space-y-2">
                      <span className="text-xs text-brand-clay-300 uppercase tracking-wide block">Richtprijs indicatie:</span>
                      <div className="font-display font-bold text-3xl sm:text-4xl text-brand-clay-500">
                        €{currentCalcEstimate.min.toLocaleString()} - €{currentCalcEstimate.max.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-brand-clay-300 block italic">excl. btw &amp; eventuele voorbehandeling</span>
                    </div>
                  </div>

                  {/* Informational items */}
                  <div className="bg-brand-dark-800 rounded-2xl p-4 border border-brand-dark-950 space-y-3 mt-4 text-xs text-brand-beige-100">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-brand-clay-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block text-white">Droogtijd richtlijn:</strong>
                        <span>{SERVICES.find(s => s.id === calcService)?.dryingTime}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <ThumbsUp className="w-4 h-4 text-brand-clay-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block text-white">Altijd inclusief:</strong>
                        <span>Professionele gipsmortel, afplakken en schoonmaken.</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === "reviews" && (
          <div id="section-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay-600 block">Klanttevredenheid</span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-brand-dark-900">Wat onze klanten in de Kempen zeggen</h1>
              <p className="text-brand-dark-800 text-base">
                Wij streven altijd naar 100% tevredenheid. Dankzij onze nauwe samenwerking als 3 ZZP'ers kunnen we flexibel plannen en topkwaliteit leveren waar we trots op zijn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {REVIEWS.map((review, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 shadow-md border border-brand-beige-200 flex flex-col justify-between hover:shadow-lg hover:border-brand-clay-300/50 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-brand-clay-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-brand-clay-500 text-brand-clay-500" />
                      ))}
                    </div>
                    <p className="text-sm text-brand-dark-800 leading-relaxed italic">
                      "{review.text}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-6 mt-6 border-t border-brand-beige-100 text-xs">
                    <div>
                      <span className="font-display font-semibold text-brand-dark-900 block">{review.name}</span>
                      <span className="text-brand-clay-600">stucwerk in {review.city}</span>
                    </div>
                    <div className="text-right text-brand-dark-800">
                      <span className="block font-medium">{review.service}</span>
                      <span className="text-[10px] text-brand-clay-700/80">{review.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google review push card */}
            <div className="mt-12 bg-brand-beige-100 rounded-3xl p-8 border border-brand-beige-300 text-center max-w-2xl mx-auto space-y-4">
              <h3 className="font-display font-bold text-xl text-brand-dark-900">Bent u een bestaande klant?</h3>
              <p className="text-sm text-brand-dark-800">
                Laat een review achter op Google of deel uw ervaring met vrienden en familie in de Kempen. Mond-tot-mondreclame is voor ons als lokale ZZP'ers goud waard!
              </p>
              <div className="pt-2">
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-brand-beige-50 text-brand-clay-700 font-bold px-6 py-3 rounded-xl border border-brand-beige-300 shadow-sm inline-flex items-center gap-2 text-sm"
                >
                  <span>Schrijf een Google Review</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT */}
        {activeTab === "contact" && (
          <div id="section-contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay-600 block">Neem contact op</span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-brand-dark-900">Vrijblijvend advies of afspraak plannen</h1>
              <p className="text-brand-dark-800 text-base">
                Hebt u vragen of wilt u dat we langskomen in Bladel, Eersel, Bergeijk of Reusel om uw muren te inspecteren? Vul het formulier in of bel ons direct!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Contact info cards */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-white rounded-2xl p-6 shadow-md border border-brand-beige-200 space-y-4">
                  <h3 className="font-display font-semibold text-lg text-brand-dark-900 border-b border-brand-beige-100 pb-3">Contactgegevens</h3>
                  
                  <div className="space-y-4">
                    <a href="tel:+31497123456" className="flex items-start gap-3 text-brand-dark-800 hover:text-brand-clay-700 transition-colors">
                      <div className="h-9 w-9 bg-brand-beige-100 rounded-lg flex items-center justify-center text-brand-clay-600 flex-shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-brand-clay-600 block uppercase font-bold">Telefoon (Direct)</span>
                        <span className="text-sm font-semibold">0497 - 123 456</span>
                        <span className="text-[10px] text-brand-dark-800 block">Jeroen, Bram of Kay neemt op</span>
                      </div>
                    </a>

                    <a href="mailto:info@stukadoorsteamdekempen.nl" className="flex items-start gap-3 text-brand-dark-800 hover:text-brand-clay-700 transition-colors">
                      <div className="h-9 w-9 bg-brand-beige-100 rounded-lg flex items-center justify-center text-brand-clay-600 flex-shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-brand-clay-600 block uppercase font-bold">E-mailadres</span>
                        <span className="text-sm font-semibold">info@stukadoorsteamdekempen.nl</span>
                      </div>
                    </a>

                    <div className="flex items-start gap-3 text-brand-dark-800">
                      <div className="h-9 w-9 bg-brand-beige-100 rounded-lg flex items-center justify-center text-brand-clay-600 flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-brand-clay-600 block uppercase font-bold">Werkgebied</span>
                        <span className="text-sm font-semibold">Hele Kempen, Noord-Brabant</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-dark-900 text-white rounded-2xl p-6 shadow-md space-y-4">
                  <h3 className="font-display font-semibold text-lg text-brand-clay-300 border-b border-brand-dark-800 pb-3">Werkwijze van het team</h3>
                  <ul className="space-y-3 text-xs text-brand-beige-100">
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-clay-500 flex-shrink-0" />
                      <span>Gratis inmeten en advies op locatie</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-clay-500 flex-shrink-0" />
                      <span>Duidelijke, schriftelijke offerte via mail</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-clay-500 flex-shrink-0" />
                      <span>Gegarandeerde startweek, snelle communicatie</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-clay-500 flex-shrink-0" />
                      <span>Bezemschoon opleveren na de werkzaamheden</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Contact Form */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-brand-beige-200">
                {contactSuccess ? (
                  <div id="contact-success-box" className="text-center py-8 space-y-4">
                    <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-brand-dark-900">Uw bericht is verzonden!</h3>
                    <p className="text-sm text-brand-dark-800 max-w-sm mx-auto">
                      We hebben uw aanvraag goed ontvangen en nemen binnen 24 uur contact met u op om uw wensen of afspraak door te spreken.
                    </p>
                    <button
                      id="btn-contact-reset"
                      onClick={() => setContactSuccess(false)}
                      className="bg-brand-clay-500 text-white px-5 py-2 rounded-xl text-sm font-semibold"
                    >
                      Nieuw bericht sturen
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="font-display font-semibold text-lg text-brand-dark-900 border-b border-brand-beige-100 pb-2">Stuur ons een bericht</h3>
                    
                    {contactError && (
                      <div className="p-3 bg-red-50 text-xs text-red-600 rounded-lg">{contactError}</div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-brand-dark-900 uppercase">Uw Naam *</label>
                        <input
                          id="contact-input-name"
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Bijv. Jeroen van Gerwen"
                          className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-3 py-2 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-brand-dark-900 uppercase">Telefoonnummer *</label>
                        <input
                          id="contact-input-phone"
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="Bijv. 0612345678"
                          className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-3 py-2 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-brand-dark-900 uppercase">E-mailadres *</label>
                        <input
                          id="contact-input-email"
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Bijv. jeroen@voorbeeld.nl"
                          className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-3 py-2 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-brand-dark-900 uppercase">Woonplaats</label>
                        <select
                          id="contact-select-city"
                          value={contactCity}
                          onChange={(e) => setContactCity(e.target.value)}
                          className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-3 py-2 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                        >
                          {KEMPEN_CITIES.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-brand-dark-900 uppercase">Type Werkzaamheid</label>
                        <select
                          id="contact-select-type"
                          value={contactType}
                          onChange={(e) => setContactType(e.target.value)}
                          className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-3 py-2 text-sm text-brand-dark-900 focus:outline-none"
                        >
                          {SERVICES.map((s) => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                          ))}
                          <option value="overig">Overig stucwerk / Gevelstuc</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-brand-dark-900 uppercase">Geschatte m² (Optioneel)</label>
                        <input
                          id="contact-input-area"
                          type="number"
                          value={contactArea}
                          onChange={(e) => setContactArea(e.target.value)}
                          placeholder="Bijv. 75"
                          className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-3 py-2 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-brand-dark-900 uppercase">Uw Bericht of Vraag *</label>
                      <textarea
                        id="contact-input-msg"
                        required
                        rows={4}
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        placeholder="Vertel ons meer over uw project (bijv: gewenste startperiode, staat van de muren, etc.)"
                        className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-3 py-2 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
                      />
                    </div>

                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={contactLoading}
                      className="w-full bg-brand-clay-500 hover:bg-brand-clay-600 disabled:bg-brand-clay-300 text-white font-bold py-3.5 rounded-xl transition-colors"
                    >
                      {contactLoading ? "Versturen..." : "Verstuur Aanvraag"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ADMIN PANEL (Leadbeheer) */}
        {activeTab === "admin" && (
          <div id="section-admin" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
            
            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl border border-brand-beige-200 text-center space-y-6">
                <div className="h-12 w-12 bg-brand-beige-100 text-brand-clay-700 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-brand-dark-900">Beheerderspaneel Leads</h2>
                  <p className="text-xs text-brand-dark-800 mt-1">Voer het wachtwoord in om de binnengekomen offerte-aanvragen te beheren.</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  {adminError && (
                    <div className="p-3 bg-red-50 text-xs text-red-600 rounded-lg">{adminError}</div>
                  )}
                  <input
                    id="admin-pwd-input"
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Wachtwoord (gebruik 'kempenstuc')"
                    className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500 text-center"
                  />
                  <button
                    id="admin-login-btn"
                    type="submit"
                    className="w-full bg-brand-clay-500 hover:bg-brand-clay-600 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Inloggen
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-beige-200 pb-6">
                  <div>
                    <span className="text-xs font-semibold text-brand-clay-600 uppercase tracking-wider">Stukadoorsteam De Kempen</span>
                    <h1 className="font-display font-bold text-3xl text-brand-dark-900">Binnengekomen Leads &amp; Offertes</h1>
                    <p className="text-xs text-brand-dark-800">Hieronder staan de aanvragen die via de website en de calculator zijn verstuurd.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      id="admin-refresh-btn"
                      onClick={fetchAdminQuotes}
                      className="bg-brand-beige-100 hover:bg-brand-beige-200 text-brand-dark-900 px-4 py-2 rounded-lg text-xs font-semibold transition-colors border border-brand-beige-300"
                    >
                      Lijst Vernieuwen
                    </button>
                    <button
                      id="admin-logout-btn"
                      onClick={() => { setIsAdminAuthenticated(false); setAdminPassword(""); }}
                      className="bg-brand-dark-900 hover:bg-brand-dark-950 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Uitloggen
                    </button>
                  </div>
                </div>

                {adminError && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{adminError}</div>
                )}

                {adminLoading ? (
                  <div className="text-center py-12">
                    <span className="text-brand-dark-800 text-sm">Leads laden uit database...</span>
                  </div>
                ) : adminQuotes.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-brand-beige-200 shadow-sm space-y-4">
                    <FileText className="w-12 h-12 text-brand-beige-300 mx-auto" />
                    <h3 className="font-display font-semibold text-lg text-brand-dark-900">Nog geen binnengekomen leads</h3>
                    <p className="text-xs text-brand-dark-800 max-w-sm mx-auto">
                      Zodra een bezoeker de online calculator invult of het contactformulier verzendt, verschijnt de aanvraag direct in deze lijst.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {adminQuotes.map((quote) => (
                      <div key={quote.id} className="bg-white rounded-2xl p-6 border border-brand-beige-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        
                        {/* Status badge */}
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {quote.status}
                          </span>
                          <button
                            id={`admin-delete-lead-${quote.id}`}
                            onClick={() => handleDeleteQuote(quote.id)}
                            className="p-1.5 text-brand-dark-800 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Verwijder / Archiveer lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Client Info */}
                          <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-clay-600 block">Klantgegevens</span>
                            <div className="space-y-1 text-sm text-brand-dark-900">
                              <p className="font-semibold">{quote.name}</p>
                              <p className="flex items-center gap-1.5 text-xs text-brand-dark-800">
                                <Phone className="w-3.5 h-3.5 text-brand-clay-500" />
                                <a href={`tel:${quote.phone}`} className="hover:underline">{quote.phone}</a>
                              </p>
                              <p className="flex items-center gap-1.5 text-xs text-brand-dark-800">
                                <Mail className="w-3.5 h-3.5 text-brand-clay-500" />
                                <a href={`mailto:${quote.email}`} className="hover:underline">{quote.email}</a>
                              </p>
                              <p className="flex items-center gap-1.5 text-xs text-brand-dark-800">
                                <MapPin className="w-3.5 h-3.5 text-brand-clay-500" />
                                <span>stucen in {quote.city}</span>
                              </p>
                            </div>
                          </div>

                          {/* Project Info */}
                          <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-clay-600 block">Project Details</span>
                            <div className="space-y-1 text-sm text-brand-dark-900">
                              <p className="font-semibold">{quote.plasterType}</p>
                              <p className="text-xs text-brand-dark-800">Oppervlakte: <strong className="text-brand-dark-950 font-semibold">{quote.area} m²</strong></p>
                              <p className="text-xs text-brand-dark-800">Richtprijs: <strong className="text-brand-clay-600 font-bold">€{quote.estimatedPrice}</strong></p>
                              <p className="text-[10px] text-brand-clay-700/80">Datum: {new Date(quote.date).toLocaleString("nl-NL")}</p>
                            </div>
                          </div>

                          {/* Client message / notes */}
                          <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-clay-600 block">Toelichting / Opmerkingen</span>
                            <p className="text-xs text-brand-dark-800 bg-brand-beige-50 p-3 rounded-lg border border-brand-beige-200 italic">
                              {quote.description || "Geen toelichting opgegeven."}
                            </p>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-brand-dark-950 text-brand-beige-100 pt-16 pb-8 border-t-4 border-brand-clay-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-brand-dark-800">
            
            {/* Logo/Desc Column */}
            <div className="space-y-4 md:col-span-1">
              <img
                src="/logo-stukadoorsteam-de-kempen.png"
                alt="Stukadoorsteam De Kempen"
                className="h-16 w-auto max-w-[220px] rounded-lg bg-white object-contain p-2"
              />
              <p className="text-xs text-brand-clay-300 leading-relaxed">
                Drie ervaren zelfstandige stukadoors (ZZP'ers) met één helder doel: het mooiste en meest strakke stucwerk leveren in de Brabantse Kempen.
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider">Snel Navigeren</h4>
              <ul className="space-y-2 text-xs text-brand-clay-300">
                <li><a href="/werkgebied" className="hover:text-white transition-colors">Werkgebied</a></li>
                <li><a href="/diensten" className="hover:text-white transition-colors">Diensten</a></li>
                <li><a href="/stukadoor-prijzen" className="hover:text-white transition-colors">Prijzen</a></li>
                <li><a href="/contact-stukadoor" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/over-ons" className="hover:text-white transition-colors">Over ons</a></li>
                <li><a href="/stukadoor-kempen" className="hover:text-white transition-colors">Stukadoor Kempen</a></li>
                <li><a href="/stucwerk-kempen" className="hover:text-white transition-colors">Stucwerk Kempen</a></li>
                <li><a href="/site-overzicht" className="hover:text-white transition-colors">Site-overzicht</a></li>
                <li><a href="/stucwerk-droogtijd" className="hover:text-white transition-colors">Stucwerk droogtijd</a></li>
                <li><button onClick={() => { setActiveTab("calculator"); window.scrollTo({top:0}); }} className="hover:text-white transition-colors">Offertecalculator</button></li>
              </ul>
            </div>

            {/* Services List Column */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider">Onze Diensten</h4>
              <ul className="space-y-2 text-xs text-brand-clay-300">
                {SERVICES.map((s) => (
                  <li key={s.id}>
                    <a
                      href={SERVICE_SEO_SLUGS[s.id] ?? "/diensten"}
                      className="hover:text-white transition-colors text-left"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location Targeting Column */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider">Werkgebied Kempen</h4>
              <p className="text-xs text-brand-clay-300 leading-relaxed">
                Wij zijn actief in: Bergeijk, Westerhoven, Luyksgestel, Eersel, Valkenswaard, Duizel, Hapert, Steensel, Lommel, Pelt, Bladel en Reusel.
              </p>
              <div className="bg-brand-dark-900 p-3 rounded-lg border border-brand-dark-800 text-center">
                <span className="text-[10px] text-brand-clay-300 block">📞 Bellen of WhatsAppen:</span>
                <a href="tel:+31497123456" className="text-sm font-bold text-white hover:text-brand-clay-500 block mt-1">0497 - 123 456</a>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-clay-300 gap-4">
            <p>© 2026 Stukadoorsteam De Kempen. Alle rechten voorbehouden.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer">Algemene Voorwaarden</span>
              <span className="hover:text-white cursor-pointer">Privacybeleid</span>
              <span className="hover:text-white cursor-pointer" onClick={() => { setActiveTab("admin"); window.scrollTo({top:0, behavior:'smooth'}); }}>Leadbeheer Login</span>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING AI CHAT WIDGET ("StucAdviseur") */}
      <div id="ai-chat-widget" className="fixed bottom-6 right-6 z-50">
        
        {chatOpen ? (
          <div className="w-[360px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-brand-beige-200 flex flex-col justify-between overflow-hidden animate-slideUp">
            
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-brand-clay-600 to-brand-clay-700 text-white p-4 flex items-center justify-between shadow">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-white/10 rounded-xl flex items-center justify-center text-white shadow-inner">
                  <Sparkles className="w-5 h-5 text-brand-beige-100" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm leading-none">StucAdviseur AI</h4>
                  <span className="text-[10px] text-brand-beige-100 mt-1 block">Stukadoorsteam De Kempen assistent</span>
                </div>
              </div>
              <button
                id="btn-close-chat"
                onClick={() => setChatOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-brand-beige-50">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-brand-clay-500 text-white rounded-tr-none" 
                        : "bg-white text-brand-dark-900 border border-brand-beige-200 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-[9px] opacity-75 block text-right mt-1.5">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-brand-beige-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                    <span className="text-xs text-brand-dark-800">StucAdviseur denkt na...</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-brand-clay-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-brand-clay-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-brand-clay-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Pre-fill suggestion container */}
            <div className="px-4 py-2 bg-white border-t border-brand-beige-100 overflow-x-auto flex gap-1.5 whitespace-nowrap scrollbar-none">
              <button 
                onClick={() => setChatInput("Wat kost stucen per m²?")}
                className="text-[10px] bg-brand-beige-100 hover:bg-brand-beige-200 text-brand-clay-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
              >
                € Richtprijzen
              </button>
              <button 
                onClick={() => setChatInput("Hoe lang moet stucwerk drogen?")}
                className="text-[10px] bg-brand-beige-100 hover:bg-brand-beige-200 text-brand-clay-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
              >
                ⏱️ Droogtijd
              </button>
              <button 
                onClick={() => setChatInput("Is betonlook geschikt voor de badkamer?")}
                className="text-[10px] bg-brand-beige-100 hover:bg-brand-beige-200 text-brand-clay-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
              >
                🛁 Badkamer stucen
              </button>
            </div>

            {/* Chat Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-brand-beige-200 flex items-center gap-2">
              <input
                id="chat-input-field"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Typ uw vraag hier..."
                className="flex-grow bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-2.5 text-sm text-brand-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-clay-500"
              />
              <button
                id="btn-chat-send"
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="bg-brand-clay-500 hover:bg-brand-clay-600 disabled:bg-brand-beige-300 disabled:text-brand-clay-300 text-white p-2.5 rounded-xl transition-colors shadow"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

          </div>
        ) : (
          <button
            id="btn-open-chat"
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-brand-clay-500 to-brand-clay-700 hover:scale-105 transition-all text-white p-4 rounded-full shadow-2xl flex items-center gap-2 border border-brand-clay-600 group"
          >
            <Sparkles className="w-6 h-6 text-brand-beige-100 group-hover:rotate-12 transition-transform" />
            <span className="font-display font-semibold text-sm pr-1">Vraag StucAdviseur AI</span>
          </button>
        )}

      </div>

      {/* SELECTED SERVICE DETAIL MODAL */}
      {selectedService && (
        <div id="service-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-brand-beige-200 flex flex-col">
            
            {/* Modal Header Image */}
            <div className="h-64 sm:h-72 relative overflow-hidden flex-shrink-0">
              <BrandImage
                src={selectedService.image}
                alt={selectedService.title}
                loading="eager"
                zoom={false}
                overlay={false}
                className="h-full"
                badge={`Vanaf €${selectedService.minPrice} per m²`}
                objectPosition={selectedService.id === "schuurwerk" ? "top center" : "center"}
              />
              <button
                id="btn-close-modal-img"
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-20 h-9 w-9 bg-brand-dark-900/80 hover:bg-brand-dark-900 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-display font-bold text-2xl text-brand-dark-900">{selectedService.title}</h3>
                <span className="text-xs text-brand-clay-600 font-semibold block mt-1">Uitleg, voordelen en droogtijden</span>
              </div>

              <p className="text-sm text-brand-dark-800 leading-relaxed">
                {selectedService.longDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Pros */}
                <div className="space-y-2">
                  <h4 className="font-display font-semibold text-xs text-green-700 uppercase tracking-wider">Voordelen:</h4>
                  <ul className="space-y-1.5 text-xs text-brand-dark-800">
                    {selectedService.pros.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons / Specifics */}
                <div className="space-y-2">
                  <h4 className="font-display font-semibold text-xs text-brand-clay-700 uppercase tracking-wider">Aandachtspunten:</h4>
                  <ul className="space-y-1.5 text-xs text-brand-dark-800">
                    {selectedService.cons.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-brand-clay-500 mt-0.5 flex-shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Informational table details */}
              <div className="bg-brand-beige-50 rounded-2xl p-4 border border-brand-beige-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-semibold block text-brand-dark-900">⏱️ Droogtijd indicatie:</span>
                  <span className="text-brand-clay-700 font-medium">{selectedService.dryingTime}</span>
                </div>
                <div>
                  <span className="font-semibold block text-brand-dark-900">🎯 Het meest geschikt voor:</span>
                  <span className="text-brand-clay-700 font-medium">{selectedService.bestFor}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="modal-cta-calc"
                  onClick={() => {
                    setCalcService(selectedService.id);
                    setSelectedService(null);
                    setActiveTab("calculator");
                    window.scrollTo({top:0, behavior:'smooth'});
                  }}
                  className="flex-grow bg-brand-clay-500 hover:bg-brand-clay-600 text-white font-bold py-3.5 rounded-xl transition-all shadow text-center text-sm"
                >
                  Bereken prijs voor deze dienst
                </button>
                <button
                  id="modal-cta-close"
                  onClick={() => setSelectedService(null)}
                  className="bg-brand-beige-100 hover:bg-brand-beige-200 text-brand-dark-900 font-bold px-6 py-3.5 rounded-xl transition-all text-sm border border-brand-beige-300"
                >
                  Sluiten
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
