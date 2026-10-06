import { featureList, type Vehicle } from "../types";

const v: Vehicle = {
  listingId: 128991971,
  year: 2021,
  make: "Ford",
  model: "Bronco Sport",
  trim: "Outer Banks",
  body: "suv",
  bodyStyle: "SUV",
  price: 15900,
  miles: 98000,
  status: "available",
  exterior: "Red",
  interior: "Black",
  engine: "1.5L turbo I3",
  transmission: "8-speed automatic",
  drivetrain: "AWD",
  fuel: "Gas",
  mpg: { city: 25, hwy: 28 },
  doors: 4,
  vin: "3FMCR9C6XMRA63468",
  titleStatus: "Clean",
  highlights: ["Clean title and history", "Nice inside and out", "Heated steering wheel", "Remote start", "Contrast roof"],
  description:
    "Just in 2021 Ford Bronco Outer Banks AWD with 98,000 miles. Clean title and history, nice condition inside and out, priced to sell at $15,900.",
  carsForSaleUrl: "https://www.greenfieldautosales.net/details/used-2021-ford-bronco-sport/128991971",
  features: featureList(
    "Active Grille Shutters, Paint - Contrast Roof, Exhaust - Dual Tip, Rear Trunk/Liftgate - Liftgate, Front Air Conditioning - Automatic Climate Control, Front Air Conditioning Zones - Dual, Heated Steering Wheel, Steering Wheel Trim - Leather, Rear Vents - Second Row, Cruise Control, Multi-Function Remote - Proximity Entry System, Steering Wheel - Tilt And Telescopic, Storage - Dual Level Cargo Area, Power Outlet(S) - 115v Rear, Power Outlet(S) - Usb Front, Keypad Entry, Ambient Lighting - Color, Push-Button Start, Rearview Mirror - Auto-Dimming, Remote Engine Start/Cabin Preconditioning, 4wd Type - On Demand, Drive Mode Selector, Electronic Parking Brake - Auto Off, Emergency Braking Preparation, Roll Stability Control, Stability Control, Traction Control, Hill Holder Control, Auto Start/Stop, Compass, Radio - Touch Screen Display, Satellite Radio - Siriusxm, Wireless Data Link - Bluetooth, Total Speakers - 6, Infotainment - Sync, Connected In-Car Apps - Google Pois, Infotainment Screen Size - 8 In., Instrument Cluster Screen Size - 6.5 In., Smart Device App Function - Lock Operation, Smart Device App Function - Maintenance Status",
  ),
};

export default v;
