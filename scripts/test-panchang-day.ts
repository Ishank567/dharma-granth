/** Run: npm run test:panchang */
import assert from 'node:assert/strict';
import {
  PRESET_LOCATIONS,
  calculateEducationalPanchang,
  civilPartsAtOffset,
  locationNoon,
  todayForLocation,
} from '../lib/panchang';

const instant = new Date('2026-10-10T20:30:00.000Z');
const ist = civilPartsAtOffset(instant, 5.5);
assert.deepEqual(ist, { year: 2026, month: 9, day: 11 });
const newYork = civilPartsAtOffset(instant, -5);
assert.deepEqual(newYork, { year: 2026, month: 9, day: 10 });

const noon = locationNoon(2026, 9, 10, 5.5);
assert.equal(noon.toISOString(), '2026-10-10T06:30:00.000Z');

const varanasi = PRESET_LOCATIONS[0];
const today = todayForLocation(varanasi, instant);
assert.equal(today.getFullYear(), 2026);
assert.equal(today.getMonth(), 9);
assert.equal(today.getDate(), 11);

const day = calculateEducationalPanchang(new Date(2026, 9, 10, 12, 0, 0), varanasi);
assert.equal(day.isoDate, '2026-10-10');
assert.match(day.tithi.approxSpan, /^Approximate · ends ~/);
assert.match(day.nakshatra.approxSpan, /IST$/);
assert.match(day.yoga.approxSpan, /^Approximate · ends ~/);
assert.match(day.karana.approxSpan, /^Approximate · ends ~/);

const west = PRESET_LOCATIONS.find((item) => item.utcOffsetHours === -5);
assert.ok(west);
const sameCivilDay = calculateEducationalPanchang(new Date(2026, 9, 10, 23, 30, 0), west);
assert.equal(sameCivilDay.isoDate, '2026-10-10');
assert.ok(sameCivilDay.tithi.approxSpan.endsWith(west.timezone));

console.log('panchang-day: all assertions passed');
