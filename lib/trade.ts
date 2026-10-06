/** Trade-in lead: shared by the form (client) and /api/trade (server). */

export const conditions = [
  "Runs and drives well",
  "Runs, needs some work",
  "Doesn't run",
  "Not sure",
] as const;

export type TradeLead = {
  year: string;
  make: string;
  model: string;
  miles: string;
  condition: (typeof conditions)[number] | "";
  name: string;
  phone: string;
  note: string;
};

export const emptyLead: TradeLead = {
  year: "",
  make: "",
  model: "",
  miles: "",
  condition: "",
  name: "",
  phone: "",
  note: "",
};

const LIMITS: Record<keyof TradeLead, number> = {
  year: 4,
  make: 40,
  model: 60,
  miles: 9,
  condition: 40,
  name: 80,
  phone: 25,
  note: 1000,
};

export type TradeErrors = Partial<Record<keyof TradeLead, string>>;

export function validateLead(input: Partial<Record<keyof TradeLead, unknown>>): {
  lead: TradeLead;
  errors: TradeErrors;
} {
  const lead = { ...emptyLead };
  for (const key of Object.keys(emptyLead) as (keyof TradeLead)[]) {
    const raw = input[key];
    const val = typeof raw === "string" ? raw.trim().slice(0, LIMITS[key]) : "";
    (lead[key] as string) = val;
  }
  lead.miles = lead.miles.replace(/[^\d]/g, "");
  if (!conditions.includes(lead.condition as (typeof conditions)[number])) lead.condition = "";

  const errors: TradeErrors = {};
  const nextYear = new Date().getFullYear() + 1;
  const y = Number(lead.year);
  if (!lead.year) errors.year = "Enter the year.";
  else if (!/^\d{4}$/.test(lead.year) || y < 1950 || y > nextYear) errors.year = "Use a 4-digit year, like 2014.";
  if (!lead.make) errors.make = "Enter the make, like Ford.";
  if (!lead.model) errors.model = "Enter the model, like F-150.";
  if (!lead.name) errors.name = "Enter your name so we know who to get back to.";
  const digits = lead.phone.replace(/\D/g, "");
  if (!lead.phone) errors.phone = "Enter a phone number.";
  else if (digits.length < 10 || digits.length > 11) errors.phone = "Enter a 10-digit phone number.";

  return { lead, errors };
}
