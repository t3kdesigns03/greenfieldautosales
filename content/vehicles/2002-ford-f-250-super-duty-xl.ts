import { featureList, type Vehicle } from "../types";

const v: Vehicle = {
  listingId: 117623594,
  year: 2002,
  make: "Ford",
  model: "F-250 Super Duty",
  trim: "XL",
  body: "truck",
  bodyStyle: "2dr Standard Cab 2WD Long Bed",
  price: 5000,
  miles: 244000,
  status: "available",
  exterior: "Silver",
  interior: "Gray",
  engine: "7.3L Power Stroke turbo diesel V8",
  transmission: "4-speed automatic",
  drivetrain: "RWD",
  fuel: "Diesel",
  doors: 2,
  vin: "1FTNF20F72EC25932",
  highlights: ["7.3 Power Stroke diesel", "Long bed", "Mechanically sound", "Runs and drives excellent"],
  caveat: "Seller notes this one does have rust.",
  description:
    "Just in 2002 Ford F250 regular cab 2wd long bed with the 7.3 Powerstroke Diesel. Runs and drives excellent, mechanically sound, does have rust. $5,000.",
  carsForSaleUrl: "https://www.greenfieldautosales.net/details/used-2002-ford-f-250-super-duty/117623594",
  features: featureList(
    "Power Steering, Abs - 4-Wheel, Axle Ratio - 3.73, Power Brakes, Clock, Radio - Am/Fm, Gauge - Tachometer, Wheel Diameter - 16 Inch, Wheels - Steel, Front Wipers - Intermittent, Front Airbags - Dual, Front Seat Type - Bench, Upholstery - Vinyl",
  ),
};

export default v;
