import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ type: String, unique: true, sparse: true })
  externalId?: string;

  @Prop({ type: String, required: true })
  nickname!: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
