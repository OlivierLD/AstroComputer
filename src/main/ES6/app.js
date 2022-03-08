import * as CelestialComputer from './longterm.almanac.js';
import { 
	sightReduction, 
	getGCDistance, 
	getGCDistanceDegreesNM, 
	calculateGreatCircle, 
	getMoonTilt
} from './utils.js';

// import * as CelestialComputer from './lib/celestial-computer.min.js';
// let CelestialComputer = require('./longterm.almanac.js');

export function sampleMain(userDataObject) {
	let year = userDataObject.utcyear;
	let	month = userDataObject.utcmonth;
	if (month < 1 || month > 12) {
		throw new Error("Month out of range! Restart calculation.");
	}
	let day = userDataObject.utcday;
	if (day < 1 || day > 31) {
		throw new Error("Day out of range! Restart calculation.");
	}
	let leap = CelestialComputer.isLeapYear(year);
	if (month === 2 && day > 28 && !leap) {
		throw new Error("February has only 28 days! Restart calculation.");
	}
	if (month === 2 && day > 29 && leap) {
		throw new Error("February has only 29 days in a leap year! Restart calculation.");
	}
	if (month === 4 && day > 30) {
		throw new Error("April has only 30 days! Restart calculation.");
	}
	if (month === 6 && day > 30) {
		throw new Error("June has only 30 days! Restart calculation.");
	}
	if (month === 9 && day > 30) {
		throw new Error("September has only 30 days! Restart calculation.");
	}
	if (month === 11 && day > 30) {
		throw new Error("November has only 30 days! Restart calculation.");
	}
	let hour = userDataObject.utchour;
	let minute = userDataObject.utcminute;
	let second = userDataObject.utcsecond;

	let delta_t = userDataObject.deltaT;

	delta_t = CelestialComputer.calculateDeltaT(year, month); // Recompute for current date (year and month). More accurate ;)
	// console.log("DeltaT is now %f", delta_t);

	let noPlanets = userDataObject.noPlanets || false;
	return CelestialComputer.calculate(year, month, day, hour, minute, second, delta_t, noPlanets);
}

window.sampleMain = sampleMain;
window.gridSquare = CelestialComputer.gridSquare;
window.sightReduction = CelestialComputer.sightReduction; // Note: This is the one in utils.js
window.getGCDistance = getGCDistance;
window.getGCDistanceDegreesNM = getGCDistanceDegreesNM;
window.calculateGreatCircle = calculateGreatCircle;
window.getMoonTilt = getMoonTilt;
window.getSunMeridianPassageTime = CelestialComputer.getSunMeridianPassageTime;
window.decimalToDMS = CelestialComputer.decimalToDMS;

let STANDALONE = false;
let STANDALONE_2 = false;

if (STANDALONE) {
	console.log("SRU Test:" + JSON.stringify(sightReduction(37.5,-122.3, 80, 22)));
	console.log(`GC Dist (in miles):${ 60.0 * Math.toDegrees(getGCDistance({lat: Math.toRadians(37), lng: Math.toRadians(-122)}, {lat: Math.toRadians(47), lng: Math.toRadians(-3)}))}`);
	console.log(`GC Dist (in miles):${ getGCDistanceDegreesNM({lat:37, lng: -122}, {lat: 47, lng: -3})}`);

	let from = { lat: Math.toRadians(19.0), lng: Math.toRadians(-160.0) }; // Cook
	let to = { lat: Math.toRadians(19.0), lng: Math.toRadians(-170.0) }; // Niue
	let route = calculateGreatCircle(from, to, 20);
	route.forEach(rp => {
		console.log(`Pt: ${Math.toDegrees(rp.point.lat)}/${Math.toDegrees(rp.point.lng)}, Z:${rp.z}`);
	});
	// Moon tilt
	// Obs {lat: 37.7489, lng: -122.507}
	// Moon: GHA: 77.40581427333474, Dec: 11.184778568111762
	// Sun: GHA: 28.50281942727125, Dec: 17.07827750394256
	let moonTilt = getMoonTilt({lat: 37.7489, lng: -122.507}, 
								{gha: 28.50281942727125, dec: 17.07827750394256}, 
								{gha: 77.40581427333474, dec: 11.184778568111762});
	console.log(`Moon Tilt: ${moonTilt}`);

	console.log("End of test");
}

if (STANDALONE_2) {
	let date = "2011-02-06T14:41:42.000Z";
	let lat = -10.761383333333333, lng = -156.24046666666666;

	let year = 2011, month = 2, day = 6, hour = 14, minute = 41, second = 42;
	let delta_t = CelestialComputer.calculateDeltaT(year, month);

	let userDataObject = {
		utcyear: year,
		utcmonth: month,
		utcday: day,
		utchour: hour,
		utcminute: minute,
		utcsecond: second,
		deltaT: delta_t, // 69.2201,
		noPlanets: false
	};
	let result = sampleMain(userDataObject);
	console.log(`Result: ${JSON.stringify(result, null, 2)}`);
	let sr = sightReduction(lat, lng, result.sun.GHA.raw, result.sun.DEC.raw);
	let tt = getSunMeridianPassageTime(lat, lng, result.EOT.raw);
	let dms = decimalToDMS(tt);
	console.log(`Transit Time: ${year}:${month}:${day} ${dms.hours}:${dms.minutes}:${dms.seconds}`);

	console.log(`Sun HP: ${result.sun.HP.raw}, SD: ${result.sun.SD.raw}`);

	// Note: that one takes time.
	let rs =CelestialComputer.sunRiseAndSetEpoch(delta_t, 
												 year, 
												 month, 
												 day, 
												 lat, 
												 lng, 
												 result.sun.DEC.raw, 
												 result.sun.HP.raw, 
												 result.sun.SD.raw, 
											 	 result.EOT.raw);

	console.log("End of Test (2)," + JSON.stringify(rs, null, 2));
}
