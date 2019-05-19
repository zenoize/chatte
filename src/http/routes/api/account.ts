import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";
import UserAccount, { IUserAccount } from "../../../models/UserAccount";
import * as jwt from "jsonwebtoken";

import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";
import auth from "../../middleware/auth";

import * as joi from "joi";
import User, { IUser } from "../../../models/User";

const router = Router();

function genHash(password: string): Promise<string> {
  return new Promise((res, rej) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return rej(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return rej(err);
        return res(hash);
      });
    });
  });
}

function createToken(userId: string): Promise<string> {
  return new Promise((res, rej) => {
    jwt.sign(
      {
        id: userId
      },
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) rej(err);
        res(token.toString());
      }
    );
  });
}

const API: IAPI = {
  get: {
    auth: {
      schema: {
        username: joi.string().required(),
        password: joi.string().required()
      },
      access: ApiAccess.GUEST,
      execute: async ({ username, password }) => {
        // return new Promise(async (res, rej) => {
        const userAccount = await UserAccount.findOne({ username }).exec();
        if (!userAccount) throw apiError(400, "Неверный логин или пароль");
        const isMatch = await bcrypt.compare(password, userAccount.password);
        if (!isMatch) throw apiError(400, "Неверный логин или пароль");
        const user = await User.findById(userAccount.userId).exec();
        return { token: await createToken(user.id) };
        // await

        // });
      }
    },
    changePassword: {
      schema: {
        oldPassword: joi.string().required(),
        newPassword: joi
          .string()
          .min(3)
          .required()
      },
      access: ApiAccess.TOKEN,
      execute: async ({ id, oldPassword, newPassword }) => {
        const account = await UserAccount.findOne({ userId: id }).exec();
        const isMatch = await bcrypt.compare(oldPassword, account.password);
        if (!isMatch) throw apiError(401, "Неверный пароль");
        // const account = await AccountData.updateOne({ userId: id }, { username, email }).exec();
        await account.updateOne({ password: await genHash(newPassword) }).exec();
        return;
        // return await AccountData.findOne({ userId: id })
        //   .select("-password -_id -__v")
        //   .exec();
      }
    },
    checkToken: {
      schema: {
        token: joi.string().required()
      },
      access: ApiAccess.GUEST,
      execute: ({ token }): Promise<any> => {
        return new Promise((res, rej) => {
          auth(token, async (err, userId) => {
            if (err) rej(err);
            else {
              // const user = await User.findById(userId).exec();
              // const accountData = await AccountData.findOne({ userId }).exec();
              // if(!accou)
              return res({ token });
            }
          });
        });
      }
    },
    create: {
      schema: {
        username: joi
          .string()
          .required()
          .min(3),
        password: joi
          .string()
          .required()
          .min(3)
      },
      access: ApiAccess.GUEST,
      execute: async ({ username, password }, { req, res, reflect }) => {
        const existingUser = await UserAccount.findOne().or([{ username }, { password }]);
        if (existingUser) throw apiError(403, "user already exist");
        const userDoc: IUser = {};
        const user = await User.create({ userDoc });
        const userAccountDoc: IUserAccount = {
          password: await genHash(password),
          username,
          userId: user.id
        };
        const userAccount = await UserAccount.create(userAccountDoc);
        const result = await reflect("get.auth", { username, password });
        return result;
        // this.

        // auth()

        // const existingUser = await AccountData.findOne()
        //   .or([{ username }, { email: email }])
        //   .exec();
        // if (existingUser) throw apiError("Пользователь уже существует", 400);
        // const user = await new User().save().catch(err => console.log(err));
        // if (!user) throw "WHATA FUCK";
        // const pass = await genHash(password);
        // const accountData: IAccountData = {
        //   username,
        //   email,
        //   password: pass,
        //   userId: user.id
        // };
        // const userDataDoc: IUserData = {
        //   dob: new Date(dob),
        //   firstName,
        //   secondName,
        //   thirdName,
        //   city,
        //   socialUrl,
        //   userId: user.id,
        //   tags,
        //   description
        // };
        // const userProfile: IUserProfile = {
        //   dor: new Date(),
        //   userId: user.id
        // };
        // const fullUser = await Promise.all([new UserProfile(userProfile).save(), new UserData(userDataDoc).save(), new AccountData(accountData).save()]);
        // // const salt = await bcrypt.genSalt(10);
        // const hash = await bcrypt.hash(process.env.JWT_SECRET, await bcrypt.genSalt(11));
        // const url = `${req.protocol}://${req.get("host")}/account/verify?hash=${hash}&salt=${user.id}`;
        // req.smtp.sendMail({
        //   from: "rehirer@gmail.com", // sender address
        //   to: email, // list of receivers
        //   subject: "Добро пожаловать на Rehirer!", // Subject line
        //   // text: "Hello world?", // plain text body
        //   html: `<p><b>Активируйте аккаунт, пройдя по этой ссылке</b></p><a href='${url}'>${url}</a>`
        // });
        // let info =
        // const dev = await bcrypt.compare("token", hash);
        // return await new Promise((res, rej) => {
        // });
      }
    }
  }
};

// @route WHATEVER api/job
// @decs ALL WHAT U WANT
// @access Public
const middleware = createApiMiddleware(API);
router.all("/:method", middleware);

export default router;
