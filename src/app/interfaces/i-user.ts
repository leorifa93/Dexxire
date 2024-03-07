import {Gender, Membership} from "../constants/User";

export interface IUser {
  id: string;
  username: string;
  gender: Gender;
  genderLookingFor: number[];

  birthday: number;
  age: number;
  categories: string[];
  languages: string[];
  origin: {
    code: string,
    country: string,
    flag: string
  };
  location: any;
  membership: Membership;
  renewMemberShip: boolean;
  fakeAge?: number;
  isVerified?: boolean;

  membershipExpiredAt?: string;
  _settings: {
    units: {
      lengthType: string,
      distanceType: string,
      weightType: string
    },
    notifications: {
      messages: boolean,
      friendRequests: boolean,
      likes: boolean
    },
    currentLang: string,
    showInDiscover: boolean
  }

  _badges?: {
    likes?: number,
    chats?: number
  };
  currentLocation?: any;

  status?: number;
  lastLogin?: number;

  profilePictures?: { uploadAt: number, original: string, thumbnails?: { small: string, medium: string, big: string }, approved?: boolean };
  publicAlbum?: { uploadAt: number, original: string, thumbnails?: { small: string, medium: string, big: string }, approved?: boolean }[];
  privateAlbum?: { uploadAt: number, original: string, thumbnails?: { small: string, medium: string, big: string } }[];
  likesCount?: number;
  details?: {
    description?: string,
    languages?: number[],
    ethnicity?: number,
    nationality?: {code: string, country: string},
    height?: {cm: number, inch: number},
    weight?: {kg: number, lbs: number},
    chestCup?: string,
    chest?: {cm: number, inch: number},
    waist?: {cm: number, inch: number},
    hips?: {cm: number, inch: number},
    eyeColor?: string,
    hairColor?: string,
    hairLength?: string,
    customAge?: number
  };
  contacts?: {
    phoneNumber?: {countryCode?: string, number?: string},
    whatsApp?: {countryCode?: string, number?: string},
  }
  socialMedia?: {
    instagram?: string;
    tikTok?: string;
  }
  boostSettings?: {
    isInterval: boolean,
    interval?: string,
    nextBoostAt?: number
  }
  lastBoostAt?: number;
  availableCoins?: number;
  _sentFriendRequests?: string[];
  _friendRequests?: string[];
  _friendsList?: string[];
  _deviceIds?: string[];
  _blockList?: string[];
  _gotBlockedFrom?: string[];
  _privateGalleryAccessUsers?: string[];
  _privateGalleryRequests?: string[];
}
