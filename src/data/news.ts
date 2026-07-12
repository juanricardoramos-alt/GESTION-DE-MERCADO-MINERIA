import type { NewsArticle } from "@/types";

/**
 * Feed de noticias de ejemplo. Empresas, proyectos y cifras son ficticios;
 * el estilo replica la prensa especializada del sector.
 */
export const NEWS: NewsArticle[] = [
  {
    id: "n01",
    title: {
      es: "Minera Altos del Desierto aprueba ampliación por US$ 2.800 millones en Antofagasta",
      en: "Altos del Desierto Mining approves US$2.8 billion expansion in Antofagasta",
    },
    excerpt: {
      es: "El directorio dio luz verde a la fase II del rajo principal, que elevará la producción a 380 mil toneladas de cobre fino al año a partir de 2028.",
      en: "The board green-lit phase II of the main pit, lifting output to 380,000 tonnes of fine copper per year from 2028.",
    },
    sector: "mineria",
    source: "Minería al Día",
    date: "2026-07-09",
    readingMinutes: 4,
    featured: true,
  },
  {
    id: "n02",
    title: {
      es: "HidroAustral ingresa a evaluación ambiental su planta de hidrógeno verde en Magallanes",
      en: "HidroAustral files environmental review for green hydrogen plant in Magallanes",
    },
    excerpt: {
      es: "El proyecto de US$ 3.200 millones contempla 1,2 GW de electrólisis y una terminal de amoníaco para exportación a Asia y Europa.",
      en: "The US$3.2 billion project includes 1.2 GW of electrolysis and an ammonia terminal for exports to Asia and Europe.",
    },
    sector: "hidrogeno",
    source: "Energía Sur",
    date: "2026-07-07",
    readingMinutes: 6,
    featured: true,
  },
  {
    id: "n03",
    title: {
      es: "Precio del litio acumula tres meses al alza impulsado por demanda de baterías",
      en: "Lithium price posts third straight monthly gain on battery demand",
    },
    excerpt: {
      es: "El carbonato CIF Asia cerró junio en US$ 13.100 por tonelada. Analistas proyectan un mercado equilibrado hacia fines de 2026.",
      en: "Carbonate CIF Asia closed June at US$13,100 per tonne. Analysts see a balanced market by late 2026.",
    },
    sector: "litio",
    source: "Metales & Mercados",
    date: "2026-07-03",
    readingMinutes: 3,
    featured: true,
    premium: true,
  },
  {
    id: "n04",
    title: {
      es: "Desaladora Bahía Norte alcanza 60% de avance y compromete agua para tres faenas",
      en: "Bahía Norte desalination plant hits 60% completion, commits water to three mines",
    },
    excerpt: {
      es: "La planta de 1.800 l/s firmó contratos take-or-pay con dos mineras de cobre y una operación de litio del salar.",
      en: "The 1,800 l/s plant signed take-or-pay contracts with two copper miners and a lithium operation in the salar.",
    },
    sector: "desalinizacion",
    source: "AguaTech Latam",
    date: "2026-06-30",
    readingMinutes: 5,
  },
  {
    id: "n05",
    title: {
      es: "SolarAndes conecta parque de 420 MW con almacenamiento en la región de Atacama",
      en: "SolarAndes connects 420 MW solar-plus-storage park in Atacama region",
    },
    excerpt: {
      es: "La central Oasis incorpora 200 MWh de baterías y venderá energía 24/7 a clientes industriales bajo contratos PPA a 15 años.",
      en: "The Oasis plant adds 200 MWh of batteries and will sell 24/7 power to industrial clients under 15-year PPAs.",
    },
    sector: "energia",
    source: "Energía Sur",
    date: "2026-06-26",
    readingMinutes: 4,
  },
  {
    id: "n06",
    title: {
      es: "Cobre supera los US$ 4,9 por libra y toca máximos de 18 meses",
      en: "Copper tops US$4.90 per pound, an 18-month high",
    },
    excerpt: {
      es: "Inventarios en mínimos y la electrificación global sostienen el rally. La bolsa de metales anticipa un déficit estructural hacia 2030.",
      en: "Record-low inventories and global electrification sustain the rally. The metals exchange expects a structural deficit by 2030.",
    },
    sector: "mineria",
    source: "Metales & Mercados",
    date: "2026-06-24",
    readingMinutes: 3,
    premium: true,
  },
  {
    id: "n07",
    title: {
      es: "AtacamaLit presenta tecnología de extracción directa con 85% de recuperación",
      en: "AtacamaLit unveils direct extraction technology with 85% recovery",
    },
    excerpt: {
      es: "La compañía asegura que su proceso DLE reduce en 70% el consumo de agua fresca frente a la evaporación tradicional en pozas.",
      en: "The company says its DLE process cuts freshwater use by 70% versus traditional evaporation ponds.",
    },
    sector: "litio",
    source: "Minería al Día",
    date: "2026-06-19",
    readingMinutes: 7,
  },
  {
    id: "n08",
    title: {
      es: "Vientos del Sur inicia montaje de aerogeneradores en el Biobío",
      en: "Vientos del Sur begins turbine assembly in Biobío",
    },
    excerpt: {
      es: "El parque eólico de 380 MW instalará 54 turbinas de 7 MW y espera su puesta en marcha para el segundo semestre de 2027.",
      en: "The 380 MW wind farm will install 54 turbines of 7 MW each, with start-up expected in H2 2027.",
    },
    sector: "energia",
    source: "Energía Sur",
    date: "2026-06-15",
    readingMinutes: 4,
  },
  {
    id: "n09",
    title: {
      es: "Gremio minero proyecta inversiones por US$ 18.500 millones en la próxima década",
      en: "Mining association projects US$18.5 billion in investment over the next decade",
    },
    excerpt: {
      es: "El catastro anual identifica 18 iniciativas estructurales, con la desalinización y el hidrógeno ganando peso en la cartera.",
      en: "The annual survey identifies 18 structural initiatives, with desalination and hydrogen gaining share in the pipeline.",
    },
    sector: "mineria",
    source: "El Diario Financiero Minero",
    date: "2026-06-11",
    readingMinutes: 5,
  },
  {
    id: "n10",
    title: {
      es: "Amoníaco verde: Mejillones se perfila como hub de exportación del norte",
      en: "Green ammonia: Mejillones emerges as the north's export hub",
    },
    excerpt: {
      es: "Dos proyectos suman 1,4 millones de toneladas anuales de capacidad y evalúan compartir infraestructura portuaria y de almacenamiento.",
      en: "Two projects total 1.4 million tonnes of annual capacity and are weighing shared port and storage infrastructure.",
    },
    sector: "hidrogeno",
    source: "H2 News Latam",
    date: "2026-06-06",
    readingMinutes: 6,
  },
  {
    id: "n11",
    title: {
      es: "Coquimbo licita sistema hídrico multipropósito con desalación y reúso",
      en: "Coquimbo tenders multipurpose water system with desalination and reuse",
    },
    excerpt: {
      es: "La iniciativa público-privada abastecería agua potable y riego, con una planta de 800 l/s ampliable y 90 km de conducción.",
      en: "The public-private initiative would supply drinking and irrigation water, with an expandable 800 l/s plant and 90 km of pipelines.",
    },
    sector: "desalinizacion",
    source: "AguaTech Latam",
    date: "2026-06-02",
    readingMinutes: 5,
  },
  {
    id: "n12",
    title: {
      es: "Producción de cobre crece 4,2% interanual en mayo y encadena seis alzas",
      en: "Copper output rises 4.2% year-on-year in May, sixth straight gain",
    },
    excerpt: {
      es: "Mejores leyes en faenas del norte y la entrada de una nueva concentradora explican el repunte, según el boletín sectorial.",
      en: "Higher grades at northern operations and a new concentrator explain the upturn, the sector bulletin says.",
    },
    sector: "mineria",
    source: "Boletín Cuprífero",
    date: "2026-05-28",
    readingMinutes: 3,
  },
  {
    id: "n13",
    title: {
      es: "Chile y la UE firman memorándum para cadenas de valor de litio e hidrógeno",
      en: "Chile and the EU sign memorandum on lithium and hydrogen value chains",
    },
    excerpt: {
      es: "El acuerdo facilita financiamiento verde y transferencia tecnológica, con foco en refinación local y trazabilidad de emisiones.",
      en: "The deal unlocks green financing and technology transfer, focused on local refining and emissions traceability.",
    },
    sector: "litio",
    source: "El Diario Financiero Minero",
    date: "2026-05-22",
    readingMinutes: 6,
    premium: true,
  },
  {
    id: "n14",
    title: {
      es: "Interconexión Desierto–Centro alcanza 45% de avance en su tramo norte",
      en: "Desierto–Centro interconnection reaches 45% progress on northern stretch",
    },
    excerpt: {
      es: "La línea HVDC de 1.500 km permitirá evacuar 3 GW solares hacia los centros de consumo y reducir vertimientos renovables.",
      en: "The 1,500 km HVDC line will carry 3 GW of solar power to demand centers and cut renewable curtailment.",
    },
    sector: "energia",
    source: "Energía Sur",
    date: "2026-05-16",
    readingMinutes: 4,
  },
  {
    id: "n15",
    title: {
      es: "Reúso de aguas: mineras del norte alcanzan 78% de recirculación promedio",
      en: "Water reuse: northern miners reach 78% average recirculation",
    },
    excerpt: {
      es: "El indicador mejora 6 puntos en tres años. La meta sectorial es operar con 90% de agua de mar o recirculada en 2030.",
      en: "The indicator improves 6 points in three years. The sector target is 90% seawater or recirculated water by 2030.",
    },
    sector: "desalinizacion",
    source: "AguaTech Latam",
    date: "2026-05-10",
    readingMinutes: 5,
  },
];
