import { isBoolean, isEmpty, isNil } from "lodash";
import {
  AUTH_PROVIDERS,
  ILoginRequest,
  IToggleIsAdmin,
  IUser,
  IUserRequest,
  emailPattern,
} from "./model/constant";
import UserUtils from "./util";
import UserDbs from "./model/dbs";

async function registerUser(req: any, res: any) {
  try {
    const requestBody: IUserRequest = req.body;
    if (isEmpty(requestBody.email) || !requestBody.email.match(emailPattern)) {
      throw Error("invalid email!!");
    }
    if (isEmpty(requestBody.password) || isEmpty(requestBody.confirmPassword)) {
      throw Error("password and confirmPassword is required!!");
    }
    if (requestBody.password !== requestBody.confirmPassword) {
      throw Error("Password does not match");
    }
    const user = await UserDbs.findOneUserByQuery({email: requestBody.email})
    if(!isNil(user)){
        throw Error("User already exists!!!")
    }
    requestBody.password = await UserUtils.hashPassword(requestBody.password);
    await UserDbs.insertUser(requestBody);
    return res.status(201).send({
      status: 1,
      message: "Successfully registered",
    });
  } catch (error) {
    console.log(error, "error while register");
    const message = error.message || "Server Error";
    const errorRes = {
      status: 0,
      message,
    };
    return res.status(500).send(errorRes);
  }
}

async function loginUser(req: any, res: any) {
  try {
    const requestBody: ILoginRequest = req.body;
    if (isEmpty(requestBody.email) || isEmpty(requestBody.password)) {
      throw Error("email and password is required!!");
    }
    let user: any = await UserDbs.findOneUserByQuery({
      email: requestBody.email,
      provider: AUTH_PROVIDERS.CUSTOM,
    });
    if (isNil(user)) {
      throw Error(
        "You are not registered with us, Try authenticating via google"
      );
    }
    if (
      !(await UserUtils.comparePassword(requestBody.password, user.password))
    ) {
      throw Error("Invalid credentials!");
    }
    const token = UserUtils.generateCustomToken(
      UserUtils.getTokenUserData(user)
    );
    user = user._doc;
    delete user.password;
    return res.status(200).send({
      status: 1,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.log(error, "error while login");
    const message = error.message || "Server Error";
    const errorRes = {
      status: 0,
      message,
    };
    return res.status(500).send(errorRes);
  }
}

async function getProfile(req: any, res: any) {
  try {
    let user: any = req.user;
    user = user._doc;
    delete user.password;
    return res.status(200).send({
      status: 1,
      data: user,
    });
  } catch (error) {
    console.log(error, "error while fetching user");
    const message = error.message || "Server Error";
    const errorRes = {
      status: 0,
      message,
    };
    return res.status(500).send(errorRes);
  }
}

async function editProfile(req: any, res: any) {
  try {
    const requestBody: IUserRequest = req.body;
    const user: IUser = req.user;
    if (
      !isEmpty(requestBody.password) &&
      !(await UserUtils.comparePassword(requestBody.password, user.password))
    ) {
      if (requestBody.password !== requestBody.confirmPassword) {
        throw Error("password does not match");
      }
      requestBody.password = await UserUtils.hashPassword(requestBody.password);
    }
    delete requestBody.isAdmin;
    await UserDbs.updateOneUserByQuery({ _id: user._id }, requestBody);
    return res.status(200).send({
      status: 1,
      message: "profile successfully updated",
    });
  } catch (error) {
    console.log(error, "error while updating user");
    const message = error.message || "Server Error";
    const errorRes = {
      status: 0,
      message,
    };
    return res.status(500).send(errorRes);
  }
}

async function getUsers(req: any, res: any) {
  try {
    let { pageNo, pageSize } = req.query;
    pageNo = isNil(pageNo) ? 1 : pageNo;
    pageSize = isNil(pageSize) ? 10 : pageSize;
    const users = await UserDbs.findMultipleUserByQueryWithPagination(
      {},
      pageNo,
      pageSize,
      { _id: 1, name: 1 }
    );
    return res.status(200).send({
      status: 1,
      data: users,
    });
  } catch (error) {
    console.log(error, "error while fetching users");
    const message = error.message || "Server Error";
    const errorRes = {
      status: 0,
      message,
    };
    return res.status(500).send(errorRes);
  }
}

async function getUserProfile(req: any, res: any){
    try {
        const userId: string = req.params.userId;
        const currentUser: IUser = req.user;
        let user: any = await UserDbs.findOneUserByQuery({
            _id: userId
        });
        if(!currentUser.isAdmin && user.isPrivate){
            throw Error("User have a private account!!")
        }
        delete user._doc.password
        return res.status(200).send({
            status: 1,
            data: user
        })
    } catch (error) {
        const message = error.message || "Server Error";
    const errorRes = {
      status: 0,
      message,
    };
    return res.status(500).send(errorRes);
    }
}

async function toggleAdminStatus(req: any, res: any) {
  try {
    const requestBody: IToggleIsAdmin = req.body;
    console.log(requestBody, 'requestBody');
    if (isEmpty(requestBody.userId) || !isBoolean(requestBody.isAdmin)) {
      throw Error("invalid data");
    }
    const currentUser: IUser = req.user;
    if(!currentUser.isAdmin){
        throw Error("You are not authorized this action!")
    }
    if (
      !requestBody.isAdmin &&
      currentUser.adminStatusProvidedByUserId === requestBody.userId
    ) {
      throw Error("You cannot change this user admin status");
    }
    await UserDbs.updateOneUserByQuery(
      { _id: requestBody.userId },
      {
        adminStatusProvidedByUserId: requestBody.isAdmin
          ? currentUser._id
          : null,
        isAdmin: requestBody.isAdmin,
      }
    );
    return res.status(200).send({
      status: 1,
      message: "Admin status updated",
    });
  } catch (error) {
    const message = error.message || "Server Error";
    const errorRes = {
      status: 0,
      message,
    };
    return res.status(500).send(errorRes);
  }
}

async function signOut(req: any, res: any) {
  try {
    req.session.destroy(function (err) {
      console.log("session destroyed.");
    });
    res.status(200).send({
      status: 1,
      message: "successfully signOut",
    });
  } catch (err) {
    res.status(400).send({ status: 0, message: "Failed to sign out user" });
  }
}

export default {
  registerUser,
  loginUser,
  getProfile,
  editProfile,
  getUsers,
  toggleAdminStatus,
  signOut,
  getUserProfile
};
