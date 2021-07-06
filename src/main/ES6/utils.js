"use strict";


// Sine of angles in degrees
export function sind(x) {
	return Math.sin(Math.toRadians(x));
}

// Cosine of angles in degrees
export function cosd(x) {
	return Math.cos(Math.toRadians(x));
}

// Tangent of angles in degrees
export function tand(x) {
	return Math.tan(Math.toRadians(x));
}

// Normalize large angles
// Degrees
export function norm360Deg(x) {
	while (x < 0) {
		x += 360;
	}
	return x % 360;
}

// Radians
export function norm2PiRad(x) {
	while (x < 0) {
		x += (2 * Math.PI);
	}
	return x % (2 * Math.PI);
}

// Cosine of normalized angle (in radians)
export function cost(x) {
	return Math.cos(norm2PiRad(x));
}

export function ghaToLongitude(gha) {
	let longitude = (gha < 180) ? -gha : 360 - gha;
	return longitude;
};

export function longitudeToGHA(longitude) {
	let gha = (longitude < 0) ? -longitude : 360 - longitude;
	return gha;
};

/*
 * See http://en.wikipedia.org/wiki/Maidenhead_Locator_System
 */
export function gridSquare(lat, lng) {
    let gridSquare = "";

    lng += 180;
    lat += 90;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //                0         1         2
    //                01234567890123456789012345. Useless beyond X
    let first = Math.trunc(lng / 20.0);
    gridSquare += alphabet.charAt(first);
    let second = Math.trunc(lat / 10.0);
    gridSquare += alphabet.charAt(second);

    let third = Math.trunc((lng % 20) / 2);
    gridSquare += third.toFixed(0);
    let fourth = Math.trunc(lat % 10);
    gridSquare += fourth.toFixed(0);

    let d = lng - (Math.trunc(lng / 2) * 2);
    let fifth = Math.trunc(d * 12);
    gridSquare += alphabet.toLowerCase().charAt(fifth);
    let e = lat - Math.trunc(lat);
    let sixth = Math.trunc(e * 24);
    gridSquare += alphabet.toLowerCase().charAt(sixth);

    return gridSquare;
};


if (Math.toRadians === undefined) {
	Math.toRadians = (deg) => {
		return deg * (Math.PI / 180);
	};
}

if (Math.toDegrees === undefined) {
	Math.toDegrees = (rad) => {
		return rad * (180 / Math.PI);
	};
}

/*
exports.sind = sind;
exports.cosd = cosd;
exports.tand = tand;
exports.norm360Deg = norm360Deg;
exports.norm2PiRad = norm2PiRad;
exports.cost = cost;
*/