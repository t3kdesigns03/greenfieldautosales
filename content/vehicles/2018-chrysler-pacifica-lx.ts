import { featureList, type Vehicle } from "../types";

const v: Vehicle = {
  listingId: 99119042,
  year: 2018,
  make: "Chrysler",
  model: "Pacifica",
  trim: "LX",
  body: "van",
  bodyStyle: "Mini-Van",
  price: 13900,
  miles: 103000,
  status: "available",
  exterior: "Black",
  interior: "Black",
  engine: "3.6L V6",
  transmission: "9-speed automatic",
  drivetrain: "FWD",
  fuel: "Gas",
  mpg: { city: 18, hwy: 28 },
  seats: 7,
  vin: "2C4RC1CG8JR163371",
  titleStatus: "Clean",
  highlights: ["Clean title and history", "Newer tires", "Mechanically sound", "7 passenger", "Apple CarPlay / Android Auto"],
  description:
    "Just in 2018 Chrysler Pacifica LX with only 103,000 miles. Clean title and history, newer tires, runs and drives great, mechanically sound. This is a 7 passenger vehicle. 3.6L V6. $13,900.",
  carsForSaleUrl: "https://www.greenfieldautosales.net/details/used-2018-chrysler-pacifica/99119042",
  features: featureList(
    "Active Grille Shutters, Liftgate, Dual Manual Sliding Doors, Air Filtration, Front Floor Mats, Dual-Zone Front Air Conditioning, Independently Controlled Rear Air Conditioning, Dual Front Armrests, Chrome Interior Accents, Rear Floor Mats, Third-Row Floor Mats, Rear Folding Armrests, Capless Fuel Filler, Front Console Storage, Cruise Control, Front and Rear Cupholders, Third-Row Cupholders, Proximity Entry System, Tilt/Telescopic Steering Wheel, Audio/Phone Steering Wheel Controls, Door Pocket Storage, Front Seatback Storage, In-Dash Storage, Rear Seatback Storage, Sunglasses Holder, 12v Front and Cargo Power Outlets, Tray Tables, Bin Storage, Conversation Mirror, Dual Illuminating Vanity Mirrors, Front Overhead Console, Ambient Lighting, Cargo Area Light, Door Courtesy Lights, Push-Button Start, Front Reading Lights, 2 One-Touch Windows, Power Windows with Lockout, Voice Control, 4-Wheel ABS, Brake Drying, Braking Assist, Electronic Brakeforce Distribution, Electronic Parking Brake, Emergency Braking Preparation, Roll Stability Control, Stability Control, Traction Control, Hill Holder Control, Auxiliary Transmission Fluid Cooler, Touring Tuned Suspension, 180-Amp Alternator, Battery Saver, USB Auxiliary Input, Compass, External Temperature Display, Multi-Function Display, AM/FM Radio, Touch Screen Radio Display, Speed Sensitive Volume Control, Trip Odometer, Bluetooth, 6 Speakers, Tachometer, Uconnect Infotainment, Voice Operated Radio, Google POIs, Google Search, 7-inch Infotainment Screen, 3.5-inch Instrument Cluster Screen, Android Auto, Apple CarPlay",
  ),
};

export default v;
