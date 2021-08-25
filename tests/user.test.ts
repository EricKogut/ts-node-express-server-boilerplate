// Getting server and testing deps
const server = require("../server.ts");
const supertest = require("supertest");
const requestWithSupertest = supertest(server);

describe("/", () => {
  it("GET /user should show all users", async () => {
    const res = await requestWithSupertest.get("/user/hello");
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("users");
  });
});

describe("loading express", function () {
  var server;
  beforeEach(function () {
    server = require("../server.ts");
  });
  it("responds to /", function testSlash(done) {
    supertest(server).get("/user/hello").expect(200, done);
  });
});
