export const CREDITS = [
  {
    code: "Tra 1", category: "Transport", title: "Alternative modes of transport", available: 8, part: 1,
    aim: "To maximise the potential for alternative local public, private and active transport modes through provision of sustainable transport measures appropriate to the site.",
    question: "What provisions are available for alternative modes of transport?",
    instruction: "Select all answers from A – G that apply. Where B applies select either C or D.",
    selectionMode: "multiple",
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
      "Number of compliant cycle storage spaces",
      "Compliant cycle storage spaces must be provided for a percentage of staff in accordance with the following figures:",
      "a) 10% of staff numbers for the first 500 staff",
      "b) 7% of staff numbers for the next 500 staff",
      "c) 5% of the remaining staff numbers for organisations with over 1000 staff",
      "",
      "If the number of cycling spaces that should be supplied is not a whole number, it must be rounded up to the nearest whole number.",
      "For example, where the number of cycling spaces that should be provided is calculated to be 10.2, the assessed number of spaces that must be provided is 11.",
      "Where more than the minimum number of compliant cycle spaces required for BREEAM compliance is provided, it is not necessary to also provide more than the minimum number of showers, lockers or changing facilities.",
      "",
      "For sites where at least 50% of the available credits for BREEAM In-Use issue Tra 02 Proximity to public transport have been awarded (rounded to the nearest whole credit), the number of compliant cycle spaces and facilities can be reduced by 50%.",
      "Where this is the case and a public bicycle sharing system is also being considered, the number of compliant spaces must still be provided for 50% of the original requirements, i.e. capped at 50%, not 50% of 50%.",
      "",
      "Example of calculation:",
      "For a building with 1,200 staff members:",
      "500 x 10% = 50",
      "500 x 7% = 35",
      "200 x 5% = 10",
      "Number of required cycle storage spaces = 50 + 35 + 10 = 95 spaces",
      "",
      "Number of compliant electric car recharging stations",
      "A minimum number of compliant electric car recharging stations must be provided for a percentage of car parking spaces in accordance with the following figures:",
      "a) 3% of car parking spaces for the first 200 spaces",
      "b) 2% of car parking spaces for the next 200 spaces",
      "c) 1% of the remaining car parking spaces for car parks with over 400 spaces",
      "",
      "If the number of electric car recharging stations that should be supplied is not a whole number, it must be rounded up to the nearest whole number.",
      "For example, where the number of electric car recharging stations that should be provided is calculated to be 10.2, the assessed number of electric car recharging stations that must be provided is 11.",
      "Additional electric car recharging stations are constituted as 2x the minimum number of electric car recharging stations required.",
      "Any asset that provides at least 50 electric car recharging stations will comply regardless of the number of parking spaces.",
      "",
      "Example of calculation for minimum number of electric car recharging stations required:",
      "For a building with 1200 car parking spaces:",
      "200 x 3% = 6",
      "200 x 2% = 4",
      "800 x 1% = 8",
      "Number of electric car recharging stations = 6 + 4 + 8 = 18 spaces"
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
  {
    code: "Tra 2", category: "Transport", title: "Public Transport Access", available: 8, part: 1,
    aim: "To ensure appropriate public transport provision is available to building users, thereby helping to reduce transport-related pollution and congestion.",
    question: "Is the asset within walking distance of public transport nodes which operate a frequent service?",
    instruction: "Select a single answer option based on the nearest compliant public transport node or dedicated bus provision.",
    selectionMode: "single",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 1, label: "Public transport node over 1km away via a safe pedestrian route, with a 30 minute peak-time service frequency" },
      { id: "C", credits: 2, label: "Public transport node over 1km away via a safe pedestrian route, with a 15 minute peak-time service frequency" },
      { id: "D", credits: 3, label: "Public transport node within 1km via a safe pedestrian route, with a 30 minute peak-time service frequency" },
      { id: "E", credits: 4, label: "A dedicated bus service is provided", sub: "The service must operate at the beginning and end of the working day and transfer users to a population centre, public transport interchange, or provide a door-to-door service." },
      { id: "F", credits: 4, label: "Public transport node within 500m via a safe pedestrian route, with a 30 minute peak-time service frequency" },
      { id: "G", credits: 6, label: "Public transport node within 1km via a safe pedestrian route, with a 15 minute peak-time service frequency" },
      { id: "H", credits: 8, label: "Public transport node within 500m via a safe pedestrian route, with a 15 minute peak-time service frequency" },
      { id: "I", credits: 0, label: "No public transport node in place that meets the above criteria" },
    ],
    criteria: [
      {
        id: 1,
        answer: "B,C,D,E,F,G,H",
        text: "Distance must be measured via safe pedestrian routes and not in a straight line.",
        details: []
      },
      {
        id: 2,
        answer: "B,C,D,E,F,G,H",
        text: "Services operating from more than one stop within proximity of the building must only be counted once at the closest stop. Different services at the same stop may be considered separately.",
        details: []
      },
      {
        id: 3,
        answer: "E",
        text: "Dedicated bus service criteria:",
        details: [
          "Service provided at the beginning and end of the working day",
          "Transfers users to the local population centre, public transport interchange, or provides a door-to-door service"
        ]
      }
    ],
    methodology: [
      "Measure distance using the actual safe pedestrian route from the building to the nearest compliant public transport node.",
      "Do not use straight-line distance.",
      "",
      "Where the same transport service operates from more than one nearby stop, count that service only once using the closest stop.",
      "Different services at the same stop can be treated as separate services.",
      "",
      "Dedicated bus service option:",
      "  Service must operate at the beginning and end of the working day.",
      "  Service must transfer users to a local population centre, public transport interchange, or provide a door-to-door service.",
      "",
      "Peak times should reflect when over 80% of building users arrive or leave, based on the building's normal shift pattern.",
    ],
    evidence: [
      "Annotated map showing the pedestrian route and measured distance to compliant public transport nodes",
      "Photographic evidence of the public transport network and safe pedestrian route(s)",
      "Copies of public transport timetables confirming service frequency at peak times",
      "Where applicable, a letter confirming the provision and operating details of the dedicated bus service"
    ],
    notes: [
      "Compliant transport nodes include bus services, tram stops, and railway stations.",
      "The service at each node must provide travel to or from an urban centre, major transport node, or community focal point such as a school, library, village centre, or doctor's surgery.",
      "Assess local services only. Exclude national transport services unless they clearly operate as a local commuter service.",
      "Safe pedestrian routes include pavements, safe crossing points, and dedicated pedestrian crossing points where provided.",
      "Assessor judgement is required where route safety is unclear, and the justification should be recorded."
    ]
  },
  {
    code: "Tra 3", category: "Transport", title: "Proximity to amenities", available: 4, part: 1,
    aim: "To ensure building users have appropriate access to amenities near to the asset, consequently reducing transport-related impacts.",
    question: "Is the asset within walking distance of amenities?",
    instruction: "Select a single answer option based on the number of compliant amenities and their walking distance via a safe pedestrian route.",
    selectionMode: "single",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 1, label: "2 amenities are within 1km of the asset via a safe pedestrian route" },
      { id: "C", credits: 2, label: "2 amenities are within 500m of the asset via a safe pedestrian route" },
      { id: "D", credits: 2, label: "4 amenities are within 1km of the asset via a safe pedestrian route" },
      { id: "E", credits: 4, label: "4 amenities are within 500m of the asset via a safe pedestrian route" },
      { id: "F", credits: 0, label: "None of the above" },
    ],
    criteria: [
      {
        id: 1,
        answer: "B-E",
        text: "All counted amenities must be open during employee working hours.",
        details: []
      },
      {
        id: 2,
        answer: "B-E",
        text: "Distance must be measured via safe pedestrian routes and not in a straight line.",
        details: []
      },
      {
        id: 3,
        answer: "B-E",
        text: "Eligible amenity types:",
        details: [
          "Access to an outdoor open space",
          "Access to a recreation or leisure facility for fitness or sport",
          "Access to cash",
          "Appropriate food outlet",
          "Childcare facility or school",
          "Community facility",
          "Over the counter pharmacy services",
          "Publicly available postal facility",
          "Each amenity type can only be counted once"
        ]
      }
    ],
    methodology: [
      "Measure walking distance using the actual safe pedestrian route from the asset to each amenity.",
      "Do not use straight-line distance.",
      "",
      "Amenities must be open during employee working hours, defined by when the majority of building users work within the asset.",
      "Count each amenity type only once.",
      "",
      "Safe pedestrian routes include pavements, safe crossing points, and dedicated pedestrian crossing points where provided.",
    ],
    evidence: [
      "Where amenities are external to the asset: annotated map showing the route and distance to each listed amenity",
      "Where amenities are external to the asset: photographic evidence of listed amenities and safe pedestrian route(s)",
      "Where amenities are contained within the asset: floor plans showing amenity locations",
      "Where amenities are contained within the asset: photographic evidence of listed amenities and safe pedestrian route(s)"
    ],
    notes: [
      "Outdoor open space should be suitably sized, accessible to building users, and not form part of the public highway.",
      "Access to cash must be available at relevant times and not require a purchase. Cash-back from a retail till is not compliant.",
      "An appropriate food outlet should be affordable to the majority of users and suitable for day-to-day needs.",
      "A school cannot be counted as an amenity for a BREEAM assessment of that same school.",
      "Assessor judgement is required where route safety is unclear, and the justification should be recorded."
    ]
  },
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
  {
    code: "Tra 4", category: "Transport", title: "Pedestrian and cyclist safety", available: 2, part: 2,
    aim: "To encourage the provision of safe access around the site and outdoor space that enhances the wellbeing of building users as they move around.",
    question: "Are service delivery access points, routes, and manoeuvring areas on-site independent from parking areas, pedestrian, and cyclist access points and routes?",
    instruction: "Select a single answer option based on whether access points, routes, and manoeuvring areas are independent.",
    selectionMode: "single",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 0, label: "No" },
      { id: "C", credits: 1, label: "Service delivery routes and manoeuvring areas are independent from parking areas, pedestrian and cyclist routes, but access points are not independent" },
      { id: "D", credits: 2, label: "Yes" },
    ],
    criteria: [
      {
        id: 1,
        answer: "D",
        text: "If the building has no external areas and internal access is directly from the public highway or footpath, the building is compliant.",
        details: []
      },
      {
        id: 2,
        answer: "D",
        text: "Small scale delivery exception:",
        details: [
          "Applies only where deliveries are made by cars or small vans up to 6 metres in length",
          "A dedicated delivery parking position must be provided and kept separate from regular parking spaces",
          "Deliveries should be infrequent, on average less than three deliveries a day",
          "Access, parking, and turning areas must support simple manoeuvring and avoid repeated shunting"
        ]
      },
      {
        id: 3,
        answer: "D",
        text: "Car access points and routes do not need to be independent from cyclist and pedestrian access points and routes.",
        details: []
      }
    ],
    methodology: [
      "Assess whether service delivery access points, routes, and manoeuvring areas are separated from pedestrian, cyclist, and parking areas.",
      "",
      "Where small delivery vehicles are the only deliveries accepted, the credit can still be achieved if a separate delivery space is provided, deliveries are infrequent, and manoeuvring is simple.",
      "",
      "If internal manoeuvring areas are also used by pedestrians or cyclists, those internal routes must also be independent.",
    ],
    evidence: [
      "Copy of site map showing service delivery areas in relation to parking, pedestrian, and cyclist areas to demonstrate separation",
      "Photographic evidence of service delivery areas and safe pedestrian route(s)"
    ],
    notes: [
      "Safe pedestrian routes include pavements, safe crossing points, and dedicated pedestrian crossing points where provided.",
      "Assessor judgement is required where route safety is unclear, and the justification should be recorded.",
      "Internal manoeuvring areas used by pedestrians or cyclists must also have independent routes."
    ]
  },
  { code: "Tra 5", category: "Transport", title: "Transport Impact", available: 2, part: 2 },
  { code: "Lea 5", category: "Ecology", title: "Life Cycle Impacts", available: 4, part: 2 },
  { code: "Lea 6", category: "Ecology", title: "Ecology", available: 2, part: 2 },
  { code: "Lea 7", category: "Ecology", title: "Space Versatility", available: 2, part: 2 },
  { code: "Lea 8", category: "Ecology", title: "Healthy Buildings", available: 2, part: 2 },
];
