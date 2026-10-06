import type { Vehicle } from "../types";

/**
 * A few units that have sold, for the small "Sold here" strip on the home
 * page. They never get an inventory card or a detail page.
 * From the sold listings on Carsforsale (2026-10-05).
 */
const s = (listingId: number, year: number, make: string, model: string, trim: string, body: Vehicle["body"], miles: number): Vehicle => ({
  listingId, year, make, model, trim, body, miles, price: "call", status: "sold",
});

export const sold: Vehicle[] = [
  s(117031231, 2020, "Chevrolet", "Colorado", "Z71", "truck", 130000),
  s(124131625, 2015, "Audi", "Q7", "3.0T quattro Premium Plus", "suv", 163000),
  s(108207521, 2020, "BMW", "X5", "xDrive40i", "suv", 43000),
  s(116993897, 2017, "Chevrolet", "Tahoe", "LT", "suv", 164000),
  s(120186784, 2002, "Chevrolet", "S-10", "LS", "truck", 41000),
  s(123224243, 2007, "Chevrolet", "Silverado 1500", "LT1", "truck", 172000),
  s(109721386, 2015, "Chevrolet", "Silverado 2500HD", "Work Truck", "truck", 232000),
  s(112308217, 2008, "Buick", "Enclave", "CXL", "suv", 164000),
  s(99516078, 2014, "Audi", "A7", "3.0T quattro Prestige", "car", 66000),
  s(95064575, 2016, "Buick", "LaCrosse", "Leather", "car", 17000),
];
