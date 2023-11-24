export class DistanceHelper {
  static calcDistance(lat1: number, lon1: number, lat2: number, lon2: number, fixed: number = 0)
  {
    var R = 6371; // km
    var dLat = DistanceHelper.toRad(lat2-lat1);
    var dLon = DistanceHelper.toRad(lon2-lon1);
    var lat1 = DistanceHelper.toRad(lat1);
    var lat2 = DistanceHelper.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(fixed);
  }

  static toRad(Value: number)
  {
    return Value * Math.PI / 180;
  }

  static kmToMiles(km: number) {
    return km * 0.621371;
  }
}
