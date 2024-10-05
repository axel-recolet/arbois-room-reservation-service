import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserEntity>;

@Schema({
  toObject: {
    flattenObjectIds: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      return ret;
    },
  },
})
export class UserEntity {
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  userName: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
