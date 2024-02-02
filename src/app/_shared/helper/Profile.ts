import {IUser} from "../../interfaces/i-user";
import {Gender} from "../../constants/User";

export class ProfileHelper {

  static getPercentOfUserDetails(user: IUser) {
    let finished = 0;
    let profileDetails = ['genderLookingFor', 'languages', 'ethnicity', 'nationality', 'weight', 'height', 'chest', 'waist', 'hips', 'eyeColor', 'hairColor', 'hairLength'];

    if (user.gender !== Gender.Male) {
      profileDetails.push('chestCup');
    }

    let oneItemPercent = 100 / profileDetails.length;

    for (let detail of profileDetails) {
      if (user.details) {
        if (user.details[detail]) {
          finished += oneItemPercent;
        }
      }

      if (detail === 'genderLookingFor') {
        if (user['genderLookingFor']?.length > 0) {
          finished += oneItemPercent;
        }
      }
    }

    return Math.round(finished);
  }

  static getAge(value) {
    const birthday = new Date(value);
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  static calculateBadge(user: IUser) {
    let badge = 0;

    if (user._badges) {
      if (user._badges.likes) {
        badge += user._badges.likes
      }

      if (user._friendRequests) {
        badge += user._friendRequests.length;
      }

      if (user._badges.chats) {
        badge += user._badges.chats;
      }

      if (user._privateGalleryRequests) {
        badge += user._privateGalleryRequests.length;
      }
    }

    return badge;
  }

  static getFormattedDate(date: Date) {
    const yyyy = date.getFullYear();
    let mm: any = date.getMonth() + 1; // Months start at 0!
    let dd: any = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '.' + mm + '.' + yyyy;
  }

  static randomGeo(center, radius) {
    var y0 = center.latitude;
    var x0 = center.longitude;
    var rd = radius / 111300; //about 111300 meters in one degree

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    //Adjust the x-coordinate for the shrinking of the east-west distances
    var xp = x / Math.cos(y0);

    var newlat = y + y0;
    var newlon = x + x0;
    var newlon2 = xp + x0;

    return {
      'latitude': newlat,
      'longitude': newlon,
    };
  }

  static async toDataUrl(url): Promise<any> {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  }
}
