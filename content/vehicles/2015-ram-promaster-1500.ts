import { featureList, type Vehicle } from "../types";

const v: Vehicle = {
  listingId: 114108690,
  year: 2015,
  make: "RAM",
  model: "ProMaster 1500",
  trim: "136\" WB High Roof",
  slug: "2015-ram-promaster-1500-high-roof",
  body: "van",
  bodyStyle: "Cargo Van",
  price: 15000,
  miles: 156000,
  status: "available",
  exterior: "White",
  interior: "Black",
  engine: "3.6L V6",
  transmission: "6-speed automatic",
  drivetrain: "FWD",
  fuel: "Gas",
  vin: "3C6TRVBG0FE509006",
  highlights: ["High roof", "136\" wheelbase", "Good tires", "Mechanically solid", "Barn rear doors"],
  description:
    "Just in 2015 Ram 1500 ProMaster 1500 136 WB High Roof Cargo Van. 3.6 V6, FWD, 156,000 miles, good tires, mechanically solid, runs and drives excellent. $15,000.",
  carsForSaleUrl: "https://www.greenfieldautosales.net/details/used-2015-ram-promaster/114108690",
  features: featureList(
    "Rear Trunk/Liftgate - Barn, Side Door Type - Passenger-Side Manual Sliding, Front Air Conditioning, Floor Material - Rubber/Vinyl, Multi-Function Remote - Keyless Entry, Steering Wheel - Telescopic, Storage - Cargo Tie-Down Anchors And Hooks, Power Outlet(S) - 12v Front, Cargo Area Light, One-Touch Windows - 2, Abs - 4-Wheel, Premium Brakes - Brembo, Roll Stability Control, Stability Control, Traction Control, Trailer Wiring, Hill Holder Control, Trailer Stability Control, Auxiliary Audio Input - Usb, Radio - Am/Fm, In-Dash Cd - Mp3 Playback, Clearance Lights, Tire Pressure Monitoring System, Spare Tire Size - Full-Size, Tire Type - All Season, Wheels - Steel, Power Windows, Oem Roof Height - High, Power Door Locks, Side Curtain Airbags - Front, Front Seat Type - Bucket, Upholstery - Cloth",
  ),
};

export default v;
