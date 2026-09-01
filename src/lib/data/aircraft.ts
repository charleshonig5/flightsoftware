export type StatusLevel = "danger" | "warning" | "success";

export interface Meter {
  label: string;
  value: string;
  unit: string;
  meta: string;
  /** 0–100, drives the gauge arc and its color */
  percent: number;
}

export interface MaintenanceItem {
  category: string;
  title: string;
  interval: string;
  lastDone: string;
  status: { level: StatusLevel; label: string };
}

export interface MaintenanceLog {
  title: string;
  /** ISO date, rendered as M/D/YYYY */
  date: string;
  type: "Maintenance" | "Inspection" | "Equipment";
  component: string;
  /** Aircraft total time at the work, rendered as "TT n,nnn.n" */
  totalTime: number;
  mechanic: string;
}

export interface AircraftSpec {
  make: string;
  model: string;
  year: string;
  serialNumber: string;
  category: string;
}

export interface Aircraft {
  tailNumber: string;
  model: string;
  /** Optional alert badge shown next to the tail number */
  badge?: string;
  /** Header photo (public path, CC0-licensed imagery) */
  photo?: string;
  /** Registry details shown on the aircraft page header */
  spec: AircraftSpec;
  meters: Meter[];
  /** Completed work history (Maintenance Logs tab), newest first */
  logs: MaintenanceLog[];
  maintenance: {
    overdue: number;
    upcoming: number;
    current: number;
    items: MaintenanceItem[];
  };
}

export interface FleetKpi {
  icon: "aircraft" | "overdue" | "upcoming" | "current";
  label: string;
  value: string;
  unit: string;
  /** Tooltip copy behind the card's info icon */
  info: string;
  status: { level: StatusLevel; label: string };
}

export function getAircraft(tailNumber: string): Aircraft | undefined {
  return fleet.find((aircraft) => aircraft.tailNumber === tailNumber);
}

/** Counts derive from the items so schedule numbers can never drift.
 *  Items sort by urgency (overdue → upcoming → current, stable within groups)
 *  so the dashboard's 3-row preview always surfaces the most critical work. */
const SEVERITY: Record<StatusLevel, number> = { danger: 0, warning: 1, success: 2 };
const withCounts = (items: MaintenanceItem[]) => ({
  overdue: items.filter((i) => i.status.level === "danger").length,
  upcoming: items.filter((i) => i.status.level === "warning").length,
  current: items.filter((i) => i.status.level === "success").length,
  items: [...items].sort((a, b) => SEVERITY[a.status.level] - SEVERITY[b.status.level]),
});

export const currentUser = { name: "Charles Honig", email: "charles@maggneto.com" };

