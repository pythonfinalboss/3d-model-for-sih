/**
 * MAITRI RESEARCH STATION - 2D SITE PLAN GEOMETRY & ASSETS
 * Reconstructed with 100% fidelity to the supplied aerial photographs and site plans:
 * 1. Wide-angle aerial perspective showing Lake Priyadarshini, Main Complex, and water intake pier.
 * 2. Overhead orthophoto of the full station footprint, roads, and snow moraines.
 * 3. High-resolution zoom on Main Station Complex, Y-spoke pod, radome, and generator hub.
 * 4. High-resolution zoom on North-West Fleet Depot, Blue Quonset Workshop, and container rows.
 * 5. Architectural blueprint and schematic flow diagrams.
 * 6. Low-angle close aerial photograph of the U-shaped Main Station with glass lounge and Indian flag.
 */

export const MAITRI_LAYOUT = {
  stationId: 'maitri',
  name: 'Maitri Research Station',
  shortName: 'Maitri',
  commissioned: 1989,
  location: 'Schirmacher Oasis, Queen Maud Land',
  coordinates: '70°45′57″S 11°44′09″E',
  elevation: '117 m ASL',
  viewBox: '0 0 1400 950',
  center: [700, 480],

  // Real-world topographic features: Lake Priyadarshini, melt ponds, snow drifts, roads, pipelines
  infrastructure: {
    // 1. Lake Priyadarshini & Meltwater Ponds (Exact shapes seen in photos 1, 2, 6)
    waterBodies: [
      // Lake Priyadarshini northern/western basin
      {
        id: 'lake_priyadarshini',
        name: 'Lake Priyadarshini (Freshwater Glacier Lake)',
        label: 'LAKE PRIYADARSHINI',
        labelPos: [420, 95],
        d: 'M -50,180 Q 80,160 180,190 T 360,170 T 560,120 Q 720,80 840,120 T 1120,130 T 1320,180 T 1450,220 L 1450,-50 L -50,-50 Z',
        fill: 'rgba(2, 132, 199, 0.42)',
        stroke: '#0284C7',
      },
      // Smaller meltwater pond northwest of Main Complex (seen in Photo 1 & 6)
      {
        id: 'central_melt_pond',
        name: 'Intake Meltwater Reservoir Pond',
        label: 'MELT POND',
        labelPos: [420, 390],
        d: 'M 400,380 Q 450,360 480,390 T 470,440 T 410,430 Z',
        fill: 'rgba(14, 165, 233, 0.35)',
        stroke: '#0284C7',
      },
      // Small moraine melt pond northeast of main hub (seen in Photo 6)
      {
        id: 'east_melt_pond',
        name: 'Glacial Melt Pool',
        d: 'M 820,310 Q 870,290 920,320 T 910,360 T 840,350 Z',
        fill: 'rgba(14, 165, 233, 0.30)',
        stroke: '#0284C7',
      },
    ],

    // 2. Snow Drifts & Glacial Moraines (Seen clearly in Photo 2, 3, 4)
    snowDrifts: [
      { d: 'M 0,220 Q 90,260 140,350 T 110,500 T 50,700 T 0,850 Z' },
      { d: 'M 220,190 Q 280,180 340,240 T 320,310 T 260,280 Z' },
      { d: 'M 540,260 Q 620,240 680,280 T 650,340 T 580,320 Z' },
      { d: 'M 740,560 Q 820,540 890,570 T 870,620 T 780,600 Z' },
      { d: 'M 1120,680 Q 1240,650 1340,710 T 1280,820 T 1160,780 Z' },
    ],

    // 3. Station Roads & Vehicle Access Tracks (Photographically mapped)
    roads: [
      // Primary trunk road: NW Vehicle Depot past Blue Workshop to Central Hub
      'M 200,240 L 320,310 L 460,420 L 590,510 L 640,600 L 780,680 L 980,720',
      // North-South connection past Main Station to Lake shore
      'M 590,510 L 630,410 L 650,330 L 780,280 L 980,280',
      // Loop road around the central generators and Y-spoke module
      'M 460,420 L 460,540 L 520,620 L 610,610',
      // Road leading to Helipad and Southern Fuel Tanks
      'M 640,600 L 580,720 L 520,810 L 380,830 L 260,840',
      // Spur to Summer Blue Container camp
      'M 780,280 L 960,270 L 1120,280 L 1180,340',
    ],

    // 4. Overground Heated Water Pipeline & Fuel Manifolds
    pipelines: [
      // Lake Intake pipeline on trestle pier extending into Lake Priyadarshini (seen in Photo 1)
      {
        id: 'maitri_water_intake_pier',
        type: 'water',
        name: 'Lake Priyadarshini Intake Pipeline & Trestle',
        d: 'M 90,195 L 240,360 L 380,410 L 420,410',
        stroke: '#06B6D4',
        width: 3.5,
        dashed: false,
      },
      // Pipeline connecting pump house to Generator Room and Main Complex
      {
        id: 'maitri_water_dist_pipe',
        type: 'water',
        name: 'Trace-Heated Potable Water Main',
        d: 'M 420,410 L 490,480 L 580,500 L 650,470 L 720,470',
        stroke: '#06B6D4',
        width: 3,
        dashed: true,
      },
      // Fuel transfer pipeline from skid tanks to Generator Room
      {
        id: 'maitri_fuel_pipeline',
        type: 'fuel',
        name: 'Fuel Delivery Manifold',
        d: 'M 280,800 L 340,740 L 440,660 L 490,570',
        stroke: '#F59E0B',
        width: 2.5,
        dashed: true,
      },
    ],

    powerLines: [
      'M 510,540 L 610,480 L 660,440 L 780,440 L 860,480',
      'M 510,540 L 430,470 L 330,370 L 250,290',
      'M 660,440 L 720,360 L 960,320',
      'M 510,540 L 560,680 L 720,740 L 920,760',
    ],

    contours: [
      'M 40,320 Q 240,280 520,310 T 980,290 T 1360,330',
      'M 60,540 Q 320,510 640,530 T 1060,510 T 1360,560',
      'M 80,740 Q 380,720 720,740 T 1120,730 T 1360,780',
    ],
  },

  // 16 Independently selectable & interactive buildings reconstructed from photos
  buildings: [
    // 1. MAIN STATION COMPLEX (CENTRAL HUB)
    // Iconic U-shaped / C-shaped building with silver corrugated cladding, blue trim & tricolor
    {
      id: 'maitri_main_station',
      name: 'Main Station Complex (Central Hub)',
      shortLabel: 'MAIN HUB',
      type: 'building',
      category: 'Command & Operations',
      colorStyle: 'silver',
      blueprintRef: 'Photo 1, 2, 3, 6 (U-Shaped Main Complex)',
      description: 'The iconic U-shaped central hub built on steel stilts, containing operations, radio comms, medical bay, and living modules enclosing a central courtyard.',
      center: [750, 470],
      area: '520 m²',
      hasTricolor: true,
      tricolorCoords: [865, 410],
      paths: [
        // North horizontal wing (corridor with labs & comms)
        {
          type: 'rect',
          x: 650,
          y: 390,
          width: 220,
          height: 38,
          rx: 2,
          customFill: 'rgba(203, 213, 225, 0.45)',
          ribs: [
            { x1: 690, y1: 390, x2: 690, y2: 428 },
            { x1: 730, y1: 390, x2: 730, y2: 428 },
            { x1: 770, y1: 390, x2: 770, y2: 428 },
            { x1: 810, y1: 390, x2: 810, y2: 428 },
            { x1: 850, y1: 390, x2: 850, y2: 428 },
          ],
        },
        // East connecting vertical wing
        {
          type: 'rect',
          x: 835,
          y: 428,
          width: 40,
          height: 95,
          rx: 2,
          customFill: 'rgba(203, 213, 225, 0.45)',
        },
        // South horizontal wing
        {
          type: 'rect',
          x: 580,
          y: 520,
          width: 245,
          height: 40,
          rx: 2,
          customFill: 'rgba(203, 213, 225, 0.45)',
          ribs: [
            { x1: 620, y1: 520, x2: 620, y2: 560 },
            { x1: 660, y1: 520, x2: 660, y2: 560 },
            { x1: 700, y1: 520, x2: 700, y2: 560 },
            { x1: 740, y1: 520, x2: 740, y2: 560 },
            { x1: 780, y1: 520, x2: 780, y2: 560 },
          ],
        },
        // West entry vestibule
        {
          type: 'rect',
          x: 650,
          y: 428,
          width: 32,
          height: 55,
          rx: 2,
          customFill: 'rgba(148, 163, 184, 0.4)',
        },
      ],
      defaultTelemetry: {
        Temperature: 21.5,
        Wind_Speed: 42.0,
        Solar_Radiation: 165,
        Occupancy: 25,
        Battery_Level: 82,
        Generator_Load: 72,
        Fuel_Level: 68,
        Energy_Consumption: 140,
      },
    },

    // 2. GLAZED OBSERVATION CUPOLA / LOUNGE (Seen prominently in Photo 6 at the SE corner of Main Hub)
    {
      id: 'maitri_observation_lounge',
      name: 'Glazed Observation Lounge & Solarium',
      shortLabel: 'OBS LOUNGE',
      type: 'building',
      category: 'Welfare & Operations',
      colorStyle: 'blue',
      blueprintRef: 'Photo 6 (Glazed Faceted Solarium)',
      description: 'The iconic glass-wrapped observation cupola at the southeast corner of the Main Station, providing panoramic views and passive solar warming.',
      center: [810, 540],
      area: '45 m²',
      hasGlazedLounge: true,
      glazedLoungeCoords: '785,520 835,520 825,560 785,560',
      paths: [
        {
          type: 'polygon',
          points: '785,520 835,520 825,560 785,560',
          customFill: 'rgba(45, 212, 191, 0.45)',
        },
      ],
      defaultTelemetry: {
        Temperature: 23.2,
        Occupancy: 8,
        Solar_Radiation: 240,
        Energy_Consumption: 22,
      },
    },

    // 3. SCIENTIFIC RESEARCH LABORATORY WING (North Wing of Main Complex)
    {
      id: 'maitri_lab',
      name: 'Atmospheric & Geomagnetic Laboratory Suite',
      shortLabel: 'LABORATORY',
      type: 'laboratory',
      category: 'Scientific Research',
      colorStyle: 'silver',
      blueprintRef: 'Photo 3 & 6 (North Wing Lab Suite)',
      description: 'Upper deck research laboratories housing the Brewer spectrophotometer, seismological recorders, magnetic sensor racks, and air sampling manifolds.',
      center: [750, 410],
      area: '180 m²',
      paths: [
        {
          type: 'rect',
          x: 680,
          y: 392,
          width: 140,
          height: 34,
          rx: 2,
          customFill: 'rgba(226, 232, 240, 0.35)',
        },
      ],
      defaultTelemetry: {
        Temperature: 22.0,
        Occupancy: 6,
        Energy_Consumption: 86,
        Solar_Radiation: 195,
      },
    },

    // 4. KITCHEN / DINING & LIVING QUARTERS (South Wing of Main Complex)
    {
      id: 'maitri_living',
      name: 'Living Quarters, Mess & Commissary',
      shortLabel: 'LIVING & MESS',
      type: 'residential',
      category: 'Living & Accommodation',
      colorStyle: 'silver',
      blueprintRef: 'Photo 6 (South Living Block)',
      description: 'Insulated crew berths, dining commissary, galley kitchen, sanitary blocks, and recreation spaces inside the south wing.',
      center: [670, 540],
      area: '240 m²',
      paths: [
        {
          type: 'rect',
          x: 600,
          y: 522,
          width: 150,
          height: 36,
          rx: 2,
          customFill: 'rgba(226, 232, 240, 0.35)',
        },
      ],
      defaultTelemetry: {
        Temperature: 21.2,
        Occupancy: 18,
        Energy_Consumption: 76,
      },
    },

    // 5. Y-SPOKE TRIANGULAR POD MODULE (Seen directly in Photo 3 & 6)
    {
      id: 'maitri_spoke_module',
      name: 'Triangular Y-Spoke Module Hub',
      shortLabel: 'Y-SPOKE HUB',
      type: 'residential',
      category: 'Living & Operations',
      colorStyle: 'orange',
      blueprintRef: 'Photo 3 & 6 (3-Armed Radiating Orange Hub)',
      description: 'Unique 3-pointed modular structure with 3 orange container wings radiating at 120° from a central connecting airlock hub.',
      center: [610, 680],
      area: '95 m²',
      isYSpoke: true,
      ySpokeRays: [
        '604,675 616,675 616,635 604,635', // North ray
        '612,682 620,674 648,698 640,706', // South-east ray
        '608,682 600,674 572,698 580,706', // South-west ray
      ],
      paths: [
        {
          type: 'circle',
          cx: 610,
          cy: 680,
          r: 10,
          customFill: 'rgba(234, 88, 12, 0.65)',
        },
      ],
      defaultTelemetry: {
        Temperature: 20.8,
        Occupancy: 6,
        Energy_Consumption: 38,
      },
    },

    // 6. INTERNAL GENERATOR ROOM & POWER PLANT (West of Y-Spoke & Main Hub)
    {
      id: 'maitri_generator',
      name: 'Generator Room & Power Station (DG-01 / DG-02)',
      shortLabel: 'GENERATOR ROOM',
      type: 'generator',
      category: 'Power & Utilities',
      colorStyle: 'orange',
      blueprintRef: 'Photo 1, 3, 6 (Internal Generator Shed)',
      description: 'Houses dual 62.5 kVA Caterpillar diesel generators with exhaust heat recovery boilers delivering heating to the main station.',
      center: [520, 580],
      area: '160 m²',
      paths: [
        {
          type: 'rect',
          x: 480,
          y: 550,
          width: 85,
          height: 55,
          rx: 3,
          customFill: 'rgba(234, 88, 12, 0.45)',
          ribs: [
            { x1: 510, y1: 550, x2: 510, y2: 605 },
            { x1: 540, y1: 550, x2: 540, y2: 605 },
          ],
        },
      ],
      defaultTelemetry: {
        Temperature: 86.4,
        Generator_Load: 78.5,
        Fuel_Level: 72.0,
        Energy_Consumption: 410,
        Battery_Level: 80.0,
      },
    },

    // 7. SATELLITE TRACKING RADOME (White sphere on pad, seen in Photo 1, 2, 3)
    {
      id: 'maitri_satellite',
      name: 'Satellite Ground Station & Geodesic Radome',
      shortLabel: 'SATELLITE RADOME',
      type: 'satellite',
      category: 'Communications',
      blueprintRef: 'Photo 1 & 3 (White Spherical Radome)',
      description: 'Prominent white weatherproof radome housing steerable satellite antenna maintaining broadband satellite link with mainland India.',
      center: [480, 480],
      area: '70 m²',
      paths: [
        // Circular concrete pad
        {
          type: 'circle',
          cx: 480,
          cy: 480,
          r: 22,
          customFill: 'rgba(51, 65, 85, 0.5)',
        },
        // White radome sphere
        {
          type: 'circle',
          cx: 480,
          cy: 480,
          r: 15,
          customFill: 'rgba(255, 255, 255, 0.95)',
        },
      ],
      defaultTelemetry: {
        Temperature: -18.0,
        Wind_Speed: 38.0,
        Solar_Radiation: 180,
        Energy_Consumption: 42,
      },
    },

    // 8. WATER RESERVOIR & PUMP HOUSE (Near Melt Pond, Photo 1 & 6)
    {
      id: 'maitri_water',
      name: 'Priyadarshini Water Pump Station & Settling Pit',
      shortLabel: 'WATER RESERVOIR',
      type: 'water',
      category: 'Life Support & Utilities',
      blueprintRef: 'Photo 1, 3, 6 (Lake Intake & Reservoir Pit)',
      description: 'Potable water intake station pumping fresh water from Lake Priyadarshini with insulated storage buffer tanks.',
      center: [380, 430],
      area: '130 m²',
      paths: [
        // Water pump shelter
        {
          type: 'rect',
          x: 350,
          y: 415,
          width: 55,
          height: 35,
          rx: 2,
          customFill: 'rgba(6, 182, 212, 0.35)',
        },
      ],
      defaultTelemetry: {
        Temperature: 5.2,
        Fuel_Level: 89.0, // Water fill capacity %
        Energy_Consumption: 34,
      },
    },

    // 9. CENTRAL CONTAINERIZED TRANSIT ROW (Orange containers near generator, Photo 3 & 6)
    {
      id: 'maitri_central_containers',
      name: 'Central Logistics & Technical Modules',
      shortLabel: 'CENTRAL MODULES',
      type: 'residential',
      category: 'Operations',
      colorStyle: 'orange',
      blueprintRef: 'Photo 3 & 6 (Orange Container Row)',
      description: 'Row of heavy-duty insulated orange shipping containers configured as field gear lockers, electrical substation, and workshops.',
      center: [515, 645],
      area: '120 m²',
      paths: [
        {
          type: 'rect',
          x: 460,
          y: 635,
          width: 110,
          height: 25,
          rx: 2,
          customFill: 'rgba(234, 88, 12, 0.65)',
          ribs: [
            { x1: 490, y1: 635, x2: 490, y2: 660 },
            { x1: 520, y1: 635, x2: 520, y2: 660 },
            { x1: 550, y1: 635, x2: 550, y2: 660 },
          ],
        },
      ],
      defaultTelemetry: {
        Temperature: 19.5,
        Occupancy: 4,
        Energy_Consumption: 48,
      },
    },

    // 10. BLUE BARREL-VAULT / QUONSET WORKSHOP (The famous blue garage in NW corner, Photo 1, 2, 4)
    {
      id: 'maitri_workshop',
      name: 'Heavy Vehicle Maintenance Workshop (Blue Quonset)',
      shortLabel: 'BLUE WORKSHOP',
      type: 'workshop',
      category: 'Maintenance & Fleet',
      colorStyle: 'blue',
      blueprintRef: 'Photo 1, 2, 4 (Distinctive Blue Barrel-Vault Arch)',
      description: 'The unmistakable bright blue semi-cylindrical arch workshop equipped with vehicle hoists, mechanical tooling, and spare tracks.',
      center: [320, 310],
      area: '260 m²',
      paths: [
        // Blue curved barrel-vault body
        {
          type: 'rect',
          x: 275,
          y: 285,
          width: 90,
          height: 50,
          rx: 16,
          customFill: 'rgba(37, 99, 235, 0.75)',
          ribs: [
            { x1: 295, y1: 285, x2: 295, y2: 335 },
            { x1: 315, y1: 285, x2: 315, y2: 335 },
            { x1: 335, y1: 285, x2: 335, y2: 335 },
            { x1: 355, y1: 285, x2: 355, y2: 335 },
          ],
        },
        // Workshop heavy door apron
        {
          type: 'polygon',
          points: '365,295 385,295 385,325 365,325',
          customFill: 'rgba(30, 41, 59, 0.7)',
        },
      ],
      defaultTelemetry: {
        Temperature: 18.8,
        Occupancy: 6,
        Energy_Consumption: 92,
      },
    },

    // 11. TRACKED VEHICLE FLEET & CONVOY STAGING (Adjacent to Fuel Storage, Blueprint Fig 4-A & Aerial Photo 1)
    {
      id: 'maitri_vehicles',
      name: 'Tracked Vehicle Fleet & Convoy Staging Area',
      shortLabel: 'VEHICLE FLEET',
      type: 'workshop',
      category: 'Logistics & Fleet',
      blueprintRef: 'Blueprint Figure 4-A & Aerial Photo 1 (Adjacent to Fuel Storage Farm)',
      description: 'Dedicated polar hardpack staging yard situated immediately adjacent to the fuel storage farm. Accommodates PistenBully 300 snowcats, heavy tracked Kassbohrer convoy traverse vehicles, mobile fuel sleds, and terrain cranes for Antarctic field logistics.',
      center: [435, 815],
      area: '340 m²',
      paths: [
        {
          type: 'polygon',
          points: '345,765 525,765 525,865 345,865',
          isStagingPad: true,
        },
      ],
      vehicles: [
        { x: 375, y: 790, label: 'PB-01' },
        { x: 415, y: 790, label: 'PB-02' },
        { x: 455, y: 790, label: 'CRANE' },
        { x: 495, y: 790, label: 'FUEL-TK' },
        { x: 375, y: 840, label: 'PB-03' },
        { x: 415, y: 840, label: 'CONVOY' },
        { x: 455, y: 840, label: 'ROVER-1' },
        { x: 495, y: 840, label: 'SLED-01' },
      ],
      defaultTelemetry: {
        Temperature: -32.5,
        Occupancy: 3,
        Energy_Consumption: 26,
        Fuel_Level: 85.0,
      },
    },

    // 12. RESIDENTIAL & OFFICE COMPACT BLOCKS (Two parallel container rows in NW, Photo 1, 2, 4)
    {
      id: 'maitri_residential',
      name: 'Residential & Office Compact Blocks (NW)',
      shortLabel: 'NW COMPACT BLOCKS',
      type: 'residential',
      category: 'Living & Accommodation',
      colorStyle: 'orange',
      blueprintRef: 'Photo 1, 2, 4 (Two Parallel Modular Blocks)',
      description: 'Two parallel rows of joined modular containers situated northwest of the Main Station providing expedition accommodation and quiet office berths.',
      center: [430, 270],
      area: '360 m²',
      paths: [
        // Row 1 (orange container line)
        {
          type: 'rect',
          x: 375,
          y: 240,
          width: 105,
          height: 24,
          rx: 2,
          customFill: 'rgba(234, 88, 12, 0.65)',
          ribs: [
            { x1: 400, y1: 240, x2: 400, y2: 264 },
            { x1: 425, y1: 240, x2: 425, y2: 264 },
            { x1: 450, y1: 240, x2: 450, y2: 264 },
          ],
        },
        // Row 2 (parallel container line)
        {
          type: 'rect',
          x: 405,
          y: 275,
          width: 110,
          height: 24,
          rx: 2,
          customFill: 'rgba(234, 88, 12, 0.65)',
          ribs: [
            { x1: 430, y1: 275, x2: 430, y2: 299 },
            { x1: 455, y1: 275, x2: 455, y2: 299 },
            { x1: 480, y1: 275, x2: 480, y2: 299 },
          ],
        },
      ],
      defaultTelemetry: {
        Temperature: 21.0,
        Occupancy: 16,
        Energy_Consumption: 88,
      },
    },

    // 13. HORIZONTAL SKID FUEL TANKS (White cylindrical fuel tanks in cradles, Photo 1 & 4)
    {
      id: 'maitri_fuel',
      name: 'Liquid Fuel Storage Farm (ATF / Arctic HSD)',
      shortLabel: 'FUEL STORAGE',
      type: 'fuel',
      category: 'Power & Utilities',
      blueprintRef: 'Photo 1 & 4 (Horizontal White Skid Cylinders)',
      description: 'Dual batteries of horizontal double-walled cylindrical tanks mounted on heavy steel transport skids for Arctic Grade Diesel and Aviation fuel.',
      center: [230, 810],
      area: '280 m²',
      paths: [
        {
          type: 'polygon',
          points: '120,770 330,770 330,860 120,860',
          isEnclosure: true,
        },
      ],
      // 8 White horizontal capsule tanks in 2 rows on skids
      skidTanks: [
        { x: 140, y: 785, width: 38, height: 18 },
        { x: 185, y: 785, width: 38, height: 18 },
        { x: 230, y: 785, width: 38, height: 18 },
        { x: 275, y: 785, width: 38, height: 18 },
        { x: 140, y: 820, width: 38, height: 18 },
        { x: 185, y: 820, width: 38, height: 18 },
        { x: 230, y: 820, width: 38, height: 18 },
        { x: 275, y: 820, width: 38, height: 18 },
      ],
      defaultTelemetry: {
        Temperature: -4.5,
        Fuel_Level: 76.0,
      },
    },

    // 14. SUMMER CAMP TRANSIT BLUE CONTAINERS (Along Lake Shoreline, Photo 1 & 2)
    {
      id: 'maitri_summer_camp',
      name: 'Summer Expedition Transit Camp (Blue Line)',
      shortLabel: 'SUMMER CAMP',
      type: 'residential',
      category: 'Expedition Support',
      colorStyle: 'blue',
      blueprintRef: 'Photo 1 & 2 (Blue Container Line Along Shore)',
      description: 'Single continuous row of blue modular accommodation containers facing the pristine shore of Lake Priyadarshini for summer expeditioners.',
      center: [920, 250],
      area: '280 m²',
      paths: [
        // 8 Blue modular units in a neat row
        { type: 'rect', x: 840, y: 240, width: 22, height: 18, rx: 1, customFill: '#2563EB' },
        { type: 'rect', x: 865, y: 240, width: 22, height: 18, rx: 1, customFill: '#2563EB' },
        { type: 'rect', x: 890, y: 240, width: 22, height: 18, rx: 1, customFill: '#2563EB' },
        { type: 'rect', x: 915, y: 240, width: 22, height: 18, rx: 1, customFill: '#2563EB' },
        { type: 'rect', x: 940, y: 240, width: 22, height: 18, rx: 1, customFill: '#2563EB' },
        { type: 'rect', x: 965, y: 240, width: 22, height: 18, rx: 1, customFill: '#2563EB' },
        { type: 'rect', x: 990, y: 240, width: 22, height: 18, rx: 1, customFill: '#2563EB' },
      ],
      defaultTelemetry: {
        Temperature: 18.5,
        Occupancy: 28,
        Energy_Consumption: 54,
      },
    },

    // 15. ALL-WEATHER HELIPAD (Photo 1 & Blueprint Fig 4-C)
    {
      id: 'maitri_helipad',
      name: 'All-Weather Polar Helipad',
      shortLabel: 'HELIPAD',
      type: 'helipad',
      category: 'Aviation Support',
      blueprintRef: 'Photo 1 & Blueprint Fig 4-C',
      description: 'Hardpack gravel helicopter apron equipped with wind direction pennant, boundary markers, and staging space.',
      center: [880, 720],
      area: '160 m²',
      paths: [
        {
          type: 'circle',
          cx: 880,
          cy: 720,
          r: 34,
          customFill: 'rgba(30, 41, 59, 0.6)',
        },
      ],
      defaultTelemetry: {
        Temperature: -34.0,
        Wind_Speed: 42.0,
        Solar_Radiation: 160,
      },
    },

    // 16. LONG-TERM STORAGE & CARGO YARD (Flanking Helipad, Blueprint & Photo 1)
    {
      id: 'maitri_storage',
      name: 'Long-Term Storage Modules & Logistics Yard',
      shortLabel: 'STORAGE MODULES',
      type: 'storage',
      category: 'Logistics & Cargo',
      colorStyle: 'orange',
      blueprintRef: 'Photo 1 & Blueprint 4-C (Containers Near Helipad)',
      description: 'Secure ISO container storage modules containing emergency survival gear, vehicle replacement engines, and scientific spare caches.',
      center: [1020, 720],
      area: '310 m²',
      paths: [
        { type: 'rect', x: 950, y: 660, width: 30, height: 120, rx: 2, customFill: 'rgba(234, 88, 12, 0.65)' },
        { type: 'rect', x: 1040, y: 660, width: 30, height: 120, rx: 2, customFill: 'rgba(234, 88, 12, 0.65)' },
      ],
      defaultTelemetry: {
        Temperature: -14.0,
        Energy_Consumption: 24,
      },
    },

    // 17. AUTOMATIC WEATHER STATION (AWS-Maitri Synoptic Tower)
    {
      id: 'maitri_weather',
      name: 'Automatic Weather Station (AWS-Maitri)',
      shortLabel: 'WEATHER STATION',
      type: 'weather',
      category: 'Meteorology',
      blueprintRef: '10m Synoptic Instrument Mast',
      description: 'Continuous polar meteorology mast capturing katabatic gust speed, barometric pressure trend, and temperature.',
      center: [1160, 240],
      area: '40 m²',
      paths: [
        {
          type: 'polygon',
          points: '1145,225 1175,225 1160,265',
          customFill: 'rgba(56, 189, 248, 0.4)',
        },
      ],
      defaultTelemetry: {
        Temperature: -34.2,
        Wind_Speed: 42.5,
        Solar_Radiation: 142,
      },
    },
  ],

  // Real-world sensor markers placed at key physical assets
  sensors: [
    { id: 's_temp_hub', type: 'Temperature', x: 750, y: 440, assetId: 'maitri_main_station' },
    { id: 's_lounge_temp', type: 'Temperature', x: 810, y: 535, assetId: 'maitri_observation_lounge' },
    { id: 's_gen_temp', type: 'Temperature', x: 520, y: 570, assetId: 'maitri_generator' },
    { id: 's_gen_load', type: 'Power', x: 545, y: 595, assetId: 'maitri_generator' },
    { id: 's_fuel_lvl', type: 'Fuel', x: 230, y: 805, assetId: 'maitri_fuel' },
    { id: 's_water_temp', type: 'Temperature', x: 380, y: 430, assetId: 'maitri_water' },
    { id: 's_wind_aws', type: 'Wind', x: 1160, y: 240, assetId: 'maitri_weather' },
    { id: 's_sat_wind', type: 'Wind', x: 480, y: 480, assetId: 'maitri_satellite' },
    { id: 's_workshop_pwr', type: 'Power', x: 320, y: 310, assetId: 'maitri_workshop' },
  ],
};
