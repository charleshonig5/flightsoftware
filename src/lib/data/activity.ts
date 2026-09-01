/**
 * Which icon chip an activity row gets — every action type has a matching
 * icon: gauge (meter readings), droplet (oil logs), toolbox (physical
 * maintenance work), alert triangle (status changes), file-with-check
 * (records/certification/config), aircraft (fleet changes).
 */
export type ActivityKind = "meters" | "oil" | "maintenance" | "status" | "records" | "fleet";

/**
 * One sentence fragment. Plain strings are the scaffolding (connectors,
 * qualifiers) and render muted; `{ key }` fragments are the scannable
 * payload and render ink: the **leading action verb** (merged with its
 * object when adjacent — "Updated Hobbs", "Logged oil"), plus the object
 * acted on and the value/state it ended at. Per-kind emphasis pattern:
 * meters → verb + meter name, new reading; oil → "Logged oil" + quantities;
 * maintenance → verb + task name; status → item name + new state; records →
 * verb, record object + new value; fleet → "Added" + aircraft model.
 */
export type ActivityFragment = string | { key: string };

export interface ActivityItem {
  /**
   * Sentence fragments ending with "on" (or "as") — the tail renders after
   * them as a brand link (format rule: the aircraft always closes the
   * sentence). No trailing period, and no actors — activity is written
   * impersonally.
   */
  text: ActivityFragment[];
  tail: string;
  time: string;
  date: string;
  kind: ActivityKind;
}

export interface ActivityMonth {
  month: string;
  items: ActivityItem[];
}

