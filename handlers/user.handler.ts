const authUtils = require("../utils/auth/authUtils");
import { User } from "../models/User.model";

function handleUser(endpoint: String, body: Object) {
  switch (endpoint) {
    case "register":
      return handleUserRegistration(body);
  }
  return null;
}

function handleUserRegistration(data: any) {
  return new Promise(function (resolve, reject) {
    const inputEmail = data.email.replace(/[<={}()>/\\]/gi, "");
    const inputUsername = data.username.replace(/[<={}()>/\\]/gi, "");
    const inputPassword = data.password.replace(/[<={}()>/\\]/gi, "");
    const saltHash = authUtils.genPassword(inputPassword);

    //Creating a salt and a hash based on the plain text input of the user
    const salt = saltHash.salt;
    const password = saltHash.hash;

    //Creating a new user
    const newUser = new User({
      email: inputEmail,
      username: inputUsername,
      password: password,
      salt: salt,
    });

    ///////////////////////////////////////////////////////////
    //Making sure user does not exist and if so new result is created
    ///////////////////////////////////////////////////////////
    //Making sure user does not exist and if so new result is created
    User.findOne({ username: inputUsername }).then((result) => {
      if (result) {
        reject("User already exists");
      } else {
        try {
          newUser.save().then((user) => {
            //This function grabs the id off the user object
            const jwt = authUtils.issueJWT(user);

            //This returns an object with token and expireIn

            resolve({
              success: true,
              user: user,
              token: jwt.token,
              expiresIn: jwt.expiresIn,
            });
          });
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}

module.exports.handleUser = handleUser;
