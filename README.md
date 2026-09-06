# 🧊 3D Digital Twin of Maitri & Bharati Antarctic Research Stations

An interactive, real-time **3D Digital Twin Command Center** for India’s Antarctic research stations — **Maitri** (Schirmacher Oasis) and **Bharati** (Larsemann Hills).

Built with **React**, **Three.js**, **React Three Fiber**, **Drei**, **Tailwind CSS**, and **Recharts**.

---

## 🌟 Key Features

### 1. 🌐 Interactive 3D Digital Twin View
- **Maitri Research Station**:
  - Two-tier containerized living & research quarters on steel stilts with Indian tricolor motif and observation cupola.
  - Atmospheric & Geomagnetic Laboratory suite with rooftop sensors and magnetometer dome.
  - Primary (DG-01) and Standby (DG-02) Caterpillar Diesel Generators with dynamic physical vibration and exhaust thermal shimmer.
  - Lake Priyadarshini water pump house with elevated heated pipeline connecting to main complex.
  - Insulated cylindrical fuel tank farms with live capacity levels.
  - Satellite communication & ground link tracking radome with motorized antenna azimuth sweep.
  - Automatic Weather Station (AWS-Maitri) synoptic mast.
  - Polar wind turbines and bifacial albedo solar array.
  - PistenBully snowcats and tracked convoy garage depot.
  - Emergency retreat survival shelter.
- **Bharati Research Station**:
  - Aerodynamic titanium/aluminum elevated monolith on hydraulic stilts with wrap-around panoramic observation gallery.
  - Specialized Oceanography & Marine Biology laboratories.
  - Paleoclimate Ice-Core cold storage vault (-20°C).
  - Scania Cogeneration Combined Heat & Power (CHP 1 & 2) units.
  - Double-walled ISO container fuel depot with continuous level telemetry.
  - ISRO Deep Space Ground Station & full-motion 7.5m tracking satellite radome.
  - Synoptic meteorological tower.
  - All-weather heavy helipad with PAPI perimeter guidance lighting.
  - Direct-drive clean energy micro-wind array.
  - Hägglunds BV206 all-terrain tracked rover fleet bay.
  - Autonomous emergency life-support pod.
- **Combined Antarctic Regional View**:
  - Displays both stations with distance baseline vector (~3,000 km), animated inter-station microwave/satellite link beam, and dual telemetry streams.

---

### 2. ⚡ Live Data-Driven 3D Reactivity
The 3D assets automatically react to backend telemetry changes:
- **Healthy**: `#10B981` (Green status pulse, normal shaders)
- **Warning**: `#F59E0B` (Amber oscillation, floating warning beacon)
- **Critical**: `#EF4444` (Crimson strobe beacon, hazard perimeter aura, alarm chime)
- **Offline**: `#6B7280` (Muted slate gray)

- **Hover Interactions**: Highlights mesh boundaries and displays a 3D floating billboard HUD tag showing asset name, status, and primary metric.
- **Click Interactions**: Smoothly lerps and focuses the 3D camera onto the clicked asset and opens the **Asset Detail Telemetry Panel**.

---

### 3. 📊 Mission Control Command Center Panels
- **Top Header HUD**: Live weather ticker (`-34.2°C`, `42.5 km/h Wind`, `Visibility 8.2 km`), total station power (`1.24 MW`), connected sensors (`148/152 Online`), active alerts badge, camera preset switcher, and live heartbeat sync pulse.
- **Left Sidebar**: Station navigation, dynamic station health scores (`Maitri 87%`, `Bharati 94%`), and category filters.
- **Asset Detail Telemetry Panel**: Slide-out drawer with load %, temperature, health index %, power output / fuel level, Recharts historical sparklines, sub-system diagnostics, and manual action triggers.
- **Energy Monitoring**: Multi-tier animated **Energy Flow Diagram** (`Generation Sources` → `Storage Buffers` → `Main 415V Bus` → `Subsystems & Habitats`).
- **Environment & Meteorology**: Outdoor vs Habitat indoor temperature delta, katabatic wind direction compass, barometric pressure curves, snow drift accumulation rate, solar irradiance flux, and Aurora Australis ionospheric status.
- **Live Alerts Feed**: Active alarms with severity badges and **"Focus 3D View"** buttons that automatically rotate and zoom the 3D camera to the affected asset.
- **Equipment Fleet**: Searchable and filterable table of all 24+ assets across both stations with 1-click 3D locator shortcuts.
- **Scenario Injector / Simulator**: Interactive modal allowing operators to inject real-time fault scenarios (*Generator 01 Overheat*, *Fuel Depot Low Capacity*, *Polar Blizzard Category 3*, *Aurora Geomagnetic Storm*, *Nominal Operations*).