export const fleet: Aircraft[] = [
  {
    tailNumber: "N747CN",
    model: "Boeing 747-400 (1998)",
    photo: "/aircraft/n747cn.jpg",
    badge: "Needs Attention",
    spec: { make: "Boeing", model: "747-400", year: "1998", serialNumber: "29137", category: "Jet" },
    meters: [
      { label: "Hobbs", value: "51,270.4", unit: "hrs", meta: "Never updated", percent: 75 },
      { label: "Tach 1 (L)", value: "48,785.3", unit: "hrs", meta: "Updated 20d ago", percent: 25 },
      { label: "Tach 2 (L)", value: "42,625.3", unit: "hrs", meta: "Updated 20d ago", percent: 75 },
      { label: "Tach 3", value: "41,735.1", unit: "hrs", meta: "Updated 20d ago", percent: 100 },
      { label: "Tach 4", value: "49,551.3", unit: "hrs", meta: "Updated 20d ago", percent: 25 },
      { label: "Oil 1 (L)", value: ".19", unit: "qt/hr", meta: "Next change in 157 hrs", percent: 75 },
      { label: "Oil 2 (R)", value: ".20", unit: "qt/hr", meta: "Next change in 132 hrs", percent: 100 },
      { label: "Oil 3", value: ".21", unit: "qt/hr", meta: "Next change in 121 hrs", percent: 25 },
      { label: "Oil 4", value: ".22", unit: "qt/hr", meta: "Next change in 184 hrs", percent: 75 },
    ],
    logs: [
      { title: "Nav Database Currency Update", date: "2026-06-27", type: "Equipment", component: "Avionics", totalTime: 51268.1, mechanic: "Skyline Avionics Group" },
      { title: "Brake Pads and Tire Inspection", date: "2026-06-19", type: "Maintenance", component: "Landing Gear", totalTime: 51265.8, mechanic: "Northwest Aviation Services" },
      { title: "A-Check Package", date: "2026-06-02", type: "Inspection", component: "Airframe", totalTime: 51239.4, mechanic: "Delta TechOps" },
      { title: "Oil & Filter Change — All Engines", date: "2026-05-21", type: "Maintenance", component: "Engine", totalTime: 51201.7, mechanic: "Delta TechOps" },
      { title: "Hydraulic Pump Replacement (Sys 2)", date: "2026-04-30", type: "Maintenance", component: "Hydraulics", totalTime: 51144.2, mechanic: "AAR Aircraft Services" },
      { title: "Wing Gear Tire Replacement", date: "2026-04-12", type: "Maintenance", component: "Landing Gear", totalTime: 51089.5, mechanic: "Northwest Aviation Services" },
      { title: "ELT Battery Replacement", date: "2026-03-28", type: "Equipment", component: "Emergency Systems", totalTime: 51033.0, mechanic: "Skyline Avionics Group" },
      { title: "Cabin Pressure Controller Check", date: "2026-03-09", type: "Inspection", component: "Environmental", totalTime: 50978.6, mechanic: "Delta TechOps" },
      { title: "Fuel Quantity Indication Test", date: "2026-02-17", type: "Inspection", component: "Fuel System", totalTime: 50912.3, mechanic: "AAR Aircraft Services" },
      { title: "IRU 2 Replacement", date: "2026-01-06", type: "Equipment", component: "Avionics", totalTime: 50820.4, mechanic: "Skyline Avionics Group" },
      { title: "Windshield Wiper Motor Replacement", date: "2025-12-15", type: "Maintenance", component: "Environmental", totalTime: 50769.8, mechanic: "AAR Aircraft Services" },
    ],
    maintenance: withCounts([
      {
        category: "Scheduled Maintenance",
        title: "Left Body Gear Brake Pack Replacement",
        interval: "Every 35 hours",
        lastDone: "Last Jun 18, 2026",
        status: { level: "danger", label: "Overdue by 4.5 hours" },
      },
      {
        category: "Equipment",
        title: "Nav Database Currency Check",
        interval: "Every 1 month",
        lastDone: "Last Jun 27, 2026",
        status: { level: "warning", label: "Due in 1 week" },
      },
      {
        category: "Scheduled Maintenance",
        title: "A-Check Package",
        interval: "Every 600 hours",
        lastDone: "Last Jun 2, 2026",
        status: { level: "success", label: "531 hours remaining" },
      },
      {
        category: "Engine",
        title: "Engine 2 Borescope Inspection",
        interval: "Every 400 hours",
        lastDone: "Last May 12, 2026",
        status: { level: "success", label: "212 hours remaining" },
      },
      {
        category: "Landing Gear",
        title: "Wheel & Brake NDT",
        interval: "Every 200 hours",
        lastDone: "Last Jun 19, 2026",
        status: { level: "success", label: "165 hours remaining" },
      },
      {
        category: "APU",
        title: "APU Oil Change",
        interval: "Every 300 hours",
        lastDone: "Last Apr 22, 2026",
        status: { level: "success", label: "118 hours remaining" },
      },
      {
        category: "Emergency Systems",
        title: "Fire Bottle Cartridge Check",
        interval: "Every 1 year",
        lastDone: "Last Nov 8, 2025",
        status: { level: "success", label: "Due in 3 months" },
      },
      {
        category: "Avionics",
        title: "Transponder Certification",
        interval: "Every 2 years",
        lastDone: "Last Sep 30, 2024",
        status: { level: "success", label: "Due in 3 months" },
      },
      {
        category: "Instruments",
        title: "Pitot-Static System Check",
        interval: "Every 2 years",
        lastDone: "Last Sep 30, 2024",
        status: { level: "success", label: "Due in 3 months" },
      },
      {
        category: "Environmental",
        title: "Cabin Pressure Controller Check",
        interval: "Every 6 months",
        lastDone: "Last Mar 9, 2026",
        status: { level: "success", label: "Due in 4 months" },
      },
      {
        category: "Hydraulics",
        title: "Hydraulic Fluid Sampling",
        interval: "Every 6 months",
        lastDone: "Last Jun 2, 2026",
        status: { level: "success", label: "Due in 4 months" },
      },
      {
        category: "Emergency Systems",
        title: "Emergency Slide Inspection",
        interval: "Every 3 years",
        lastDone: "Last Jul 2, 2024",
        status: { level: "success", label: "Due in 1 year" },
      },
      {
        category: "Emergency Systems",
        title: "ELT Battery Replacement",
        interval: "Every 2 years",
        lastDone: "Last Mar 28, 2026",
        status: { level: "success", label: "Due in 2 years" },
      },
      {
        category: "Landing Gear",
        title: "Landing Gear Overhaul",
        interval: "Every 10 years",
        lastDone: "Last Mar 14, 2019",
        status: { level: "success", label: "Due in 3 years" },
      },
      {
        category: "Fuel System",
        title: "Fuel Quantity Indication Test",
        interval: "Every 6 months",
        lastDone: "Last Feb 17, 2026",
        status: { level: "warning", label: "Due in 2 weeks" },
      },
      {
        category: "Engine",
        title: "Engine 1 Oil Filter Analysis",
        interval: "Every 300 hours",
        lastDone: "Last May 30, 2026",
        status: { level: "success", label: "204 hours remaining" },
      },
      {
        category: "Avionics",
        title: "Weather Radar Calibration",
        interval: "Every 1 year",
        lastDone: "Last Oct 20, 2025",
        status: { level: "success", label: "Due in 2 months" },
      },
      {
        category: "APU",
        title: "APU Hot Section Borescope",
        interval: "Every 1,200 hours",
        lastDone: "Last Jan 15, 2026",
        status: { level: "success", label: "Due in 9 months" },
      },
    ]),
  },
  {
    tailNumber: "N314CN",
    model: "Cessna 172S Skyhawk SP",
    photo: "/aircraft/n314cn.jpg",
    spec: { make: "Cessna", model: "172S", year: "2005", serialNumber: "172S10234", category: "Piston" },
    meters: [
      { label: "Hobbs", value: "3,210.7", unit: "hrs", meta: "Never updated", percent: 25 },
      { label: "Tach", value: "1,854.8", unit: "hrs", meta: "Updated 20d ago", percent: 25 },
      { label: "Oil Consumption", value: ".06", unit: "qt/hr", meta: "Next change in 184 hrs", percent: 25 },
    ],
    logs: [
      { title: "Annual Inspection", date: "2026-05-18", type: "Inspection", component: "Airframe", totalTime: 3187.2, mechanic: "Valley Aero Maintenance" },
      { title: "ELT Inspection", date: "2026-03-12", type: "Equipment", component: "Emergency Systems", totalTime: 3141.6, mechanic: "Valley Aero Maintenance" },
      { title: "Magneto Timing Check", date: "2026-01-24", type: "Maintenance", component: "Ignition", totalTime: 3112.9, mechanic: "Cascade Aircraft Services" },
      { title: "Oil & Filter Change", date: "2025-11-21", type: "Maintenance", component: "Engine", totalTime: 3078.4, mechanic: "Valley Aero Maintenance" },
      { title: "Main Tire Replacement", date: "2025-10-03", type: "Maintenance", component: "Landing Gear", totalTime: 3044.0, mechanic: "Cascade Aircraft Services" },
      { title: "Transponder Certification", date: "2025-08-15", type: "Equipment", component: "Avionics", totalTime: 3009.7, mechanic: "Skyline Avionics Group" },
      { title: "Carburetor Heat Box Repair", date: "2025-06-27", type: "Maintenance", component: "Engine", totalTime: 2981.3, mechanic: "Cascade Aircraft Services" },
      { title: "Seat Rail AD Inspection", date: "2025-05-02", type: "Inspection", component: "Airframe", totalTime: 2957.8, mechanic: "Valley Aero Maintenance" },
    ],
    maintenance: withCounts([
      {
        category: "Inspection",
        title: "Annual Inspection",
        interval: "Every 1 year",
        lastDone: "Last May 18, 2026",
        status: { level: "success", label: "Due in 7 months" },
      },
      {
        category: "Equipment",
        title: "ELT Inspection",
        interval: "Every 1 year",
        lastDone: "Last Mar 12, 2026",
        status: { level: "success", label: "Due in 7 months" },
      },
      {
        category: "Engine",
        title: "Oil & Filter Change",
        interval: "Every 4 months",
        lastDone: "Last Nov 21, 2025",
        status: { level: "success", label: "Due in 6 weeks" },
      },
      {
        category: "Inspection",
        title: "100-Hour Inspection",
        interval: "Every 100 hours",
        lastDone: "Last Jun 4, 2026",
        status: { level: "success", label: "47 hours remaining" },
      },
      {
        category: "Avionics",
        title: "Transponder Certification",
        interval: "Every 2 years",
        lastDone: "Last Aug 15, 2025",
        status: { level: "success", label: "Due in 1 year" },
      },
      {
        category: "Instruments",
        title: "Pitot-Static System Check",
        interval: "Every 2 years",
        lastDone: "Last Oct 2, 2025",
        status: { level: "success", label: "Due in 14 months" },
      },
      {
        category: "Airframe",
        title: "Seat Rail AD Inspection",
        interval: "Every 100 hours",
        lastDone: "Last Jun 4, 2026",
        status: { level: "success", label: "47 hours remaining" },
      },
      {
        category: "Ignition",
        title: "Magneto 500-Hour Inspection",
        interval: "Every 500 hours",
        lastDone: "Last Jan 24, 2026",
        status: { level: "success", label: "Due in 4 months" },
      },
    ]),
  },
  {
    tailNumber: "822CN",
    model: "Cirrus SR22 G6",
    photo: "/aircraft/822cn.jpg",
    spec: { make: "Cirrus", model: "SR22 G6", year: "2019", serialNumber: "4783", category: "Piston" },
    meters: [
      { label: "Hobbs", value: "812.4", unit: "hrs", meta: "Updated 3d ago", percent: 25 },
      { label: "Tach", value: "795.2", unit: "hrs", meta: "Updated 3d ago", percent: 25 },
      { label: "Prop", value: "812.4", unit: "hrs", meta: "Overhaul in 1,187 hrs", percent: 40 },
      { label: "Oil", value: ".08", unit: "qt/hr", meta: "Next change in 41 hrs", percent: 25 },
    ],
    logs: [
      { title: "Oil & Filter Change", date: "2026-07-08", type: "Maintenance", component: "Engine", totalTime: 803.1, mechanic: "Cascade Aircraft Services" },
      { title: "Avionics Database Update", date: "2026-04-19", type: "Equipment", component: "Avionics", totalTime: 761.5, mechanic: "Cirrus Authorized Service" },
      { title: "Annual Inspection", date: "2026-02-02", type: "Inspection", component: "Airframe", totalTime: 724.8, mechanic: "Cirrus Authorized Service" },
      { title: "CAPS Line Cutter Replacement", date: "2025-12-10", type: "Equipment", component: "Airframe Parachute", totalTime: 693.2, mechanic: "Cirrus Authorized Service" },
      { title: "Pitot-Static System Check", date: "2025-09-30", type: "Inspection", component: "Instruments", totalTime: 668.9, mechanic: "Skyline Avionics Group" },
      { title: "Brake Linings Replacement", date: "2025-09-18", type: "Maintenance", component: "Landing Gear", totalTime: 655.4, mechanic: "Cascade Aircraft Services" },
    ],
    maintenance: withCounts([
      {
        category: "Inspection",
        title: "Annual Inspection",
        interval: "Every 1 year",
        lastDone: "Last Feb 2, 2026",
        status: { level: "success", label: "Due in 6 months" },
      },
      {
        category: "Equipment",
        title: "Transponder Check",
        interval: "Every 2 years",
        lastDone: "Last Sep 30, 2025",
        status: { level: "success", label: "Due in 14 months" },
      },
      {
        category: "Engine",
        title: "Oil & Filter Change",
        interval: "Every 50 hours",
        lastDone: "Last Jul 8, 2026",
        status: { level: "success", label: "41 hours remaining" },
      },
      {
        category: "Airframe Parachute",
        title: "CAPS Parachute Repack",
        interval: "Every 10 years",
        lastDone: "Last Jun 10, 2019",
        status: { level: "success", label: "Due in 3 years" },
      },
      {
        category: "Instruments",
        title: "Pitot-Static System Check",
        interval: "Every 2 years",
        lastDone: "Last Sep 30, 2025",
        status: { level: "success", label: "Due in 14 months" },
      },
      {
        category: "Airframe",
        title: "TKS Fluid System Flush",
        interval: "Every 1 year",
        lastDone: "Last Nov 5, 2025",
        status: { level: "success", label: "Due in 3 months" },
      },
    ]),
  },
  {
    tailNumber: "N551KA",
    model: "Beechcraft King Air 350i (2015)",
    photo: "/aircraft/n551ka.jpg",
    badge: "Needs Attention",
    spec: { make: "Beechcraft", model: "King Air 350i", year: "2015", serialNumber: "FL-987", category: "Turboprop" },
    meters: [
      { label: "Hobbs", value: "4,812.6", unit: "hrs", meta: "Updated 5d ago", percent: 75 },
      { label: "Tach 1 (L)", value: "4,655.1", unit: "hrs", meta: "Updated 5d ago", percent: 50 },
      { label: "Tach 2 (R)", value: "4,649.8", unit: "hrs", meta: "Updated 5d ago", percent: 50 },
      { label: "Oil 1 (L)", value: ".11", unit: "qt/hr", meta: "Next change in 92 hrs", percent: 25 },
      { label: "Oil 2 (R)", value: ".13", unit: "qt/hr", meta: "Next change in 87 hrs", percent: 25 },
    ],
    logs: [
      { title: "Oil & Filter Change — Both Engines", date: "2026-06-30", type: "Maintenance", component: "Engine", totalTime: 4798.3, mechanic: "Textron Aviation Service" },
      { title: "Prop Governor Overhaul (L)", date: "2026-05-09", type: "Maintenance", component: "Propeller", totalTime: 4741.6, mechanic: "Rocky Mountain Propeller" },
      { title: "Phase 2 Inspection", date: "2026-02-14", type: "Inspection", component: "Airframe", totalTime: 4612.5, mechanic: "Textron Aviation Service" },
      { title: "Windshield Heat Element Repair", date: "2025-12-02", type: "Maintenance", component: "Environmental", totalTime: 4544.9, mechanic: "Textron Aviation Service" },
      { title: "Pitot-Static System Check", date: "2024-09-20", type: "Inspection", component: "Instruments", totalTime: 4038.7, mechanic: "Skyline Avionics Group" },
      { title: "Transponder Certification", date: "2024-05-03", type: "Equipment", component: "Avionics", totalTime: 3897.2, mechanic: "Skyline Avionics Group" },
      { title: "Battery Capacity Check", date: "2026-04-18", type: "Inspection", component: "Electrical", totalTime: 4712.0, mechanic: "Textron Aviation Service" },
      { title: "Fuel Control Unit Adjustment (R)", date: "2025-10-30", type: "Maintenance", component: "Engine", totalTime: 4479.1, mechanic: "Textron Aviation Service" },
    ],
    maintenance: withCounts([
      {
        category: "Scheduled Maintenance",
        title: "Phase 2 Inspection",
        interval: "Every 200 hours",
        lastDone: "Last Feb 14, 2026",
        status: { level: "danger", label: "Overdue by 12 hours" },
      },
      {
        category: "Equipment",
        title: "Transponder Certification",
        interval: "Every 2 years",
        lastDone: "Last May 3, 2024",
        status: { level: "danger", label: "Overdue by 3 months" },
      },
      {
        category: "Inspection",
        title: "Pitot-Static System Check",
        interval: "Every 2 years",
        lastDone: "Last Sep 20, 2024",
        status: { level: "warning", label: "Due in 5 weeks" },
      },
      {
        category: "Propeller",
        title: "Prop Governor Overhaul (R)",
        interval: "Every 5 years",
        lastDone: "Last Aug 9, 2021",
        status: { level: "warning", label: "Due in 6 weeks" },
      },
      {
        category: "Engine",
        title: "Fuel Nozzle Cleaning",
        interval: "Every 600 hours",
        lastDone: "Last Oct 30, 2025",
        status: { level: "warning", label: "Due in 40 hours" },
      },
      {
        category: "Inspection",
        title: "Annual Inspection",
        interval: "Every 1 year",
        lastDone: "Last Nov 3, 2025",
        status: { level: "success", label: "Due in 3 months" },
      },
      {
        category: "Emergency Systems",
        title: "Fire Extinguisher Check",
        interval: "Every 1 year",
        lastDone: "Last Feb 14, 2026",
        status: { level: "success", label: "Due in 6 months" },
      },
      {
        category: "Electrical",
        title: "Battery Capacity Check",
        interval: "Every 1 year",
        lastDone: "Last Apr 18, 2026",
        status: { level: "success", label: "Due in 8 months" },
      },
      {
        category: "Landing Gear",
        title: "Gear Retraction Test",
        interval: "Every 1 year",
        lastDone: "Last Jan 22, 2026",
        status: { level: "success", label: "Due in 5 months" },
      },
      {
        category: "Airframe",
        title: "Static Wick Inspection",
        interval: "Every 1 year",
        lastDone: "Last Jun 12, 2026",
        status: { level: "success", label: "Due in 10 months" },
      },
      {
        category: "Environmental",
        title: "Cabin Pressurization Check",
        interval: "Every 2 years",
        lastDone: "Last Jul 29, 2025",
        status: { level: "success", label: "Due in 1 year" },
      },
      {
        category: "Engine",
        title: "Hot Section Inspection (Both)",
        interval: "Every 1,800 hours",
        lastDone: "Last Jun 6, 2024",
        status: { level: "warning", label: "Due in 60 hours" },
      },
      {
        category: "Propeller",
        title: "Prop Blade De-Ice Boot Check",
        interval: "Every 1 year",
        lastDone: "Last Dec 2, 2025",
        status: { level: "success", label: "Due in 4 months" },
      },
      {
        category: "Avionics",
        title: "ADS-B Performance Check",
        interval: "Every 2 years",
        lastDone: "Last Jul 8, 2026",
        status: { level: "success", label: "Due in 2 years" },
      },
    ]),
  },
];

