import { Types } from 'mongoose';

export interface JwtPayload {
  userId: Types.ObjectId;
  username: string;
}
