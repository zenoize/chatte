// import AccountData, { IAccountData } from "./models/AccountData";
// // import AccountType, { IAccountType, adminScope, workerUserScope, fullUserScope } from "./models/AccountType";
// import UserData, { IUserData } from "./models/UserData";
// import User, { IUser } from "./models/User";
// // import JobTag, { IJobTag } from "./models/JobTag";
// import Job, { IJob, JobStatus } from "./models/Jobs";
// import UserProfile, { IUserProfile } from "./models/UserProfile";

// // function foo() {
// //   for (let i = 0; i < 100000; i++) {}
// // }

// export default async function() {
//   // console.log("cat");
//   // foo().then(() => console.log("horse!"));
//   // console.log("dog");

//   // User.findOne({})
//   //   .populate("accountDataId userDaaId")
//   //   .exec()
//   //   .then(user => user.populate("test"))
//   //   .then(user => user.validate())
//   //   .catch(console.log);

//   // await createTags();
//   // await createAccountTypes();
//   // await createUsers();
//   // await createJobs();

//   // const value = await User.find({})
//   //   .populate("userProfileId accountDataId userDataId")
//   //   .findOne({
//   //     "accountDataId.username": {
//   //       $regex: /tya/
//   //     }
//   //   });
//   // console.log(value);

//   // const admins = await AccountData.find({ accountTypeId: (await AccountType.findOne({ scope: workerUserScope }).exec()).id }).exec();
//   // console.log(admins);
// }

// async function createUsers() {
//   await AccountData.deleteMany({}).exec();
//   const accountData: IAccountData[] = [
//     {
//       username: "poopaloop",
//       email: "poopa@gmail.loopa",
//       password: "superpuperhash",
//       avatarURL: "https://pp.userapi.com/c840225/v840225382/7839a/kQV6BpB5yAg.jpg",
//       accountTypeId: (await AccountType.findOne({ label: "admin" }).exec()).id
//     },
//     {
//       username: "rabotyaga",
//       email: "rabotyaga@gmail.loopa",
//       password: "superpuperhash",
//       avatarURL: "https://pp.userapi.com/c840225/v840225382/7839a/kQV6BpB5yAg.jpg",
//       accountTypeId: (await AccountType.findOne({ scope: workerUserScope }).exec()).id
//     }
//   ];
//   const accounts = await AccountData.insertMany(accountData.map(d => new AccountData(d))).catch(console.log);
//   if (!accounts) return;

//   await UserData.deleteMany({}).exec();
//   const userData: IUserData[] = [
//     {
//       dob: new Date(2000, 10, 24),
//       firstName: "Daniil",
//       secondName: "Bombenkov",
//       thirdName: "Sergeevich"
//     },
//     {
//       dob: new Date(1998, 2, 3),
//       firstName: "Poopich",
//       secondName: "Loopich",
//       thirdName: "DIedied"
//     }
//   ];
//   const users = await UserData.insertMany(userData.map(d => new UserData(d))).catch(console.log);
//   if (!users) return;

//   await UserProfile.deleteMany({}).exec();
//   const userProfile: IUserProfile[] = [
//     {
//       dor: new Date(1999, 20, 10)
//     },
//     {
//       dor: new Date(1998, 20, 10)
//     }
//   ];

//   const profile = await UserProfile.insertMany(userProfile.map(d => new UserProfile(d))).catch(console.log);
//   if (!profile) return;

//   await User.deleteMany({}).exec();

//   for (let i = 0; i < users.length; i++) {
//     const user: IUser = {
//       userProfileId: profile[i].id,
//       accountDataId: accounts[i].id,
//       userDataId: users[i].id,
//       jobTagIds: <any>await JobTag.find({ label: { $regex: /убо/ } })
//         .select("id")
//         .exec()
//     };
//     new User(user).save().catch(console.log);

//     // UserProfile
//   }
// }

// async function createJobs() {
//   await Job.deleteMany({}).exec();

//   // const worker = await User  .findOne({ "userDataId.firstName": "Daniil" }).exec();
//   // console.log(worker);

//   const worker = await User.findOne({ userDataId: (await UserData.findOne({ firstName: { $regex: /Dan/ } })).id });

//   const docs: IJob[] = [
//     {
//       label: "Выгул собаки",
//       description: "Выгулять Жужу, очень плохо себя чувствую",
//       tagIds: [(await JobTag.findOne({ label: { $regex: /выгул/ } }).exec()).id],
//       status: JobStatus.TAKED,
//       workerUserId: worker.id
//     }
//   ];
//   await Job.insertMany(docs.map(d => new Job(d))).catch(console.log);
// }

// async function createTags() {
//   await JobTag.deleteMany({}).exec();
//   const docs: IJobTag[] = [
//     {
//       label: "уборка"
//     },
//     {
//       label: "выгул животного"
//     },
//     {
//       label: "строительство",
//       color: "#3ffffd"
//     }
//   ];
//   await JobTag.insertMany(docs.map(d => new JobTag(d))).catch(console.log);
// }

// async function createAccountTypes() {
//   await AccountType.deleteMany({}).exec();
//   const docs: IAccountType[] = [
//     {
//       label: "admin",
//       scope: adminScope
//     },
//     {
//       label: "worker",
//       scope: workerUserScope
//     },
//     {
//       label: "full_user",
//       scope: fullUserScope
//     }
//   ];
//   await AccountType.insertMany(docs.map(d => new AccountType(d))).catch(console.log);
// }
