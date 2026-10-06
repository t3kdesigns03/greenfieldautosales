import { featureList, type Vehicle } from "../types";

const v: Vehicle = {
  listingId: 114352585,
  year: 2019,
  make: "Ford",
  model: "F-250 Super Duty",
  trim: "XL",
  body: "truck",
  bodyStyle: "Crew Cab Pickup",
  price: 22900,
  miles: 203000,
  status: "available",
  exterior: "White",
  interior: "Gray",
  engine: "6.2L V8",
  transmission: "6-speed automatic",
  drivetrain: "4x4",
  fuel: "Flex Fuel",
  doors: 4,
  vin: "1FT7W2B68KEE23795",
  origin: "NM",
  highlights: ["No rust", "Two owners", "Original owner in New Mexico", "Mechanically sound", "Highway miles"],
  description:
    "Just in 2019 Ford F250 Super Duty XL 4x4 with the 6.2 V8. Runs and drives excellent, mechanically sound, 2 owners, original owner was in New Mexico. No rust and ready to get back to work. 203,000 highway miles. $22,900.",
  carsForSaleUrl: "https://www.greenfieldautosales.net/details/used-2019-ford-f-250-super-duty/114352585",
  features: featureList(
    "Tailgate - Removable, Tailgate - Lift Assist, Door Sill Trim - Scuff Plate, Power Steering, Storage - Accessory Hook, Power Outlet(S) - 12v Front, Overhead Console - Front, Steering Wheel Mounted Controls - Multi-Function, 4wd Type - Part Time, Abs - 4-Wheel, Axle Ratio - 3.73, Roll Stability Control, Stability Control, Tow Hooks - Front, Traction Control, Trailer Hitch, Trailer Wiring - 4-Pin, Trailer Wiring - 7-Pin, Hill Holder Control, 4wd Selector - Electronic Hi-Lo, Trailer Stability Control, Radio - Am/Fm, Gauge - Oil Pressure, Gauge - Tachometer, Gauge - Transmission Temperature, Powertrain Hour Meter, Headlights - Auto On/Off, Tire Pressure Monitoring System, Spare Tire Size - Full-Size, Tire Type - All Season, Camera System - Rearview, Towing Mirrors, Rear Seat Type - 60-40 Split Bench, Rear Seat Folding - Folds Up, Side Curtain Airbags - Front, Side Curtain Airbags - Rear",
  ),
};

export default v;
