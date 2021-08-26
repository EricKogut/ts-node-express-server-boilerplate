const fs = require('fs');
const path = require('path');
const  User = require("../../models/User.model");
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.resolve(__dirname+'/id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

//////////////////////
//This function will be use to verify the key of the


//Options object needed to implement the jwt strategy
const options = {
  //Expecting that we have JWT in the AUTH header
  //Authorization Bearer <token> (needs the space and everything exactly)
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //Either pass a symetric token, (stored in env), SINCE WE ARE USING rs256 we pass our purblic key
  //We pass pubic since we ar verifying here (signed with private, verified with public)
  secretOrKey: PUB_KEY,
  //Declaring how we are verfifying
  algorithms: ['RS256']
};


//Creating modular strategy
//Takes options and callback function
const strategy = new JwtStrategy(options, (payload, done) =>{
    //Withing the callback, there is no specific way we need to verfiy authentication
    //Here we can use any database, or any code logiuc
  //Since we are usign mongo, we use find one
  // We will assign the `sub` property on the JWT to the database ID of user
  // User.findOne({_id: payload.sub})
  // //Using promise
  // .then
  // ((user)=>{
  //   //Since we know that the  JWT is valid, we need to see if we have found a user in the database
  //   if(user){
  //     return done(null, user)
  //   }
  //   //If we don't find a user
  //   else{
  //     return (null, false)
  //   }
  //   /////NOTE: passport expects to see either a user object or false


  // })
  // .catch(err => done(err, null))

  return done(null, {"yeet":"yeet"})

});

module.exports = (passport) => {
  //Taking the passport from the index.js file, and putting in the strategy function
  passport.use(strategy);

}