/** Sidebar tail list — derived from the fleet so it never drifts. */
export const allTailNumbers = fleet.map((aircraft) => aircraft.tailNumber);

const totals = fleet.reduce(
  (sum, { maintenance }) => ({
    overdue: sum.overdue + maintenance.overdue,
    upcoming: sum.upcoming + maintenance.upcoming,
    current: sum.current + maintenance.current,
  }),
  { overdue: 0, upcoming: 0, current: 0 },
);

/** Fleet-level stats for the dashboard header and KPI row — derived from the fleet. */
export const fleetStats = {
  aircraftCount: fleet.length,
  trackedItems: totals.overdue + totals.upcoming + totals.current,
  kpis: [
    {
      icon: "aircraft",
      label: "Aircraft Status",
      value: String(fleet.filter((aircraft) => aircraft.badge).length),
      unit: "Aircraft(s)",
      info: "Aircraft in your fleet with overdue or soon-due maintenance items.",
      status: { level: "danger", label: "Need(s) attention" },
    },
    {
      icon: "overdue",
      label: "Overdue Items",
      value: String(totals.overdue),
      unit: "Item(s)",
      info: "Maintenance items past their due date or hour limit.",
      status: { level: "danger", label: "Overdue" },
    },
    {
      icon: "upcoming",
      label: "Upcoming Items",
      value: String(totals.upcoming),
      unit: "Item(s)",
      info: "Items coming due soon by date or accumulated hours.",
      status: { level: "warning", label: "Upcoming" },
    },
    {
      icon: "current",
      label: "Current Items",
      value: String(totals.current),
      unit: "Item(s)",
      info: "Items in good standing with time or hours remaining.",
      status: { level: "success", label: "Current" },
    },
  ] satisfies FleetKpi[],
};
