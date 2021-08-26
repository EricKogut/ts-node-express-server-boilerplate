Hello, email eric for the mongo URI: eric.jkogut@gmail.com :)

Q:  How do I work this thing?
    
A:  npm install, npm run hireEric OR ts-node server.ts

    For login: localhost:5000/user/login -> body:{username:, password:} 
    For signup: localhost:5000/user/register -> body:{username:, email:, password:} 
    For checking token: localhost:5000/authorized -> header:{Authorization:"token STRING returned from login"}

Q:  How is this server structured? How do I add routes etc.?

A:  1. The server runs and imports the routes on a per route basis from server.ts:
    ie. import { userRouter } from "./routes/user.routes";
        app.use("/user", userRouter());
    
    2. Each routes file then receives the request, which is then forwarded to the according handler. The initial router expects a promise to be returned.
    ie. Building off of the previous example, "user.handler.ts" would be the handler.

    3. Depending on the case, the handler then either resolves or rejects the request, which then is handled back on the router side.

    The minimum recommendation is to at least create a new route file for each new collection.


Q:  Why ts and not js?

A:  Because we <3 strongly typed code. Although, there are some definite ts irregularities in the code and I shouldn't be using the "any" type in the handler.


Q:  How does the Authentication work, particularily with this server?

A:  The application makes use of JSON Web Tokens in its current state to authenticate the user. 
    This option is more complex than Session Tokens, however easier than OAuth.
    Passport is used as the middleware to handle the different possible Auth strategies available to a developer, to ensure a user has access to a resource.


Q:  What does it mean when a user "Logs in" and how do we ensure this user is authenticated in the future?

A:  1. Logins generate a JWT token, assuming the password and user combo are correct.
    2. The user then stores this token on the client side, whichever way is most convenient (cookie, local storage etc.) 
    3. Every http request that requires authentication, attach the JWT token to the header (Authorization parameter)
    4. Server receives request, and verifies the signature of the request
    5. If the signature is valid, the server decodes the token and retrieves the data

    *Note*: JWT is stateless, which is why we attach it to every request. The auth server simply does not store this state - required feature, not a bug of the structure. 


Q:  Why is there a passport file, I'm confused, I thought we were just using the library?
    
A:  We import the library, and use it for the created instance of the custom passport function.
    When we pass passport.auth, it calls the verify callback in the passport config (again, its used as middleware).


Q:  How do I make this server more secure?
    
A:  Well changing/creating your own public and private key are a good start. Also, you probably don't want to store it here like I did.
    OAuth and the user of federated providers would probably be your next step.