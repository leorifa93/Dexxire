import {Gender, Membership} from "../constants/User";

export interface IUser {
  id: string;
  username: string;
  gender: Gender;
  genderLookingFor: number[];

  birthday: number;
  categories: string[];
  languages: string[];
  origin: {
    code: string,
    country: string,
    flag: string
  };
  location: any;
  membership: Membership;
  currentLocation?: any;

  status?: number;
  lastLogin?: number;

  profilePictures?: { uploadAt: number, original: string, thumbnails?: { small: string, medium: string, big: string } };
  publicAlbum?: { uploadAt: number, original: string, thumbnails?: { small: string, medium: string, big: string } }[];
  privateAlbum?: { uploadAt: number, original: string, thumbnails?: { small: string, medium: string, big: string } }[];
  likesCount?: number;

  details?: {
    description?: string,
    languages?: number[],
    ethnicity?: number,
    nationality?: {code: string, country: string},
    height?: {cm: number, inch: number},
    weight?: {kg: number, lbs: number},
    chestCup?: {cm: number, inch: number},
    chest?: {cm: number, inch: number},
    waist?: {cm: number, inch: number},
    hips?: {cm: number, inch: number},
    eyeColor?: string,
    hairColor?: string,
    hairLength?: string
  };
  contacts?: {
    phoneNumber?: {countryCode: string, number: number},
    whatsApp: {countryCode: string, number: number},
  }
  socialMedia?: {
    instagram: string;
    tikTok: string;
  }
}
