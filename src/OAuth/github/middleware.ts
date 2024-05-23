import { isNil } from "lodash";
import { AUTH_PROVIDERS } from "../../user/model/constant";
import UserDbs from "../../user/model/dbs";

async function githubMiddleware(
  accessToken: any,
  refreshToken: any,
  profile: any,
  cb: any
) {
//   console.log(accessToken, "accessToken");
//   console.log(refreshToken, "refreshToken");
//   console.log(profile, "profile");
  console.log(JSON.stringify(cb), "cb");
  const user = await UserDbs.findOneUserByQuery({
    providerId: profile.id,
    provider: AUTH_PROVIDERS.GITHUB,
  });
  if (isNil(user)) {
    const user = await UserDbs.insertUser({
      name: profile.username,
      provider: AUTH_PROVIDERS.GITHUB,
      providerId: profile.id,
      email: profile.email,
    });
    console.log(user,'user');
    return cb(null, profile);
  } else {
    console.log(profile, 'profile');
    return cb(null, profile);
  }
}

export default {
    githubMiddleware
}
