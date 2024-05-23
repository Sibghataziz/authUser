import { AUTH_PROVIDERS } from "../../user/model/constant";
import UserDbs from '../../user/model/dbs'
import UserUtils from '../../user/util'

async function githubCallback(req: any, res: any) {
  res.redirect("/auth/github/success");
}

async function githubSuccess(req: any, res: any) {
  const user = await UserDbs.findOneUserByQuery({
    providerId: req.session.passport.user.id,
    provider: AUTH_PROVIDERS.GITHUB,
  });
  const token = UserUtils.generateCustomToken(UserUtils.getTokenUserData(user))
  res.send({
    status: 1,
    data: {
        user,
        token
    }
  });
}

async function githubError(req: any, res: any) {
  res.send({
    status: 0,
    message: "Error logging in via Github..",
  });
}

export default {
  githubSuccess,
  githubError,
  githubCallback,
};
