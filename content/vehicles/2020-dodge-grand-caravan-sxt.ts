import { featureList, type Vehicle } from "../types";

const v: Vehicle = {
  listingId: 128622267,
  year: 2020,
  make: "Dodge",
  model: "Grand Caravan",
  trim: "SXT",
  body: "van",
  bodyStyle: "Mini-Van",
  price: 17500,
  miles: 89000,
  status: "available",
  exterior: "White",
  interior: "Black",
  engine: "3.6L V6",
  transmission: "6-speed automatic",
  drivetrain: "FWD",
  fuel: "Flex Fuel",
  mpg: { city: 17, hwy: 25 },
  vin: "2C4RDGCG6LR174257",
  titleStatus: "Clean",
  highlights: ["New tires", "Clean inside and out", "Clean title and history", "Power sliding doors + liftgate", "Remote start"],
  description:
    "Just in 2020 Dodge Grand Caravan SXT with only 89,000 miles. New tires, clean inside and out, runs perfect, clean title and history. $17,500.",
  carsForSaleUrl: "https://www.greenfieldautosales.net/details/used-2020-dodge-grand-caravan/128622267",
  features: featureList(
    "Body Side Moldings - Body-Color, Window Trim - Chrome, Rear Spoiler - Roofline, Rear Trunk/Liftgate - Power Operated, Side Door Type - Dual Power Sliding, Air Filtration, Armrests - Front Center, Floor Mats - Front, Front Air Conditioning Zones - Dual, Rear Air Conditioning - Independently Controlled, Shift Knob Trim - Leather, Steering Wheel Trim - Leather, Floor Mats - Rear, Cruise Control, Cupholders - Front, Cupholders - Rear, Cupholders - Third Row, Easy Entry - Manual Rear Seat, Multi-Function Remote - Keyless Entry, Steering Wheel - Tilt And Telescopic, Steering Wheel Mounted Controls - Audio, Steering Wheel Mounted Controls - Phone, Storage - Cargo Net, Storage - Grocery Bag Holder, Storage - In Floor, Power Outlet(S) - 12v Front, Power Outlet(S) - 12v Rear, Conversation Mirror, Overhead Console - Front, Reading Lights - Front, Reading Lights - Rear, One-Touch Windows - 2, Rearview Mirror - Auto-Dimming, Remote Engine Start/Cabin Preconditioning, Abs - 4-Wheel, Braking Assist, Stability Control, Traction Control, Tuned Suspension - Touring, Trailer Stability Control, Alternator - 160 Amps, Auxiliary Audio Input - Usb, Hard Drive - 40gb, In-Dash Cd - Single Disc, Radio - Touch Screen Display, Satellite Radio - Siriusxm, Auxiliary Audio Input - Bluetooth, Total Speakers - 6, Infotainment - Uconnect, Infotainment Screen Size - 6.5 In., Hands-Free Phone Call Integration - Voice Operated, Daytime Running Lights, Front Fog Lights, Headlights - Auto On/Off, Tire Pressure Monitoring System, Tire Type - All Season, Wheels - Aluminum Alloy",
  ),
};

export default v;
