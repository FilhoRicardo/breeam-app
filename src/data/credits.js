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
  {
    code: "Mat 1", category: "Materials", title: "Condition survey", available: 7, part: 1,
    aim: "To encourage asset owners to understand the physical condition of their property, plan scheduled maintenance, repair or refurbishment, and avoid higher-impact, costlier works later — achieving or exceeding the expected life of the asset.",
    question: "Has a condition survey been completed within the last 5 years? Has work been conducted to rectify any defects identified?",
    instruction: "Select one option from B–E for the condition survey, and (if C, D, or E was selected) one option from F–J for the rectification action.",
    selectionMode: "multiple",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 0, label: "No condition survey has been carried out" },
      { id: "C", credits: 1, label: "A condition survey has been carried out by the organisation managing the asset" },
      { id: "D", credits: 2, label: "A condition survey by the organisation managing the asset, following a third-party procedure" },
      { id: "E", credits: 3, label: "A condition survey has been carried out by an independent third party" },
      { id: "F", credits: 0, label: "No works have been carried out to rectify defects, and there is no action plan" },
      { id: "G", credits: 1, label: "No works carried out yet, but an action plan is in place" },
      { id: "H", credits: 2, label: "All major defects have been rectified" },
      { id: "I", credits: 3, label: "All major defects rectified; action plan for remaining minor defects" },
      { id: "J", credits: 4, label: "All identified major and minor defects have been rectified" },
    ],
    criteria: [
      { id: 1, answer: "All", text: "Filtering: if the asset is less than 5 years old and no condition survey has been undertaken, this issue can be filtered out.", details: [] },
      { id: 2, answer: "C-E", text: "A condition survey assesses the asset's main building elements, components and construction products, including (as a minimum):", details: [
        "Structural condition",
        "Mechanical components",
        "Electrical components",
        "Plumbing",
        "Fire protection",
        "Communications and life safety systems",
        "Health & Safety / environmental conditions (damp, cold, draughts, acoustic and noise penetration, ventilation, daylight, pests)",
      ] },
      { id: 3, answer: "G,I", text: "Criteria for repairing or renewing defective elements must be established, including major vs minor categorisation.", details: [] },
      { id: 4, answer: "G-J", text: "The condition survey provides recommendations for future ongoing maintenance, repair, replacement and refurbishment for the remaining life of the asset.", details: [] },
      { id: 5, answer: "C-J", text: "The condition survey must be carried out by a competent person.", details: [] },
    ],
    methodology: [
      "Engage a competent person (facilities/asset manager, civil engineer, architect, building surveyor, or member of a relevant institution) with at least two comparable surveys in the last 5 years.",
      "Survey covers fabric and services with the elements listed in the criteria.",
      "Where Rsc 01/Mat 1 is answered C–E and defects exist, run a rectification programme and pair it with an action plan.",
    ],
    evidence: [
      "Public records of property registration (where the asset is less than 5 years old and filtering is claimed)",
      "Current condition survey documentation",
      "Name, organisation, third-party certification (where available) and qualifications/experience of the surveyor",
    ],
    notes: [
      "Major defects: needed for the asset to operate and function correctly.",
      "Minor defects: do not currently affect function, but may in future, or are cosmetic.",
      "Third party: independent of the organisation(s) who manage, own, or occupy the asset (per BS EN 15804:2012+A1:2013).",
    ],
  },
  {
    code: "Mat 2", category: "Materials", title: "Reuse and recycling facilities", available: 8, part: 1,
    aim: "To facilitate the reuse, repurposing and recycling of waste from the asset.",
    question: "Are suitable facilities available for segregating, storing and collecting waste from the asset to enable optimal reuse or recycling?",
    instruction: "Select all answers that apply. Exemplary options E and F can only be selected if both C and D are selected.",
    selectionMode: "multiple",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 0, label: "No" },
      { id: "C", credits: 3, label: "Suitable operational waste management facility for waste generated by the organisation managing the asset" },
      { id: "D", credits: 5, label: "Suitable operational waste management facility for waste generated by the occupant(s)" },
      { id: "E", credits: 0, label: "Exemplary: construction waste management space for waste generated during occupant fit-out works", sub: "Exemplary — does not contribute to the standard credit total." },
      { id: "F", credits: 0, label: "Exemplary: reusable construction product storage space on-site or locally", sub: "Exemplary — does not contribute to the standard credit total." },
    ],
    criteria: [
      { id: 1, answer: "C,D", text: "Waste segregation containers must:", details: [
        "Meet 'Operational waste – Waste stream segregation' (min 3 streams)",
        "Be grouped together in the facility",
        "Be appropriate to the waste stream — closable, non-absorbent, leak-proof, durable",
        "Be clearly labelled",
      ] },
      { id: 2, answer: "C,D", text: "The operational waste management facility must:", details: [
        "Be central and dedicated",
        "Be clearly labelled",
        "Be accessible to occupants/facilities operators and to collection vehicles (incl. disabled access)",
        "Have adequate lighting, ventilation and sound insulation",
        "Have appropriate vehicular gates and manoeuvring/loading space where collected internally",
        "Have an adjacent water outlet where organic waste is stored",
        "Be a single space or two separate spaces (manager + occupant)",
      ] },
      { id: 3, answer: "C,D", text: "Size: at least 2 m² per 1000 m² of net floor area for assets < 5000 m²; 10 m² minimum for assets ≥ 5000 m²; +2 m²/1000 m² where catering is provided.", details: [] },
      { id: 4, answer: "E", text: "The construction waste management space is separate from the operational facility, has appropriate containers and is sized to likely waste classifications/quantities.", details: [] },
      { id: 5, answer: "F", text: "The reusable construction product storage space is separate from both other spaces, and is dry, enclosed, secure, and appropriately sized.", details: [] },
      { id: 6, answer: "E,F", text: "Exemplary E and F can only be selected when both C and D are achieved.", details: [] },
    ],
    methodology: [
      "Inventory likely waste streams using Rsc 06 / Man 7 records if available, else estimate by asset type.",
      "Confirm a minimum of three waste streams are segregated.",
      "Where waste is commingled, the collector must demonstrate post-collection separation.",
      "For consistent and large amounts of operational waste, provide static compactors or balers in a service area.",
    ],
    evidence: [
      "Records from the waste collector if waste is commingled, demonstrating separation into the identified waste streams",
      "Photographic evidence of the facility and containers",
      "Site plans showing facility location and access",
    ],
    notes: [
      "Accessible space: typically within 20 m of an entrance to the asset; assessor judgement on tenancy-restricted sites.",
      "Commingled recycling: waste collected in one receptacle and separated later (glass, plastics, cardboard, paper, metals).",
      "Reusable construction products: leftover or removed products likely to be reused (carpet tiles, raised floor tiles, ceiling tiles, luminaires, HVAC components).",
    ],
  },
  {
    code: "Mat 3", category: "Materials", title: "Resources inventory", available: 4, part: 1,
    aim: "To enable asset owners to recognise, maintain and benefit from the value of resources in the asset, increase reuse and recycling, and reduce use of virgin materials.",
    question: "Has a resources inventory been completed in the last 5 years?",
    instruction: "Select a single answer option.",
    selectionMode: "single",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 0, label: "No" },
      { id: "C", credits: 2, label: "Yes, simple resources inventory", sub: "Functional classification, constituent materials, location, and estimated quantity for each significant resource." },
      { id: "D", credits: 4, label: "Yes, extended resources inventory", sub: "Adds current financial value, guidance on maintaining value, disassembly/demolition guidance, and reuse/recycling opportunities." },
    ],
    criteria: [
      { id: 1, answer: "C,D", text: "Mat 1 (Condition survey) is answered D or E with all criteria met — or the asset is < 5 years old and Mat 1 is filtered out.", details: [] },
      { id: 2, answer: "C,D", text: "The inventory is produced by a competent person who meets the Mat 1 criteria and has knowledge of circular economy principles in relation to maintaining and realising the value of resources.", details: [] },
      { id: 3, answer: "C,D", text: "If Mat 1 is answered D or E, the resources inventory must be fully coordinated with the condition survey.", details: [] },
      { id: 4, answer: "C,D", text: "The inventory is held as an electronic schedule (e.g. spreadsheet) or in a building information model (BIM) usable by the organisation managing the asset.", details: [] },
    ],
    methodology: [
      "Simple inventory: list each significant resource with functional classification (e.g. Uniclass), constituent materials, location, and estimated quantity.",
      "Extended inventory: add current financial value, guidance for maintaining value through maintenance/repair/replacement/refurbishment, disassembly/demolition guidance, and reuse/recycling opportunities.",
      "Use the condition survey from Mat 1 as the basis for the inventory's coverage.",
    ],
    evidence: [
      "A copy of the resources inventory, with sections cross-referenced against each answer and criterion",
    ],
    notes: [
      "Circular economy principles: BS 8001:2017, Ellen MacArthur Foundation, UKGBC circular economy guidance.",
      "Resource in the asset: a construction product, fitting or item of furniture. Minor fixings (brackets, nails, screws), adhesives, and seals may be excluded.",
    ],
  },
  {
    code: "Was 1", category: "Waste", title: "Future adaptation", available: 4, part: 1,
    aim: "To recognise and encourage buildings designed with a degree of flexibility for future usage.",
    question: "Does the design of the asset allow future adaptation to meet changing demands such as variations in use and functionality?",
    instruction: "Select all answers that apply. Exemplary option D can only be selected if option C is also selected.",
    selectionMode: "multiple",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 0, label: "No" },
      { id: "C", credits: 4, label: "Yes" },
      { id: "D", credits: 0, label: "Exemplary: a building-specific functional adaptation strategy study has been undertaken", sub: "Exemplary — does not contribute to the standard credit total." },
    ],
    criteria: [
      { id: 1, answer: "C", text: "Flexibility shall consist of at least two of the following:", details: [
        "Partition walls that can be easily re-positioned",
        "A flexible internal vertical loadbearing structure (regular column layout, few/no loadbearing walls)",
        "Building services that can be easily removed/adapted (HVAC grilles, luminaires)",
        "Floor plan shapes, primary circulation routes, and floor-to-floor heights suitable for several future uses",
        "Other design features deemed suitable by the assessor",
      ] },
      { id: 2, answer: "D", text: "A functional adaptation strategy study should consider:", details: [
        "Feasibility: multiple/alternative uses, area functions, different tenancies over the life cycle",
        "Accessibility: replacement of major plant, panels in floors/walls, lifting beams/hoists, access to local power and data",
        "Versatility: adaptability of the internal environment for changing working practices",
        "Adaptability: ventilation strategy adaptable to future occupants and climate scenarios",
        "Convertibility: internal physical space and external shell can accommodate use changes",
        "Expandability: potential for horizontal/vertical extension",
        "Refurbishment potential: scope for major refurbishment including façade replacement",
      ] },
      { id: 3, answer: "D", text: "Exemplary level: D can only be selected when C has been selected.", details: [] },
    ],
    methodology: [
      "Confirm at least two flexibility features are present in the asset and document them with photos and plans.",
      "For the exemplary credit, commission a functional adaptation strategy study covering feasibility, accessibility, versatility, adaptability, convertibility, expandability, and refurbishment potential.",
      "Cross-reference design measures against BREEAM Table 24 (accessibility / spatial adaptability / expandability across fabric, structure, services, and interior design).",
    ],
    evidence: [
      "Photographic evidence of internal design features that allow flexibility",
      "Plans, studies, reports or other documentation showing functional adaptability was considered during design",
      "A copy of the functional adaptation strategy study (for the exemplary credit)",
    ],
    notes: [
      "This credit was originally titled 'Operational Waste' in the demo data — the bundled PDF (RSC_04) covers the BREEAM In-Use v6 'Future adaptation' issue and we follow the manual content rather than the original code title.",
    ],
  },
  { code: "Hea 1", category: "Health", title: "Visual Privacy", available: 2, part: 1 },
  { code: "Hea 2", category: "Health", title: "Office Lighting", available: 4, part: 1 },
  { code: "Hea 3", category: "Health", title: "Thermal Comfort", available: 2, part: 1 },
  { code: "Hea 4", category: "Health", title: "Acoustic Performance", available: 2, part: 1 },
  {
    code: "Pol 1", category: "Pollution", title: "Minimising watercourse pollution", available: 4, part: 1,
    aim: "To reduce the risk of polluting natural watercourses through contaminated surface run-off and/or grease from kitchen facilities entering drainage systems.",
    question: "Are there light-liquid separators fitted within the drainage system to vehicular areas and/or grease separators/filters for commercial kitchen facilities?",
    instruction: "Select all options that apply.",
    selectionMode: "multiple",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 0, label: "No" },
      { id: "C", credits: 2, label: "Yes, light-liquid interceptors are installed within the drainage system where potential sources of pollution exist" },
      { id: "D", credits: 2, label: "Yes, grease separators/filters are installed within commercial kitchen facilities" },
    ],
    criteria: [
      { id: 1, answer: "All", text: "Filtering: where the asset does not require light-liquid separators or grease separators, the associated credits can be filtered out of the assessment.", details: [] },
      { id: 2, answer: "C", text: "Areas that present a risk of watercourse pollution and require light-liquid/oil separators include:", details: [
        "Vehicle manoeuvring areas",
        "Car parks",
        "Waste disposal facilities",
        "Delivery and storage facilities",
        "Plant areas",
      ] },
      { id: 3, answer: "C,D", text: "Where no light-liquid or grease separators are present, the assessor must confirm there are no areas at risk of pollution or commercial kitchens on-site.", details: [] },
    ],
    methodology: [
      "Identify drainage areas that serve vehicle parking, plant rooms, waste handling, delivery and other potentially polluting activities and confirm appropriate light-liquid separators are installed.",
      "For commercial kitchens (restaurants, cafeterias, hotels, hospitals, schools, workplace canteens etc.), verify grease separators or filters are installed and maintained.",
      "Both credits can be claimed where both measures apply. Each can be filtered out independently when not applicable.",
    ],
    evidence: [
      "Photographic evidence of separator equipment installed on-site",
      "Site plans detailing location of separators",
      "Site plans or assessor site inspection report confirming the site has no areas at risk or commercial kitchens (when filtering)",
    ],
    notes: [
      "Indoor parking: if the design team can demonstrate absolutely no run-off and no hydrocarbon spillage, the credit can still be met; otherwise the criteria apply.",
      "Light-liquid/oil separator: a vessel within a surface water drainage system that retains free-floating light liquids such as oil by gravity and/or coalescence.",
      "Watercourses and sewers include rivers, streams, ditches, drains, culverts, dykes, sluices, sewers and passages through which water flows.",
    ],
  },
  {
    code: "Pol 2", category: "Pollution", title: "Chemical storage", available: 2, part: 1,
    aim: "To reduce the impact of a chemical leak or spill by containing the substance and minimising impact on other areas of the building.",
    question: "Are all hazardous chemicals stored in areas with adequate containment to deal with ≥110% of the chemicals stored?",
    instruction: "Select a single answer option.",
    selectionMode: "single",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 0, label: "No" },
      { id: "C", credits: 2, label: "Yes" },
    ],
    criteria: [
      { id: 1, answer: "All", text: "Filtering: where there are no hazardous chemicals stored in the asset, this issue can be filtered out of the assessment.", details: [] },
      { id: 2, answer: "C", text: "Containment for spillage can be one mitigation measure or a combination of several, including (but not limited to):", details: [
        "Double-skin tanks",
        "Drip trays",
        "Non-permeable membranes in the room where tanks are located",
        "Bunding",
      ] },
    ],
    methodology: [
      "Inventory all hazardous chemicals stored on-site (fuels, cleaning agents, refrigerants, lab chemicals etc.).",
      "Verify the containment volume around each storage location is at least 110% of the chemical volume stored.",
      "Where no hazardous chemicals are stored, filter the credit out with assessor confirmation.",
    ],
    evidence: [
      "Photographic evidence of chemical storage",
      "Confirmation that facilities are appropriate to the area they serve",
    ],
    notes: [
      "Hazardous chemicals: chemicals with properties that make them dangerous or capable of having a harmful effect on human health or the environment. Reference list: Hazardous Waste List (HWL) of the European Waste Catalogue (EWC).",
    ],
  },
  {
    code: "Pol 3", category: "Pollution", title: "Local air quality", available: 4, part: 1,
    aim: "To reduce the asset's contribution to local air pollution by using no- or low-emission heating and hot water systems.",
    question: "Do the asset's heating and hot water systems generate local emissions of nitrogen oxides, particulate matter or volatile organic compounds?",
    instruction: "Select a single answer option.",
    selectionMode: "single",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 0, label: "Yes, emissions from combustion appliance(s) exceed the BREEAM emission limits" },
      { id: "C", credits: 1, label: "Yes, emissions from biomass or solid fuel combustion appliance(s) comply with the BREEAM emission limits", sub: "Biomass / solid fuel boilers: NOₓ ≤ 200–350 mg/m³, PM ≤ 40 mg/m³, VOC ≤ 20 mg/m³." },
      { id: "D", credits: 2, label: "Yes, emissions from oil combustion appliance(s) comply with the BREEAM emission limits", sub: "Oil boiler: NOₓ ≤ 120 mg/kWh." },
      { id: "E", credits: 3, label: "Yes, emissions from gas combustion appliance(s) comply with the BREEAM emission limits", sub: "Gas boiler: NOₓ ≤ 56 mg/kWh." },
      { id: "F", credits: 4, label: "No, all heating and hot water is supplied by non-combustion system(s) (e.g. powered by electricity)" },
    ],
    criteria: [
      { id: 1, answer: "All", text: "Filtering: where the asset is connected to a district heating system outside the control of the building owner or manager, this issue can be filtered out.", details: [] },
      { id: 2, answer: "B-E", text: "Credits are awarded where emissions from combustion appliances providing space heating and domestic hot water do not exceed the BREEAM emission limits.", details: [] },
      { id: 3, answer: "B-E", text: "Emission limits use the following units:", details: [
        "NOₓ measured in mg/kWh fuel input based on Gross Calorific Value (GCV) for gas/oil",
        "Particulate matter and VOC for solid fuel/biomass boilers measured in mg/m³ 10% O₂ dry basis",
        "Particulate matter and VOC for solid fuel/biomass local heaters measured in mg/m³ 13% O₂ dry basis",
        "Manufacturer emission data must be supplied",
      ] },
      { id: 4, answer: "B-F", text: "Where multiple appliances are installed, credits are awarded based on the worst-performing appliance.", details: [] },
      { id: 5, answer: "B-F", text: "Back-up space or water heating appliances can be excluded from assessment (emergency-only use).", details: [] },
      { id: 6, answer: "B-E", text: "No credits may be awarded if any combustion appliance is not covered in Table 26 of the BREEAM manual (e.g. open fronted or open flue heaters).", details: [] },
    ],
    methodology: [
      "Identify all combustion appliances providing space heating or domestic hot water.",
      "Obtain manufacturer emissions data for each appliance and compare against BREEAM Table 26 limits.",
      "Where multiple appliances are present, score on the worst performer.",
      "Back-up emergency appliances may be excluded; district heating outside owner control may be filtered.",
    ],
    evidence: [
      "Manufacturer details for installed appliance(s) and their emissions levels",
      "Photographic evidence of heating and hot water system(s)",
    ],
    notes: [
      "Emission limits are based on the European Union Ecodesign Directive (2009/125/EC).",
      "If non-combustion (e.g. electric, heat pump powered by grid) systems supply all heating and hot water, full credit applies.",
    ],
  },
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
  { code: "Lea 1", category: "Ecology", title: "Planted Area", available: 4, part: 1 },
  { code: "Lea 2", category: "Ecology", title: "Ecology Features", available: 2, part: 1 },
  { code: "Lea 3", category: "Ecology", title: "Ecology Report", available: 2, part: 1 },
  { code: "Lea 4", category: "Ecology", title: "Biodiversity Plan", available: 2, part: 1 },
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
  {
    code: "Tra 5", category: "Transport", title: "Transport Impact", available: 2, part: 2,
    aim: "To recognise the ongoing measurement and management of transport-related impacts from building operation, encouraging lower-impact travel choices for users and service movements.",
    question: "How is transport impact measured and managed for the asset in operation?",
    instruction: "Select a single answer option based on the maturity of the transport-impact survey, action plan, and review process in place for this asset.",
    selectionMode: "single",
    answers: [
      { id: "A", credits: 0, label: "Question not answered" },
      { id: "B", credits: 0, label: "No building-level transport impact measurement or plan is in place" },
      { id: "C", credits: 1, label: "A building-level transport survey or impact review is in place and its findings are documented" },
      { id: "D", credits: 2, label: "A building-level transport survey or impact review is in place, and a live transport improvement plan is being implemented and reviewed" },
    ],
    criteria: [
      {
        id: 1,
        answer: "C,D",
        text: "The assessment must be based on a site-specific review of how building users and operational activities travel to and from the asset.",
        details: [
          "Commuter journeys by staff and regular users",
          "Business travel where relevant to the building type",
          "Visitor travel where relevant to the building type",
          "Deliveries, collections, and service visits where relevant to the building type"
        ]
      },
      {
        id: 2,
        answer: "C,D",
        text: "The review should identify current travel patterns and the main transport impacts associated with the asset.",
        details: [
          "Existing user travel patterns and mode split",
          "Constraints and opportunities for walking, cycling, public transport, and car sharing",
          "Local public transport links and active travel facilities serving the asset",
          "Any operational transport impacts from deliveries or support services, where applicable"
        ]
      },
      {
        id: 3,
        answer: "D",
        text: "For 2 credits, the asset must have a live improvement plan informed by the survey findings.",
        details: [
          "Actions are assigned to responsible persons or teams",
          "Measures target a shift toward lower-impact transport modes",
          "The plan is communicated to relevant building users",
          "Progress is reviewed and updated on a regular cycle"
        ]
      }
    ],
    methodology: [
      "Undertake a site-specific transport impact review for the asset in operation.",
      "",
      "The review should consider all relevant user groups for the building type, which may include staff, regular occupiers, visitors, customers, contractors, and people making deliveries or collections.",
      "",
      "Capture how people currently travel to and from the asset and identify the resulting transport impacts, with particular attention to single-occupancy car travel, opportunities for active travel, and access to public transport.",
      "",
      "Where relevant to the asset, include operational travel associated with deliveries, collections, and support services so the review covers both people movement and routine transport activity generated by the building.",
      "",
      "Use survey results, transport statements, occupancy information, site observations, travel-plan reviews, or equivalent building-level evidence to establish the baseline position.",
      "",
      "For the 2-credit threshold, maintain a live transport improvement plan that responds to the review findings, sets out practical measures, allocates responsibility, and is revisited periodically to confirm progress."
    ],
    evidence: [
      "Transport survey, travel questionnaire results, or equivalent building-level transport impact review",
      "Documented summary of current travel patterns and transport impacts for relevant building users",
      "Copy of the building-level transport or travel plan showing current actions and responsible owners",
      "Records showing implementation, communication, or review of transport measures",
      "Supporting evidence for relevant measures such as cycle facilities, public transport information, car-sharing promotion, or delivery management arrangements"
    ],
    notes: [
      "This credit was completed from BRE-published transport impact and travel-plan criteria because the local TRA_05 manual PDF is not bundled in this repository.",
      "Use assessor judgement to define which user groups and transport activities are relevant to the asset type and scope of assessment.",
      "A corporate or campus-wide transport plan can support compliance only where the evidence clearly applies to the assessed asset and is implemented at building level.",
      "The strongest evidence is a current plan with named actions, ownership, and periodic review rather than a historic one-off survey."
    ]
  },
  { code: "Lea 5", category: "Ecology", title: "Ecology Strategy", available: 4, part: 2 },
  { code: "Lea 6", category: "Ecology", title: "Ecological Enhancement", available: 2, part: 2 },
  { code: "Lea 7", category: "Ecology", title: "Space Versatility", available: 2, part: 2 },
  { code: "Lea 8", category: "Ecology", title: "Healthy Buildings", available: 2, part: 2 },
];
