const DUMMY_USERS = [
  {
    username: "max",
    email: "max@gmail.com",
    password: "123",
    avatarUrl:"https://i.picsum.photos/id/598/200/200.jpg?hmac=CGTNWD3Wfl8FFUMGok-Kj_SsE7Yc80U-jxup04hpB5k"
  },
  {
    username: "test",
    email: "test@gmail.com",
    password: "1234",
    avatarUrl:"https://i.picsum.photos/id/1038/200/200.jpg?hmac=H5HUzcu1mnVoapNKQB4L0bitWDrUhwiYuke8QItf9ng"
  },
];

const getUser = async (userID) => {
  const user = await db.collection("users").findOne({$or: [{username:userID}, {email:userID}]});
  return user;
  // return (user = DUMMY_USERS.find((user) => {
  //   return user.username === userID || user.email === userID;
  // }));
};
// setTimeout(() => {
//   getUser("test@gmail.com");
// }, 2000);
module.exports = getUser;
