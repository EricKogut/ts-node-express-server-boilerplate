

## Basic Node Server with Login
This will serve as a boilerplate for any future projects with a ME(jsLibrary)N stack.


#### Q:  How do I work this thing?
    
  [npm](https://www.npmjs.com/) install, [npm](https://www.npmjs.com/) run hireEric OR ts-node server.ts

|                |Route                          |Parameters passed                         |
|----------------|-------------------------------|-----------------------------|
| For login|`localhost:5000/user/login`            | body:{username:, password:}           |
|For signup          |`localhost:5000/user/register`            |body:{username:, email:, password:}         |
|For checking token          |`localhost:5000/user/authorized`|header:{Authorization:"token STRING returned from login"}|

---

#### Q:  How is this server structured? How do I add routes etc.?

 1. The server runs and imports the routes on a per route basis from server.ts:

    
```typescript
ie. 
import { userRouter } from "./routes/user.routes";
        app.use("/user", userRouter());
 ```
      
 2. Each route file then receives the request, which is then forwarded to the according handler. The initial router expects a promise to be returned.
 ie. Building off of the previous example, "user.handler.ts" would be the handler.

 3. Depending on the case, the handler then either resolves or rejects the request, which then is handled back on the router side. 

 The minimum recommendation is to at least create a new route file for each new collection.
 
---
#### Q:  Why ts and not js?

 Because we <3 strongly typed code. Although, there are some definite ts irregularities in the code and I shouldn't be using the "any" type in the handler.

---

#### Q:  How does the Authentication work, particularily with this server?

  The application makes use of [JSON Web Tokens](https://jwt.io/) in its current state to authenticate the user. 
    [Passport](http://www.passportjs.org/) is used as the middleware to handle the different possible Auth strategies available to a developer, to ensure a user has access to a resource.

---
#### Q: What does it mean when a user "Logs in" and how do we ensure this user is authenticated for future requests?

  1. Logins generate a JWT token, assuming the password and user combo are correct
    2. The user then stores this token on the client side, whichever way is most convenient
    3. Every http request that requires authentication, attach the JWT token to the header (Authorization parameter)
    4. Server receives request, and verifies the signature of the request
    5. If the signature is valid, the server decodes the token and retrieves the data

    *Note*: JWT is stateless, which is why we attach it to every request. 
---

#### Q:  Why is there a passport file, I'm confused, I thought we were just using the library?
    
We import the library, and use it for the created instance of the custom passport function.
   When we pass passport.auth, it calls the verify callback in the passport config (again, its used as middleware).

---
#### Q:  How do I make this server more secure?
    
Well changing/creating your own public and private key are a good start (you can do that with this server - /utils/authUtils/genKeyPair.js). Also, you probably don't want to store it here like I did. OAuth and the use of federated providers would probably be your next step?
   
   ---
