export const CREDITS = [
  {
    code: "Tra 1", category: "Transport", title: "Alternative modes of transport", available: 8, part: 1,
    aim: "To maximise the potential for alternative local public, private and active transport modes through provision of sustainable transport measures appropriate to the site.",
    question: "What provisions are available for alternative modes of transport?",
    instruction: "Select all answers from A – G that apply. Where B applies select either C or D.",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 2, label: "Minimum number of compliant cycle storage spaces", sub: null },
      { id: "C", credits: 1, label: "Two compliant cycle facilities", sub: "Cycle storage spaces must be compliant with the calculation method in the Methodology section." },
      { id: "D", credits: 2, label: "Three compliant cycle facilities", sub: "Compliant cycle facilities: gender-specific or gender-neutral changing cubicles, shower facilities, ventilated drying area. One shower per 10 cycle spaces (min 1). Compliant cycle storage: covered, fixed to permanent structure, within 100m of main entrance, adequate lighting, both wheel and frame can be locked." },
      { id: "E", credits: 1, label: "Minimum number of compliant electric car recharging stations", sub: "Minimum 7kW charging stations. Calculation: first 200 spaces @3%, next 200 @2%, remaining @1%. Minimum 11 stations. Additional stations = 2× minimum." },
      { id: "F", credits: 1, label: "Additional electric car recharging stations", sub: "Constituted as 2× the minimum number required. Assets with ≥50 stations comply regardless of parking count." },
      { id: "G", credits: 2, label: "Minimum number of compliant car sharing priority spaces", sub: "≥5% of total car parking. Spaces must be: nearest to main entrance, separate from EV spaces, promoted via marketing to occupants." },
    ],
    criteria: [
      {
        id: 1,
        answer: "B,C,D",
        text: "Where no parking spaces are provided, options E, F, G are filtered out.",
        details: []
      },
      {
        id: 2,
        answer: "B",
        text: "Number of cycle storage spaces must be compliant with the calculation method in the Methodology section.",
        details: []
      },
      {
        id: 3,
        answer: "C,D",
        text: "Compliant cycle facilities are listed below:",
        details: [
          "a) Gender specific changing facilities or gender-neutral individual cubicles (including lockers)",
          "b) Shower facilities",
          "c) Ventilated drying area to hang wet clothes in a sheltered space",
          "d) Lockers: at least equal to number of cycle spaces, accessible regardless of gender",
          "e) Shower: one per 10 cycle spaces (min 1). Buildings with ≥8 showers comply regardless of cycle count",
          "f) Users accommodated regardless of gender — separate showers 50/50 or single cubicles + gender-neutral changing space",
          "g) Available for others in addition to cyclists"
        ]
      },
      {
        id: 4,
        answer: "C,D",
        text: "Shower requirements (where B applies):",
        details: []
      },
      {
        id: 5,
        answer: "C,D",
        text: "Cycle facilities criteria:",
        details: [
          "Compliant cycle storage: cycles secured, covered, fixed to permanent structure",
          "Spaces allow access for bikes to be easily stored and retrieved",
          "Facilities in prominent location — viewable from occupied building or main access",
          "Adequate lighting",
          "Spaces within 100m of main building entrance",
          "Folding bicycle-only storage is NOT compliant"
        ]
      },
      {
        id: 6,
        answer: "B",
        text: "Public bicycle sharing systems (up to 50% of cycle space requirement):",
        details: [
          "Program implemented by municipality or public-private partnership",
          "Open to casual users for one-way rides to work, education or shopping centres",
          "Bicycles at unattended urban locations operating as bicycle transit",
          "Service terminals throughout the city",
          "Average distance between terminals ≤500m in inner city areas",
          "Terminal within 500m of main building entrance",
          "Terminals do not need to comply with cycle rack requirements"
        ]
      },
      {
        id: 7,
        answer: "E,F",
        text: "Electric car recharging stations — must be compliant with calculation method:",
        details: [
          "Minimum 7kW charging stations",
          "Calculation: first 200 car spaces @3%, next 200 @2%, remaining @1%",
          "Minimum number rounded up (e.g. 10.2 → 11 spaces)",
          "Additional electric recharging stations = 2× the minimum required",
          "Assets with ≥50 stations comply regardless of parking count"
        ]
      },
      {
        id: 8,
        answer: "G",
        text: "Car sharing scheme — implemented and communicated to occupants:",
        details: [
          "Priority spaces ≥5% of total car parking capacity",
          "Spaces separate from those for electric car recharging",
          "Located nearest to main building entrance (does not affect disabled/parent-and-child parking)",
          "Marketing material developed and communicated to occupants"
        ]
      }
    ],
    methodology: [
      "Number of compliant cycle storage spaces — % of staff:",
      "  a) 10% of first 500 staff",
      "  b) 7% of next 500 staff",
      "  c) 5% of remaining staff (organisations >1000 staff)",
      "  Round up to nearest whole number. Where minimum spaces provided, no need to also provide additional facilities.",
      "",
      "Cycle space reduction: where ≥50% of Tra 02 (Public Transport) credits awarded, reduce cycle spaces by 50%.",
      "Public bicycle sharing: cap at 50% of requirement, not 50% of 50%.",
      "",
      "Example (1,200 staff): 500×10%=50, 500×7%=35, 200×5%=10 → 95 cycle spaces required.",
      "",
      "Electric car recharging stations — % of car parking:",
      "  First 200 spaces @3%",
      "  Next 200 spaces @2%",
      "  Remaining spaces @1%",
      "",
      "Example (1,200 spaces): 200×3%=6, 200×2%=4, 800×1%=8 → 18 stations minimum."
    ],
    evidence: [
      "Photographic evidence: cycle racks, showers, lockers, changing facilities, drying space, EV stations, car sharing spaces",
      "Calculations showing numbers of cycle storage and cycle facilities required",
      "Site/building plan showing location and numbers of cycle storage and cycle facilities",
      "Calculations showing % of electric car charging stations",
      "Site plan showing location and number of electric car charging stations",
      "Calculations showing % of car sharing spaces",
      "Site plan showing location of car sharing spaces",
      "Internal marketing material for car sharing scheme"
    ],
    notes: [
      "Sites with multiple buildings — may be assessed standalone or site-wide (Assessor discretion).",
      "Site-wide: facilities accessible to all users, or distinct group of buildings sharing facilities.",
      "Building users (non-staff e.g. retail): cycle spaces based on staff numbers. Visitor spaces = 5% of customer parking (min 10 spaces). ≥50 visitor spaces = compliance regardless of parking count.",
      "Rural locations: >10 miles to urban → 50% reduction; >20 miles → further reduction; >30 miles → 90% reduction. Not cumulative with transport proximity reduction."
    ]
  },
  { code: "Man 1", category: "Management", title: "Neighbourly Relations", available: 4, part: 1 },
  { code: "Man 2", category: "Management", title: "Responsible Sourcing", available: 4, part: 1 },
  { code: "Man 3", category: "Management", title: "Construction Waste Management", available: 3, part: 1 },
  { code: "Man 4", category: "Management", title: "Commissioning and Handover", available: 3, part: 1 },
  { code: "Ene 1", category: "Energy", title: "Reduction of Energy Use", available: 10, part: 1 },
  { code: "Ene 2", category: "Energy", title: "Energy Monitoring", available: 3, part: 1 },
  { code: "Ene 3", category: "Energy", title: "External Lighting", available: 2, part: 1 },
  { code: "Ene 4", category: "Energy", title: "Low Carbon Energy Sources", available: 6, part: 1 },
  { code: "Wat 1", category: "Water", title: "Water Consumption Reduction", available: 4, part: 1 },
  { code: "Wat 2", category: "Water", title: "Water Monitoring", available: 2, part: 1 },
  { code: "Mat 1", category: "Materials", title: "Materials Specification", available: 4, part: 1 },
  { code: "Mat 2", category: "Materials", title: "Durability and Resilience", available: 2, part: 1 },
  { code: "Mat 3", category: "Materials", title: "Design for Disassembly", available: 2, part: 1 },
  { code: "Was 1", category: "Waste", title: "Operational Waste", available: 4, part: 1 },
  { code: "Hea 1", category: "Health", title: "Visual Privacy", available: 2, part: 1 },
  { code: "Hea 2", category: "Health", title: "Office Lighting", available: 4, part: 1 },
  { code: "Hea 3", category: "Health", title: "Thermal Comfort", available: 2, part: 1 },
  { code: "Hea 4", category: "Health", title: "Acoustic Performance", available: 2, part: 1 },
  { code: "Pol 1", category: "Pollution", title: "Nitrogen Dioxide", available: 2, part: 1 },
  { code: "Pol 2", category: "Pollution", title: "Flooding", available: 2, part: 1 },
  { code: "Pol 3", category: "Pollution", title: "Surface Water Runoff", available: 1, part: 1 },
  { code: "Tra 2", category: "Transport", title: "Public Transport Access", available: 4, part: 1 },
  { code: "Tra 3", category: "Transport", title: "Travel Plan", available: 1, part: 1 },
  { code: "Lea 1", category: "Ecology", title: "Life Cycle Impacts", available: 4, part: 1 },
  { code: "Lea 2", category: "Ecology", title: "Ecology", available: 2, part: 1 },
  { code: "Lea 3", category: "Ecology", title: "Ecology", available: 2, part: 1 },
  { code: "Lea 4", category: "Ecology", title: "Ecology", available: 2, part: 1 },
  { code: "Man 5", category: "Management", title: "Purchasing", available: 3, part: 2 },
  { code: "Man 6", category: "Management", title: "Comfort", available: 2, part: 2 },
  { code: "Man 7", category: "Management", title: "Building User Guide", available: 2, part: 2 },
  { code: "Man 8", category: "Management", title: "Monitoring and Feedback", available: 3, part: 2 },
  { code: "Man 9", category: "Management", title: "Post-Occupancy Evaluation", available: 2, part: 2 },
  { code: "Man 10", category: "Management", title: "Environmental Management System", available: 3, part: 2 },
  { code: "Ene 5", category: "Energy", title: "Maintenance", available: 4, part: 2 },
  { code: "Ene 6", category: "Energy", title: "Energy Efficient Equipment", available: 2, part: 2 },
  { code: "Wat 3", category: "Water", title: "Leak Detection", available: 2, part: 2 },
  { code: "Wat 4", category: "Water", title: "Water Efficiency", available: 2, part: 2 },
  { code: "Wat 5", category: "Water", title: "Minimising Water Use", available: 2, part: 2 },
  { code: "Wat 6", category: "Water", title: "Water Reuse", available: 2, part: 2 },
  { code: "Hea 5", category: "Health", title: "Ventilation", available: 3, part: 2 },
  { code: "Hea 6", category: "Health", title: "Air Quality", available: 3, part: 2 },
  { code: "Hea 7", category: "Health", title: "Biophilic Design", available: 2, part: 2 },
  { code: "Tra 4", category: "Transport", title: "Green Travel Plan", available: 2, part: 2 },
  { code: "Tra 5", category: "Transport", title: "Transport Impact", available: 2, part: 2 },
  { code: "Lea 5", category: "Ecology", title: "Life Cycle Impacts", available: 4, part: 2 },
  { code: "Lea 6", category: "Ecology", title: "Ecology", available: 2, part: 2 },
  { code: "Lea 7", category: "Ecology", title: "Space Versatility", available: 2, part: 2 },
  { code: "Lea 8", category: "Ecology", title: "Healthy Buildings", available: 2, part: 2 },
];