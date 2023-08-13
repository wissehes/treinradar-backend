// export default getD
export interface Coordinate {
  lat: number;
  lon: number;
}

type Point = {
  x: number;
  y: number;
  z: number;
  radius: number;
};

type Coordinates = {
  location1: Coordinate;
  location2: Coordinate;
};

/**
 * @Returns the distance between two coordinates in KM
 */
const getDistanceFromGPS = (coordinates: Coordinates) => {
  const pointA = LocationToPoint(coordinates.location1);
  const pointB = LocationToPoint(coordinates.location2);

  // Round to 2 decimals
  // The + is for converting it to a number.
  // Otherwise toFixed will make it a string
  return +Distance(pointA, pointB).toFixed(2);
};

// Source: https://github.com/cosinekitty/geocalc/blob/master/compass.html

function Distance(ap: Point, bp: Point) {
  const dx = ap.x - bp.x;
  const dy = ap.y - bp.y;
  const dz = ap.z - bp.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz) * 0.001;
}

function LocationToPoint(c: Coordinate): Point {
  // Convert (lat, lon, elv) to (x, y, z).
  const lat = (c.lat * Math.PI) / 180.0;
  const lon = (c.lon * Math.PI) / 180.0;
  const radius = EarthRadiusInMeters(lat);
  const clat = GeocentricLatitude(lat);

  const cosLon = Math.cos(lon);
  const sinLon = Math.sin(lon);
  const cosLat = Math.cos(clat);
  const sinLat = Math.sin(clat);
  const x = radius * cosLon * cosLat;
  const y = radius * sinLon * cosLat;
  const z = radius * sinLat;

  // We used geocentric latitude to calculate (x,y,z) on the Earth's ellipsoid.
  // Now we use geodetic latitude to calculate normal vector from the surface, to correct for elevation.
  // const cosGlat = Math.cos(lat);
  // const sinGlat = Math.sin(lat);

  // const nx = cosGlat * cosLon;
  // const ny = cosGlat * sinLon;
  // const nz = sinGlat;

  // x += c.elv * nx;
  // y += c.elv * ny;
  // z += c.elv * nz;

  return { x: x, y: y, z: z, radius: radius /*, nx:nx, ny:ny, nz:nz*/ };
}

function GeocentricLatitude(lat: number) {
  // Convert geodetic latitude 'lat' to a geocentric latitude 'clat'.
  // Geodetic latitude is the latitude as given by GPS.
  // Geocentric latitude is the angle measured from center of Earth between a point and the equator.
  // https://en.wikipedia.org/wiki/Latitude#Geocentric_latitude
  const e2 = 0.00669437999014;
  const clat = Math.atan((1.0 - e2) * Math.tan(lat));
  return clat;
}

function EarthRadiusInMeters(latitudeRadians: number) {
  // latitudeRadians is geodetic, i.e. that reported by GPS.
  // http://en.wikipedia.org/wiki/Earth_radius
  // source: https://javascript.plainenglish.io/calculating-azimuth-distance-and-altitude-from-a-pair-of-gps-locations-36b4325d8ab0

  const a = 6378137.0; // equatorial radius in meters
  const b = 6356752.3; // polar radius in meters
  const cos = Math.cos(latitudeRadians);
  const sin = Math.sin(latitudeRadians);
  const t1 = a * a * cos;
  const t2 = b * b * sin;
  const t3 = a * cos;
  const t4 = b * sin;
  return Math.sqrt((t1 * t1 + t2 * t2) / (t3 * t3 + t4 * t4));
}

export default getDistanceFromGPS;
