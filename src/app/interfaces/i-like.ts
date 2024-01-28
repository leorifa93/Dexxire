export interface ILike {
  createdAt: number;
  sentFrom: {
    id: string,
    username: string,
    profilePictures: any
  };
  seen: boolean;
}