---

## 🛠️ Project Structure

```
antarctic-digital-twin/
├── public/
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── CameraController.jsx     # Smooth camera lerp, orbit controls, preset views & asset focus
│   │   │   ├── Terrain.jsx              # Stylized Antarctic snow & ice terrain with Lake Priyadarshini
│   │   │   ├── MaitriStation3D.jsx      # Low-poly stylized 3D model for Maitri (modular blocks on stilts, pump house, etc.)
│   │   │   ├── BharatiStation3D.jsx     # Futuristic elevated aerodynamic 3D model for Bharati
│   │   │   ├── CombinedView3D.jsx       # Regional Antarctic map showing both stations and telemetry link
│   │   │   ├── InteractiveAsset3D.jsx   # Generic 3D asset wrapper with dynamic status colors & 3D badges
│   │   │   ├── WindTurbine3D.jsx        # Animated spinning turbine reacting to live wind speed
│   │   │   ├── SatelliteRadome3D.jsx    # Tracking satellite dish with azimuth animation
│   │   │   ├── Generator3D.jsx          # Generator model with vibration & heat shimmer effects
│   │   │   ├── SnowParticles.jsx        # Atmospheric blizzard/snow particle system
│   │   │   └── SceneContainer.jsx       # Canvas, lighting, Aurora Australis, Post-processing/Fog
│   │   ├── layout/
│   │   │   ├── TopHeader.jsx            # Antarctic Network HUD ticker, weather, power, sensors, sync time
│   │   │   └── LeftSidebar.jsx          # Navigation tabs & dynamic station health scores
│   │   └── panels/
│   │       ├── AssetDetailPanel.jsx     # Slide-out asset telemetry HUD with gauges, diagnostics & Recharts trend
│   │       ├── AlertsPanel.jsx          # Live warning/critical alarm feed with 1-click 3D camera jump
│   │       ├── EnvironmentPanel.jsx     # Antarctic weather conditions, wind compass, barometric curves
│   │       ├── EnergyPanel.jsx          # Power generation/consumption breakdown + animated energy flow diagram
│   │       ├── FleetTablePanel.jsx      # Complete searchable asset inventory with live health & status
│   │       ├── OverviewSummary.jsx      # Macro station health metrics & mission uptime
│   │       ├── AnalyticsPanel.jsx       # Scientific research telemetry & energy distribution
│   │       └── SimulatorModal.jsx       # Scenario injector (Blizzard, Generator Overheat, Fuel Leak, Normal Ops)
│   ├── context/
│   │   └── StationDataContext.jsx       # Central state management & real-time simulation loop
│   ├── data/
│   │   └── mockStationData.js           # Comprehensive dataset for all Maitri & Bharati assets & specs
│   ├── utils/
│   │   ├── stationHealth.js             # Dynamic weighted health score calculator
│   │   └── audioUtils.js                # Web Audio API sound synthesizer
│   ├── index.css                        # Mission control dark theme, glow utilities, custom scrollbars
│   ├── main.jsx                         # Application entrypoint
│   └── App.jsx                          # Main Command Center container
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Navigate to the project directory
cd antarctic-digital-twin

# Install dependencies
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
```

---

## 📜 License
Developed for India's Antarctic Scientific Research Programme (NCPOR / Ministry of Earth Sciences).
#   3 d - m o d e l - f o r - s i h  
 "# 3d-model-for-sih" 
