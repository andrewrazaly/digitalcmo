/** Phrases / patterns that should never be the spine of a Digital CMO essay. */
export const BANLIST_PHRASES: string[] = [
  "game-changer",
  "game changer",
  "unlock the power",
  "in today's fast-paced",
  "in todays fast-paced",
  "delve into",
  "dive deep into",
  "leverage synergies",
  "cutting-edge solution",
  "revolutionary approach",
  "best tools for",
  "top 10 tools",
  "top ten tools",
  "affiliate link",
  "use our coupon",
  "saas review",
];

export const BANLIST_REGEXES: RegExp[] = [
  /\bvs\.?\s+(myob|xero|hubspot|salesforce)\b/i,
  /\b(best|top)\s+\d+\s+(saas|marketing)\s+tools?\b/i,
];
