const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { registerCtrl, loginCtrl, logoutCtrl } = require("../Controller/Users/Auth");
const app = require("../app");

chai.use(chaiHttp);
const { expect } = chai;

describe("Auth Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user and return success message", async () => {
      const req = { body: { username: "testuser", password: "password123" } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
        cookie: sinon.spy(),
      };

      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(bcrypt, "hash").resolves("hashedpassword");
      sinon.stub(User.prototype, "save").resolves();
      sinon.stub(jwt, "sign").returns("mocked_token");

      await registerCtrl(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ message: "Logged in" })).to.be.true;
    });

    it("should return 400 if username exists", async () => {
      const req = { body: { username: "testuser", password: "password123" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(User, "findOne").resolves({ username: "testuser" });

      await registerCtrl(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Username already exists" })).to.be
        .true;
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login user and return success message", async () => {
      const req = { body: { username: "testuser", password: "password123" } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
        cookie: sinon.spy(),
      };

      const hashedPassword = await bcrypt.hash("password123", 10);
      sinon
        .stub(User, "findOne")
        .resolves({ username: "testuser", password: hashedPassword });
      sinon.stub(bcrypt, "compare").resolves(true);
      sinon.stub(jwt, "sign").returns("mocked_token");

      await loginCtrl(req, res);

      expect(res.json.calledWith({ message: "تم الدخول بنجاح" })).to.be.true;
    });

    it("should return 400 for invalid credentials", async () => {
      const req = { body: { username: "testuser", password: "wrongpassword" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(User, "findOne").resolves(null);

      await loginCtrl(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Invalid credentials" })).to.be.true;
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should clear authToken cookie and return success message", async () => {
      const req = {};
      const res = {
        json: sinon.spy(),
        clearCookie: sinon.spy(),
      };

      await logoutCtrl(req, res);

      expect(res.clearCookie.calledWith("authToken")).to.be.true;
      expect(res.json.calledWith({ message: "Loggedout" })).to.be.true;
    });
  });
});
