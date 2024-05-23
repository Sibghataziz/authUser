import { Schema, model } from "mongoose";
import { AUTH_PROVIDERS, IUser } from "./constant";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    phone: { type: String },
    photo: { type: String },
    bio: { type: String },
    email: { type: String },
    password: { type: String },
    isPrivate: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    provider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.CUSTOM,
    },
    providerId: { type: String },
    adminStatusProvidedByUserId: { type: String },
  },
  { timestamps: true }
);

const UserModel = model<IUser>("user", UserSchema);

export default UserModel;