/** Recent activity, newest first, grouped by month for the feed. */
export const activityMonths: ActivityMonth[] = [
  {
    month: "August 2026",
    items: [
      {
        text: [
          { key: "Updated Hobbs" },
          " from 51,264.1 to ",
          { key: "51,270.4" },
          ", ",
          { key: "Tach 1 (L)" },
          " from 48,779.0 to ",
          { key: "48,785.3" },
          ", ",
          { key: "Tach 2 (L)" },
          " from 42,619.5 to ",
          { key: "42,625.3" },
          ", and ",
          { key: "Tach 3" },
          " from 41,729.8 to ",
          { key: "41,735.1" },
          " on",
        ],
        tail: "N747CN",
        time: "9:41 AM",
        date: "Aug 20, 2026",
        kind: "meters",
      },
      {
        text: [
          { key: "Left Body Gear Brake Pack Replacement" },
          " went from due to ",
          { key: "overdue" },
          " on",
        ],
        tail: "N747CN",
        time: "6:00 AM",
        date: "Aug 20, 2026",
        kind: "status",
      },
      {
        text: [
          { key: "Logged oil" },
          " at ",
          { key: "6.5 qts" },
          " with ",
          { key: "1 qt added" },
          ", noting slightly elevated consumption on Engine 2 (Right), on",
        ],
        tail: "N551KA",
        time: "7:15 AM",
        date: "Aug 19, 2026",
        kind: "oil",
      },
      {
        text: [{ key: "Updated Hobbs" }, " from 4,807.9 to ", { key: "4,812.6" }, " on"],
        tail: "N551KA",
        time: "6:02 PM",
        date: "Aug 18, 2026",
        kind: "meters",
      },
      {
        text: [{ key: "Logged oil" }, " at ", { key: "7.0 qts" }, ", oil added, on"],
        tail: "822CN",
        time: "4:32 PM",
        date: "Aug 12, 2026",
        kind: "oil",
      },
      {
        text: [
          { key: "Logged oil" },
          " at ",
          { key: "11.0 qts" },
          " with ",
          { key: "2 qts added" },
          " across all four engines on",
        ],
        tail: "N747CN",
        time: "8:05 AM",
        date: "Aug 9, 2026",
        kind: "oil",
      },
      {
        text: [
          { key: "Completed Left Body Gear Brake Pack Replacement" },
          " and linked work order #4471 with 6 photos on",
        ],
        tail: "N747CN",
        time: "3:47 PM",
        date: "Aug 4, 2026",
        kind: "maintenance",
      },
    ],
  },
  {
    month: "July 2026",
    items: [
      {
        text: [
          { key: "Changed" },
          " the ",
          { key: "Pitot-Static System Check" },
          " interval from every 2 years to ",
          { key: "every 24 calendar months" },
          " per 14 CFR 91.411 on",
        ],
        tail: "N551KA",
        time: "11:08 AM",
        date: "Jul 29, 2026",
        kind: "records",
      },
      {
        text: [
          { key: "Updated Hobbs" },
          " from 806.9 to ",
          { key: "812.4" },
          " and ",
          { key: "Tach" },
          " from 789.8 to ",
          { key: "795.2" },
          " on",
        ],
        tail: "822CN",
        time: "5:41 PM",
        date: "Jul 21, 2026",
        kind: "meters",
      },
      {
        text: [
          { key: "Changed Oil & Filter" },
          " interval from 50 to ",
          { key: "45 hours" },
          " on",
        ],
        tail: "822CN",
        time: "2:54 PM",
        date: "Jul 16, 2026",
        kind: "records",
      },
      {
        text: [
          { key: "Completed Transponder Certification" },
          ", updated the ADS-B configuration, and cleared the avionics squawk on",
        ],
        tail: "N551KA",
        time: "2:20 PM",
        date: "Jul 8, 2026",
        kind: "maintenance",
      },
    ],
  },
  {
    month: "June 2026",
    items: [
      {
        text: [
          { key: "Completed" },
          " the ",
          { key: "A-Check Package" },
          " covering 42 task cards with zero findings carried forward on",
        ],
        tail: "N747CN",
        time: "5:33 PM",
        date: "Jun 24, 2026",
        kind: "maintenance",
      },
      {
        text: [{ key: "Added Beechcraft King Air 350i" }, " to the fleet as"],
        tail: "N551KA",
        time: "10:22 AM",
        date: "Jun 12, 2026",
        kind: "fleet",
      },
      {
        text: [{ key: "Completed 100-Hour Inspection" }, " with no discrepancies on"],
        tail: "N314CN",
        time: "1:26 PM",
        date: "Jun 4, 2026",
        kind: "maintenance",
      },
    ],
  },
  {
    month: "May 2026",
    items: [
      {
        text: [
          { key: "Completed 100-Hour Inspection" },
          " with two minor discrepancies corrected on",
        ],
        tail: "N314CN",
        time: "1:05 PM",
        date: "May 28, 2026",
        kind: "maintenance",
      },
      {
        text: [{ key: "Updated Hobbs" }, " from 4,791.2 to ", { key: "4,798.5" }, " on"],
        tail: "N314CN",
        time: "8:47 AM",
        date: "May 19, 2026",
        kind: "meters",
      },
      {
        text: [{ key: "Logged oil" }, " at ", { key: "6.0 qts" }, ", no oil added, on"],
        tail: "822CN",
        time: "5:12 PM",
        date: "May 6, 2026",
        kind: "oil",
      },
      {
        text: [
          { key: "Uploaded 4 photos" },
          " to the ",
          { key: "Wing Gear Tire Replacement" },
          " log on",
        ],
        tail: "N747CN",
        time: "3:12 PM",
        date: "May 2, 2026",
        kind: "records",
      },
    ],
  },
  {
    month: "April 2026",
    items: [
      {
        text: [{ key: "ELT Battery Replacement" }, " went from current to ", { key: "due" }, " on"],
        tail: "822CN",
        time: "6:00 AM",
        date: "Apr 22, 2026",
        kind: "status",
      },
      {
        text: [{ key: "Updated Tach" }, " from 1,839.5 to ", { key: "1,847.0" }, " on"],
        tail: "N314CN",
        time: "10:05 AM",
        date: "Apr 14, 2026",
        kind: "meters",
      },
      {
        text: [
          { key: "Uploaded" },
          " the ",
          { key: "airworthiness certificate" },
          " and updated the registration records on",
        ],
        tail: "N551KA",
        time: "3:38 PM",
        date: "Apr 9, 2026",
        kind: "records",
      },
    ],
  },
  {
    month: "March 2026",
    items: [
      {
        text: [
          { key: "Changed" },
          " the ",
          { key: "Annual Inspection" },
          " due date from Mar 12, 2027 to ",
          { key: "Feb 28, 2027" },
          " on",
        ],
        tail: "N314CN",
        time: "11:52 AM",
        date: "Mar 25, 2026",
        kind: "records",
      },
      {
        text: [{ key: "Added Cirrus SR22 G6" }, " to the fleet as"],
        tail: "822CN",
        time: "9:14 AM",
        date: "Mar 3, 2026",
        kind: "fleet",
      },
    ],
  },
];
