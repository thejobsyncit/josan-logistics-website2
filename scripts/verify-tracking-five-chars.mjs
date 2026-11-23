import { 
  generateShipmentTrackingNumberServer, 
  generateAirwayTrackingNumberServer 
} from '../src/server/referenceGenerator.js';

console.log('=== TEST: JOS- and AWS- Tracking Number Format (Strictly 5 Characters) ===\n');

let pass = 0;
let fail = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    pass++;
  } else {
    console.error(`[FAIL] ${message}`);
    fail++;
  }
}

// 1. Road freight: JOS- followed by exactly 5 characters
for (let i = 0; i < 20; i++) {
  const road = generateShipmentTrackingNumberServer({ service: 'road' });
  const num = road.trackingNumber;
  const parts = num.split('-');
  assert(parts[0] === 'JOS' && parts[1].length === 5, `${num} starts with JOS- and has exactly 5 characters (${parts[1]})`);
}

// 2. Air freight: AWS- followed by exactly 5 characters
for (let i = 0; i < 20; i++) {
  const air = generateAirwayTrackingNumberServer();
  const num = air.trackingNumber;
  const parts = num.split('-');
  assert(parts[0] === 'AWS' && parts[1].length === 5, `${num} starts with AWS- and has exactly 5 characters (${parts[1]})`);
}

// 3. Test road shipment: TJOS- followed by exactly 5 characters
for (let i = 0; i < 10; i++) {
  const testRoad = generateShipmentTrackingNumberServer({ isTest: true, service: 'road' });
  const num = testRoad.trackingNumber;
  const parts = num.split('-');
  assert(parts[0] === 'TJOS' && parts[1].length === 5, `${num} starts with TJOS- and has exactly 5 characters (${parts[1]})`);
}

// 4. Test airway shipment: TAWS- followed by exactly 5 characters
for (let i = 0; i < 10; i++) {
  const testAir = generateAirwayTrackingNumberServer({ isTest: true });
  const num = testAir.trackingNumber;
  const parts = num.split('-');
  assert(parts[0] === 'TAWS' && parts[1].length === 5, `${num} starts with TAWS- and has exactly 5 characters (${parts[1]})`);
}

console.log(`\n========================================`);
console.log(`SUMMARY: ${pass} PASSED, ${fail} FAILED`);
console.log(`========================================\n`);

if (fail > 0) {
  process.exit(1);
} else {
  console.log('All tracking format assertions verified successfully! ✅');
}

