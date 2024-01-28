import {IUser} from "../../interfaces/i-user";

export interface IMessages {
  id?: string;
  lastMessage: string;
  lastMessageFrom: string;
  memberIds: string[];
  members?: any;
  profiles: Partial<IUser>[];
  lastMessageAt: number;
  createdAt: number;
  seen?: string[];
}
