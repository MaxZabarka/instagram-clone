const getUser = async (userID) => {
  const user = await db.collection("users").findOne({$or: [{username:userID}, {email:userID}]});
  return user;

};

module.exports = getUser;
