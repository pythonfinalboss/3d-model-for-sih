/**
 * BHARATI RESEARCH STATION - 2D SITE PLAN GEOMETRY & ASSETS
 * Location: Larsemann Hills, Princess Elizabeth Land, East Antarctica
 * Commissioned: 2012 (India's 3rd and state-of-the-art Antarctic Research Station)
 * Architecture: Aerodynamic elevated containerized monolith on hydraulic stilts
 * overlooking Prydz Bay with peripheral energy, aviation, and satellite facilities.
 */

export const BHARATI_LAYOUT = {
  stationId: 'bharati',
  name: 'Bharati Research Station',
  shortName: 'Bharati',
  commissioned: 2012,
  location: 'Larsemann Hills, Princess Elizabeth Land',
  coordinates: '69°24′28″S 76°11′14″E',
  elevation: '35 m ASL',
  viewBox: '0 0 1400 950',
  center: [700, 480],

  // Coastal promontory contours, roads, conduits, and pipelines
  infrastructure: {
    roads: [
      // Perimeter access road from Coastal Sea-Ice Ramp to Helipad & Main Complex
      'M 200,780 L 380,720 L 580,640 L 720,540 L 920,440 L 1120,440 L 1220,380',
      // Spur to Fuel Depot and Cogeneration Plant
      'M 580,640 L 520,500 L 440,460',
      // Track to ISRO Radome on western promontory
      'M 440,460 L 340,380 L 260,340',
      // Track to Emergency Shelter
      'M 720,540 L 800,680 L 900,720',
      // Spur to Helipad
      'M 920,440 L 980,320 L 1060,260'
    ],
    pipelines: [
      // Cogeneration thermal district heating loop from CHP to Main Complex
      {
        id: 'bharati_heat_loop',
        type: 'heat',
        name: 'Cogeneration Thermal District Loop',
        d: 'M 480,480 L 580,480 L 640,440 L 680,440',
        stroke: '#F97316',
        width: 3,
        dashed: true
      },
      // Fuel transfer manifold from Container Depot to CHP
      {
        id: 'bharati_fuel_line',
        type: 'fuel',
        name: 'Insulated Fuel Manifold',
        d: 'M 380,560 L 440,560 L 460,520',
        stroke: '#EAB308',
        width: 2.5,
        dashed: true
      }
    ],
    powerLines: [
      // Underground 415V bus connecting BESS, CHP, Main Monolith, and ISRO Radome
      'M 480,500 L 580,500 L 700,480',
      'M 480,500 L 340,440 L 260,360',
      'M 700,480 L 880,520 L 980,520',
      'M 700,480 L 980,320'
    ],
    contours: [
      // Coastal rocky promontory ridges overlooking Prydz Bay
      'M 40,240 Q 320,180 640,210 T 1120,190 T 1360,220',
      'M 60,440 Q 380,390 700,420 T 1160,380 T 1360,420',
      'M 80,640 Q 420,580 760,610 T 1180,590 T 1360,660',
      'M 120,840 Q 460,800 820,810 T 1200,790 T 1360,840'
    ]
  },

  // 13 Independently selectable & interactive assets
  buildings: [
    // 1. MAIN RESEARCH COMPLEX (AERODYNAMIC MONOLITH)
    {
      id: 'bharati_main_complex',
      name: 'Main Research Complex (Aerodynamic Monolith)',
      shortLabel: 'MAIN MONOLITH',
      type: 'building',
      category: 'Command & Research',
      blueprintRef: 'Modular 3-Tier Elevated Monolith',
      description: 'Futuristic 3-story monolith on hydraulic stilts built from 134 ISO containers with aerodynamic aluminum skin and panoramic observation prow.',
      center: [720, 420],
      area: '2,160 m²',
      paths: [
        // Aerodynamic faceted hexagon/prow profile
        {
          type: 'polygon',
          points: '640,360 800,360 840,420 800,480 640,480 600,420',
          roofDetails: [
            'M 640,360 L 800,480',
            'M 800,360 L 640,480',
            'M 600,420 L 840,420'
          ]
        },
        // Observation deck prow glazed gallery
        {
          type: 'polygon',
          points: '780,380 830,420 780,460 760,460 795,420 760,380'
        }
      ],
      defaultTelemetry: {
        Temperature: 22.0,
        Wind_Speed: 36,
        Solar_Radiation: 198,
        Occupancy: 38,
        Battery_Level: 88,
        Generator_Load: 68,
        Fuel_Level: 80,
        Energy_Consumption: 210
      }
    },

    // 2. SCIENTIFIC RESEARCH LABORATORIES
    {
      id: 'bharati_lab',
      name: 'Marine Biology & Glaciology Laboratory Suite',
      shortLabel: 'LABORATORIES',
      type: 'laboratory',
      category: 'Scientific Research',
      blueprintRef: 'Monolith Upper Deck Lab Suite',
      description: 'Specialized laboratories with ultra-clean rooms, seawater aquaria, paleoclimate ice-core cold vault (-20°C), and spectrophotometers.',
      center: [680, 390],
      area: '420 m²',
      paths: [
        {
          type: 'polygon',
          points: '630,370 730,370 730,410 630,410'
        }
      ],
      defaultTelemetry: {
        Temperature: 21.8,
        Occupancy: 12,
        Energy_Consumption: 98,
        Solar_Radiation: 198
      }
    },

    // 3. RESIDENTIAL CABINS & MESS
    {
      id: 'bharati_residential',
      name: 'Residential Habitat & Expedition Cabins',
      shortLabel: 'HABITAT QUARTERS',
      type: 'residential',
      category: 'Living & Accommodation',
      blueprintRef: 'Monolith Level 2 Living Modules',
      description: '24 comfortable sound-insulated single/double cabins, galley commissary, sauna, gymnasium, and trauma hospital.',
      center: [680, 450],
      area: '540 m²',
      paths: [
        {
          type: 'polygon',
          points: '630,430 730,430 730,470 630,470'
        }
      ],
      defaultTelemetry: {
        Temperature: 22.4,
        Occupancy: 26,
        Energy_Consumption: 112
      }
    },

    // 4. POWER GENERATION (CHP COGENERATION)
    {
      id: 'bharati_cogen',
      name: 'Combined Heat & Power (CHP) Cogeneration Unit',
      shortLabel: 'CHP COGENERATION',
      type: 'generator',
      category: 'Power & Utilities',
      blueprintRef: 'Energy Station Plant Block',
      description: 'Three Scania DI16 diesel cogeneration units generating electrical power while capturing 100% of jacket heat for hydronic base heating.',
      center: [470, 490],
      area: '240 m²',
      paths: [
        {
          type: 'polygon',
          points: '420,450 520,450 520,530 420,530',
          roofDetails: [
            'M 470,450 L 470,530',
            'M 420,490 L 520,490'
          ]
        }
      ],
      defaultTelemetry: {
        Temperature: 88.2,
        Generator_Load: 66.5,
        Fuel_Level: 82.0,
        Energy_Consumption: 520,
        Battery_Level: 90.0
      }
    },

    // 5. FUEL STORAGE DEPOT
    {
      id: 'bharati_fuel',
      name: 'Double-Walled ISO Fuel Tank Depot',
      shortLabel: 'FUEL DEPOT',
      type: 'fuel',
      category: 'Power & Utilities',
      blueprintRef: 'Containerized Liquid Hydrocarbon Depot',
      description: '300,000-liter insulated container tank farm with leak-detection sensors and automated fuel transfer pumping.',
      center: [360, 570],
      area: '380 m²',
      paths: [
        {
          type: 'polygon',
          points: '300,520 420,520 420,620 300,620',
          isEnclosure: true
        }
      ],
      tanks: [
        { cx: 330, cy: 550, r: 14 },
        { cx: 365, cy: 550, r: 14 },
        { cx: 400, cy: 550, r: 14 },
        { cx: 330, cy: 590, r: 14 },
        { cx: 365, cy: 590, r: 14 },
        { cx: 400, cy: 590, r: 14 }
      ],
      defaultTelemetry: {
        Temperature: -2.5,
        Fuel_Level: 84.0
      }
    },

    // 6. BATTERY / ENERGY STORAGE SYSTEM (BESS)
    {
      id: 'bharati_battery',
      name: 'Battery Energy Storage System (BESS 500 kWh)',
      shortLabel: 'BATTERY BESS',
      type: 'battery',
      category: 'Power & Utilities',
      blueprintRef: 'Clean Power Lithium Buffer Bank',
      description: 'Containerized lithium iron phosphate (LiFePO4) battery bank buffering wind energy and smoothing generator grid loads.',
      center: [470, 570],
      area: '110 m²',
      paths: [
        {
          type: 'polygon',
          points: '430,550 510,550 510,590 430,590',
          roofDetails: ['M 470,550 L 470,590']
        }
      ],
      defaultTelemetry: {
        Battery_Level: 91.5,
        Generator_Load: 68.0,
        Energy_Consumption: 42,
        Fuel_Level: 82.0
      }
    },

    // 7. SATELLITE COMMUNICATION (ISRO RADOME)
    {
      id: 'bharati_satellite',
      name: 'ISRO Deep Space Ground Station & Radome',
      shortLabel: 'ISRO RADOME',
      type: 'satellite',
      category: 'Communications',
      blueprintRef: '7.5m Space Tracking Radome',
      description: 'Geodesic radome housing a 7.5-meter steerable parabolic antenna providing direct high-throughput telemetry to NRSC/ISRO Hyderabad.',
      center: [240, 330],
      area: '160 m²',
      paths: [
        // Geodesic sphere circle
        {
          type: 'circle',
          cx: 240,
          cy: 330,
          r: 32
        },
        // Geodesic facet cross lines
        {
          type: 'path',
          d: 'M 215,315 L 265,345 M 215,345 L 265,315 M 240,298 L 240,362'
        },
        // Equipment shelter
        {
          type: 'polygon',
          points: '200,350 230,350 230,380 200,380'
        }
      ],
      defaultTelemetry: {
        Temperature: -16.0,
        Wind_Speed: 34.0,
        Solar_Radiation: 195,
        Energy_Consumption: 62
      }
    },

    // 8. WEATHER MONITORING
    {
      id: 'bharati_weather',
      name: 'Synoptic Weather Mast (AWS-Bharati)',
      shortLabel: 'AWS WEATHER',
      type: 'weather',
      category: 'Meteorology',
      blueprintRef: 'Coastal Meteorological Tower',
      description: 'Automated polar meteorology mast delivering real-time synoptic reports, katabatic velocity, and UV albedo index.',
      center: [1160, 240],
      area: '50 m²',
      paths: [
        {
          type: 'polygon',
          points: '1145,220 1175,220 1160,265'
        }
      ],
      defaultTelemetry: {
        Temperature: -28.6,
        Wind_Speed: 36.8,
        Solar_Radiation: 198
      }
    },

    // 9. WORKSHOP & MECHANICAL REPAIR
    {
      id: 'bharati_workshop',
      name: 'Mechanical & Vehicle Workshop Bay',
      shortLabel: 'WORKSHOP',
      type: 'workshop',
      category: 'Maintenance & Fleet',
      blueprintRef: 'Maintenance Bay',
      description: 'Heated garage bay with heavy hoist cranes for maintaining tracked Hägglunds rovers, snowcats, and cranes.',
      center: [600, 680],
      area: '260 m²',
      paths: [
        {
          type: 'polygon',
          points: '540,640 660,640 660,720 540,720',
          roofDetails: ['M 600,640 L 600,720']
        }
      ],
      defaultTelemetry: {
        Temperature: 19.8,
        Occupancy: 4,
        Energy_Consumption: 84
      }
    },

    // 10. LOGISTICS / CARGO STORAGE
    {
      id: 'bharati_logistics',
      name: 'Logistics Depot & Polar Sea Container Yard',
      shortLabel: 'LOGISTICS YARD',
      type: 'storage',
      category: 'Logistics & Cargo',
      blueprintRef: 'ISO Cargo Yard',
      description: 'Dedicated cargo breakbulk platform accommodating shipping containers delivered during annual resupply voyages.',
      center: [940, 520],
      area: '420 m²',
      paths: [
        { type: 'rect', x: 880, y: 480, width: 45, height: 25 },
        { type: 'rect', x: 935, y: 480, width: 45, height: 25 },
        { type: 'rect', x: 880, y: 515, width: 45, height: 25 },
        { type: 'rect', x: 935, y: 515, width: 45, height: 25 },
        { type: 'rect', x: 880, y: 550, width: 45, height: 25 },
        { type: 'rect', x: 935, y: 550, width: 45, height: 25 }
      ],
      defaultTelemetry: {
        Temperature: -18.0,
        Energy_Consumption: 30
      }
    },

    // 11. VEHICLE AREA (TRACKED FLEET)
    {
      id: 'bharati_vehicles',
      name: 'Hägglunds BV206 & Rover Fleet Depot',
      shortLabel: 'VEHICLE DEPOT',
      type: 'workshop',
      category: 'Logistics & Fleet',
      blueprintRef: 'Tracked Vehicle Staging',
      description: 'Polar vehicle staging pad for Hägglunds BV206 articulated carriers, Kassbohrer PistenBully, and terrain cranes.',
      center: [780, 660],
      area: '310 m²',
      paths: [
        {
          type: 'polygon',
          points: '720,620 840,620 840,700 720,700',
          isStagingPad: true
        }
      ],
      vehicles: [
        { x: 740, y: 640, label: 'BV-01' },
        { x: 780, y: 640, label: 'BV-02' },
        { x: 820, y: 640, label: 'PB-300' },
        { x: 760, y: 670, label: 'CRANE' }
      ],
      defaultTelemetry: {
        Temperature: -28.0,
        Occupancy: 2,
        Energy_Consumption: 26,
        Fuel_Level: 88.0
      }
    },

    // 12. EMERGENCY RETREAT INFRASTRUCTURE
    {
      id: 'bharati_emergency',
      name: 'Autonomous Emergency Life-Support Shelter',
      shortLabel: 'EMERGENCY SHELTER',
      type: 'residential',
      category: 'Emergency Support',
      blueprintRef: 'Remote Life-Support Pod',
      description: 'Self-sufficient survival pod equipped with independent battery bank, freeze-dried rations, and satellite radio for 30-day retreat.',
      center: [920, 720],
      area: '90 m²',
      paths: [
        {
          type: 'polygon',
          points: '885,695 955,695 955,745 885,745'
        }
      ],
      defaultTelemetry: {
        Temperature: 18.0,
        Occupancy: 0,
        Energy_Consumption: 14,
        Battery_Level: 98.0
      }
    },

    // 13. ALL-WEATHER HELIPAD
    {
      id: 'bharati_helipad',
      name: 'Coastal Plateau Heavy Helipad',
      shortLabel: 'HELIPAD',
      type: 'helipad',
      category: 'Aviation Support',
      blueprintRef: 'PAPI Illuminated Helipad',
      description: 'Concrete landing apron situated on high rocky promontory with perimeter heating and PAPI visual slope indicators.',
      center: [1060, 280],
      area: '160 m²',
      paths: [
        {
          type: 'circle',
          cx: 1060,
          cy: 280,
          r: 36
        }
      ],
      defaultTelemetry: {
        Temperature: -28.0,
        Wind_Speed: 36.0,
        Solar_Radiation: 198
      }
    }
  ],

  sensors: [
    { id: 'sb_monolith_temp', type: 'Temperature', x: 720, y: 410, assetId: 'bharati_main_complex' },
    { id: 'sb_cogen_temp', type: 'Temperature', x: 470, y: 480, assetId: 'bharati_cogen' },
    { id: 'sb_cogen_load', type: 'Power', x: 495, y: 505, assetId: 'bharati_cogen' },
    { id: 'sb_fuel_lvl', type: 'Fuel', x: 360, y: 560, assetId: 'bharati_fuel' },
    { id: 'sb_bess_lvl', type: 'Power', x: 470, y: 570, assetId: 'bharati_battery' },
    { id: 'sb_aws_wind', type: 'Wind', x: 1160, y: 240, assetId: 'bharati_weather' },
    { id: 'sb_radome_wind', type: 'Wind', x: 240, y: 330, assetId: 'bharati_satellite' }
  ]
};
