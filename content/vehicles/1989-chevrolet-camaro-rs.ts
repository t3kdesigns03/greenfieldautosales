import { featureList, type Vehicle } from "../types";

const v: Vehicle = {
  listingId: 130396587,
  year: 1989,
  make: "Chevrolet",
  model: "Camaro",
  trim: "RS",
  body: "car",
  bodyStyle: "2dr Hatchback",
  price: 6500,
  miles: 107000,
  status: "available",
  exterior: "Red",
  interior: "Gray",
  engine: "383 V8",
  transmission: "4-speed automatic",
  drivetrain: "RWD",
  fuel: "Gas",
  vin: "1G1FP21E9KL150131",
  titleStatus: "Clean",
  highlights: ["T-tops", "383 V8", "New tires", "Rebuilt carburetor", "New flywheel and starter", "Price is firm"],
  description:
    "1989 Chevrolet Camaro RS w/ t-tops, 383 V8, and only 107,000 miles. Clean title, new tires, runs and drives excellent, rebuilt carburetor, new flywheel, new starter. This car is ready to go! $6,500 firm.",
  carsForSaleUrl: "https://www.greenfieldautosales.net/details/used-1989-chevrolet-camaro/130396587",
  features: featureList(
    "Rear Spoiler, Ground Effects/Lower Spoilers, Center Console, Power Steering, Power Steering - Hydraulic, Power Brakes, Tuned Suspension - Sport, Clock, Premium Brand, Radio - Am/Fm, Wheel Diameter - 15 Inch, Wheels - Aluminum Alloy, Anti-Theft System - Alarm, Front Seat Type - Bucket, Upholstery - Cloth",
  ),
};

export default v;
