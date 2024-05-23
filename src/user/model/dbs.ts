import { isNil } from "lodash";
import { IUser } from "./constant";
import UserModel from "./userSchema";

async function insertUser(data: IUser) {
  const res = await UserModel.create([data]);
  return res;
}

async function findOneUserByQuery(query: any): Promise<IUser> {
  const data: IUser = await UserModel.findOne(query);
  return data;
}

async function findMultipleUserByQuery(
  query: any,
  project?: any
): Promise<IUser[]> {
  const data: IUser[] = await UserModel.find(query, project);
  return data;
}

async function findMultipleUserByQueryWithPagination(
  query: any,
  pageNo: number,
  pageSize: number,
  project?: any
): Promise<IUser[]> {
  const data: IUser[] = await UserModel.find(query, project)
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 });
  return data;
}

async function updateOneUserByQuery(query: any, data: any) {
  const updatedData = { $set: data };
  const res = await UserModel.updateOne(query, updatedData);
}

async function updateMultipleUserByQuery(query: any, data: any) {
  const updatedData = { $set: data };
  const res = await UserModel.updateMany(query, updatedData);
}

export default {
  insertUser,
  findOneUserByQuery,
  findMultipleUserByQuery,
  updateOneUserByQuery,
  updateMultipleUserByQuery,
  findMultipleUserByQueryWithPagination
};
