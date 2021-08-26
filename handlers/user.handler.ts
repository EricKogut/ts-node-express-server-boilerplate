const authUtils = require("../utils/auth/authUtils");
import { User } from "../models/User.model";

// TODO: Add input verification!!!
// Currently being sanitized, but not verified :/

function handleUser(endpoint: String, body: Object) {
  switch (endpoint) {
    case "register":
      return handleUserRegistration(body);
    case "login":
      return handleUserLogin(body);
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

function handleUserLogin(data: any) {
  return new Promise(function (resolve, reject) {
    //Taking the username recieved from the login
    User.findOne({ username: data.username })
      .then((user) => {
        //Assuming we didnt find it, then return false (maybe not registers)
        if (!user) {
          resolve({ status: 401, response: "could not find user" });
        }

        //Otherwise, if it does exist, it uses util to verify the validity of the login
        // Function defined at bottom of app.js
        const isValid = authUtils.validPassword(
          data.password,
          user!.password,
          user!.salt
        );

        //If the user logged in succesfully
        if (isValid) {
          //Give it a token to attach to future requests
          const tokenObject = authUtils.issueJWT(user);
          console.log(tokenObject.expires, "is when it expires");
          //Attach it to the request
          resolve({
            status: 401,
            response: {
              success: true,
              token: tokenObject.token,
              expiresIn: tokenObject.expires,
              email: data.username,
              hash: user!.password,
            },
          });
        }

        //If the user give a wrong password
        else {
          resolve({ status: 401, response: "wrong passwoprd" });
        }
      })

      //Catching any errors with the
      .catch((err) => {
        reject(err);
      });
  });
}



module.exports.handleUser = handleUser;
