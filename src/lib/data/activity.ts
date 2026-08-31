/**
 * Which icon chip an activity row gets — every action type has a matching
 * icon: gauge (meter readings), droplet (oil logs), toolbox (physical
 * maintenance work), alert triangle (status changes), file-with-check
 * (records/certification/config), aircraft (fleet changes).
 */
export type ActivityKind = "meters" | "oil" | "maintenance" | "status" | "records" | "fleet";

export interface ActivityItem {
  /**
   * One sentence ending with "on" (or "as") — the tail renders after it as a
   * brand link (format rule: the aircraft always closes the sentence). No
   * trailing period, and no actors — activity is written impersonally.
   */
  text: string;
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
        text: "Updated Hobbs from 51,264.1 to 51,270.4, Tach 1 (L) from 48,779.0 to 48,785.3, Tach 2 (L) from 42,619.5 to 42,625.3, and Tach 3 from 41,729.8 to 41,735.1 on",
        tail: "N747CN",
        time: "9:41 AM",
        date: "Aug 20, 2026",
        kind: "meters",
      },
      {
        text: "Left Body Gear Brake Pack Replacement went from due to overdue on",
        tail: "N747CN",
        time: "6:00 AM",
        date: "Aug 20, 2026",
        kind: "status",
      },
      {
        text: "Logged oil at 6.5 qts with 1 qt added, noting slightly elevated consumption on Engine 2 (Right), on",
        tail: "N551KA",
        time: "7:15 AM",
        date: "Aug 19, 2026",
        kind: "oil",
      },
      {
        text: "Updated Hobbs from 4,807.9 to 4,812.6 on",
        tail: "N551KA",
        time: "6:02 PM",
        date: "Aug 18, 2026",
        kind: "meters",
      },
      {
        text: "Logged oil at 7.0 qts, oil added, on",
        tail: "822CN",
        time: "4:32 PM",
        date: "Aug 12, 2026",
        kind: "oil",
      },
      {
        text: "Completed Left Body Gear Brake Pack Replacement and linked work order #4471 with 6 photos on",
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
        text: "Changed the Pitot-Static System Check interval from every 2 years to every 24 calendar months per 14 CFR 91.411 on",
        tail: "N551KA",
        time: "11:08 AM",
        date: "Jul 29, 2026",
        kind: "records",
      },
      {
        text: "Changed Oil & Filter interval from 50 to 45 hours on",
        tail: "822CN",
        time: "2:54 PM",
        date: "Jul 16, 2026",
        kind: "records",
      },
      {
        text: "Completed Transponder Certification, updated the ADS-B configuration, and cleared the avionics squawk on",
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
        text: "Completed the A-Check Package covering 42 task cards with zero findings carried forward on",
        tail: "N747CN",
        time: "5:33 PM",
        date: "Jun 24, 2026",
        kind: "maintenance",
      },
      {
        text: "Added Beechcraft King Air 350i to the fleet as",
        tail: "N551KA",
        time: "10:22 AM",
        date: "Jun 12, 2026",
        kind: "fleet",
      },
    ],
  },
  {
    month: "May 2026",
    items: [
      {
        text: "Completed 100-Hour Inspection with two minor discrepancies corrected on",
        tail: "N314CN",
        time: "1:05 PM",
        date: "May 28, 2026",
        kind: "maintenance",
      },
      {
        text: "Updated Hobbs from 4,791.2 to 4,798.5 on",
        tail: "N314CN",
        time: "8:47 AM",
        date: "May 19, 2026",
        kind: "meters",
      },
      {
        text: "Logged oil at 6.0 qts, no oil added, on",
        tail: "822CN",
        time: "5:12 PM",
        date: "May 6, 2026",
        kind: "oil",
      },
    ],
  },
  {
    month: "April 2026",
    items: [
      {
        text: "ELT Battery Replacement went from current to due on",
        tail: "822CN",
        time: "6:00 AM",
        date: "Apr 22, 2026",
        kind: "status",
      },
      {
        text: "Uploaded the airworthiness certificate and updated the registration records on",
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
        text: "Changed the Annual Inspection due date from Mar 12, 2027 to Feb 28, 2027 on",
        tail: "N314CN",
        time: "11:52 AM",
        date: "Mar 25, 2026",
        kind: "records",
      },
      {
        text: "Added Cirrus SR22 G6 to the fleet as",
        tail: "822CN",
        time: "9:14 AM",
        date: "Mar 3, 2026",
        kind: "fleet",
      },
    ],
  },
];
