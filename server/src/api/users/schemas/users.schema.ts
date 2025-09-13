import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Devices } from '../../devices/schemas/devices.schema';

export type UsersDocument = HydratedDocument<Users>;

class Favorites {
  @Prop()
  limit: number;

  @Prop()
  page: number;

  @Prop()
  totalCount: number;

  @Prop()
  totalPages: number;

  @Prop()
  data: Devices[];
}

@Schema({
  versionKey: false
})
export class Users {
  @Prop()
  id: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop()
  created_at: string;

  @Prop()
  favorites: Favorites;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
