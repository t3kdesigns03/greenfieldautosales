/**
 * content/inventory.ts — the cars on the lot.
 *
 * One file per vehicle lives in content/vehicles/. To add a car:
 *   1. Copy any file in content/vehicles/ and rename it (e.g. 2014-ford-f-150-xlt.ts).
 *   2. Fill in what you know. Leave a field out rather than guess.
 *   3. Import it in the list below.
 *   4. Photos: drop them in public/inventory/<slug>/raw/ and run `npm run photos`.
 *
 * When a car sells: set `status: "sold"`. It disappears from inventory and its
 * page 404s, and it shows up in the small "Sold here" strip on the home page.
 *
 * Carsforsale (https://www.greenfieldautosales.net) is still the system of
 * record in phase 1. Data below was copied from those listings on 2026-10-05.
 */

export * from "./types";
import type { Vehicle } from "./types";

import escalade from "./vehicles/2016-cadillac-escalade-esv";
import camaro from "./vehicles/1989-chevrolet-camaro-rs";
import pacifica17 from "./vehicles/2017-chrysler-pacifica-touring";
import pacifica18 from "./vehicles/2018-chrysler-pacifica-lx";
import caravan from "./vehicles/2020-dodge-grand-caravan-sxt";
import f250_19 from "./vehicles/2019-ford-f-250-super-duty-xl";
import bronco from "./vehicles/2021-ford-bronco-sport-outer-banks";
import f350 from "./vehicles/2016-ford-f-350-super-duty";
import f250_02 from "./vehicles/2002-ford-f-250-super-duty-xl";
import promaster from "./vehicles/2015-ram-promaster-1500";
import tundra from "./vehicles/2023-toyota-tundra-sr5";
import { sold } from "./vehicles/sold";

export const inventory: Vehicle[] = [
  tundra,
  camaro,
  pacifica17,
  bronco,
  caravan,
  escalade,
  f250_02,
  f250_19,
  promaster,
  f350,
  pacifica18,
  ...sold,
];
