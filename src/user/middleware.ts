import { isEmpty, isNil, last } from "lodash";
import UserUtils from "./util";
import UserDbs from "./model/dbs";

const checkCustomToken = async (req: any, res: any, next: any) => {
  try {
    let token: string = req.headers.authorization;
    if (isNil(token)) {
      return res.status(401).send({ message: "Not a valid user!" });
    }
    token = last(token.split(" "));
    const tokenUser = UserUtils.decryptCustomToken(token);
    if (isNil(tokenUser) || isEmpty(tokenUser._id)) {
      return res.status(401).send({ message: "Not a valid user!" });
    }
    const user = await UserDbs.findOneUserByQuery({
      _id: tokenUser._id,
    });
    if (isNil(user)) {
      return res.status(401).send({ message: "Not a valid user!" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error, "error while token validation");
    return res.status(401).send({ message: "server Error" });
  }
};

export default {
  checkCustomToken,
};
