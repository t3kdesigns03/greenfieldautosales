import { featureList, type Vehicle } from "../types";

const v: Vehicle = {
  listingId: 123167182,
  year: 2016,
  make: "Cadillac",
  model: "Escalade ESV",
  trim: "Luxury Collection",
  body: "suv",
  bodyStyle: "SUV",
  price: 22900,
  miles: 117000,
  status: "available",
  exterior: "White",
  interior: "Beige",
  engine: "6.2L V8",
  transmission: "8-speed automatic",
  drivetrain: "4x4",
  fuel: "Gas",
  mpg: { city: 15, hwy: 21 },
  doors: 4,
  vin: "1GYS4HKJ1GR421386",
  titleStatus: "Clean",
  origin: "TX",
  highlights: ["Clean title and history", "Michelin tires", "New front shocks", "New front brakes", "One older Texas couple owned it"],
  description:
    "Just in 2016 Cadillac Escalade ESV 4x4 with only 117,000 miles. Clean title and history, Michelin tires, new front shocks, new front brakes. Previous TX older couple owned. $22,900.",
  carsForSaleUrl: "https://www.greenfieldautosales.net/details/used-2016-cadillac-escalade-esv/123167182",
  features: featureList(
    "Running Boards, Rear Trunk/Liftgate - Power Operated, Rear Trunk/Liftgate - Sensor-Activated, Center Console Trim - Leather, Dash Trim - Leather, Door Trim - Leather, Front Air Conditioning - Automatic Climate Control, Front Air Conditioning Zones - Dual, Heated Steering Wheel, Rear Air Conditioning - Automatic Climate Control, Steering Wheel Trim - Leather, Steering Wheel Trim - Wood, Adjustable Pedals - Power, Cruise Control, Multi-Function Remote - Proximity Entry System, Remote Engine Start, Steering Wheel - Power Tilt And Telescopic, Power Outlet(S) - 115v Rear, Power Outlet(S) - 12v Cargo Area, Universal Remote Transmitter - Garage Door Opener, Vanity Mirrors - Dual Illuminating, Ambient Lighting, Footwell Lights, Push-Button Start, Memorized Settings - 2 Driver, Memorized Settings - Driver Seat, Memorized Settings - Side Mirrors, Memorized Settings - Steering Wheel, One-Touch Windows - 4, Steering Wheel Mounted Controls - Voice Control, Wireless Charging Station - Front, Rearview Mirror - Auto-Dimming, Abs - 4-Wheel, Active Suspension, Drive Mode Selector, Driver Adjustable Suspension - Ride Control, Locking Differential - Rear, Roll Stability Control, Self Leveling Suspension, Suspension Control - Magnetic, Tow/Haul Mode, Traction Control, Trailer Hitch, Trailer Wiring - 7-Pin, Air Suspension - Rear, Hill Holder Control, Auxiliary Transmission Fluid Cooler, 4wd Type - Part Time W/ On Demand Setting, 4wd Selector - Electronic, Alternator - 170 Amps, Battery - Heavy Duty, Cylinder Deactivation, Auxiliary Oil Cooler, Auxiliary Audio Input - Usb, Auxiliary Audio Input - Memory Card Slot, Compass, Digital Sound Processing, Fuel Economy Display - Mpg",
  ),
};

export default v;
