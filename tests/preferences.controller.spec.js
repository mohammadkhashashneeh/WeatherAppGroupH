const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const mongoose = require("mongoose");
const { User } = require("../models/User");
const { Preference } = require("../models/Preference");
const {
  getAllPreferencesCtrl,
  addPreferenceCtrl,
  updatePreferenceByIdCtrl,
  deletePreferenceByIdCtrl,
} = require("../Controller/Users/Preferences");
const app = require("../app");

chai.use(chaiHttp);
const { expect } = chai;

describe("Preferences Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("GET /api/preferences", () => {
    it("should return user's preferences", async () => {
      const userId = new mongoose.Types.ObjectId();
      const preferences = [
        { _id: new mongoose.Types.ObjectId(), city: "London", user: userId },
      ];
  
      const req = { user: { id: userId } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
  
      // Stub User.findById().populate() to return a valid user object with preferences
      sinon.stub(User, "findById").returns({
        populate: sinon.stub().resolves({ _id: userId, preferences }),
      });
  
      await getAllPreferencesCtrl(req, res);
  
      expect(res.json.calledWith(preferences)).to.be.true;
    });
  });
  

  describe("POST /api/preferences", () => {
    it("should add a new preference", async () => {
      const userId = new mongoose.Types.ObjectId();
      const newPreference = { _id: new mongoose.Types.ObjectId(), city: "Paris", user: userId };
      const preferences = []; // Mock preferences (empty or with some sample data)
  
      const req = { user: { id: userId }, body: { city: "Paris" } };
      const res = { 
        json: sinon.spy(), 
        status: sinon.stub().returnsThis() 
      };
  
      // Stub User.findById to return a valid user object with preferences
      sinon.stub(User, "findById").returns({
        populate: sinon.stub().resolves({ _id: userId, preferences })  // Return the user with preferences
      });
  
      // Stub Preference.prototype.save() 
      sinon.stub(Preference.prototype, "save").resolves(newPreference);
  
      await addPreferenceCtrl(req, res);
  
      // Check if response json was called with new preference
      expect(res.json.calledWith(newPreference)).to.be.true;
      
      // Check if the status code is 201 (created)
      expect(res.status.calledWith(201)).to.be.true;
    });
  });
  
  

  describe("PUT /api/preferences/:id", () => {
    it("should update a preference", async () => {
      const userId = new mongoose.Types.ObjectId();
      const preferenceId = new mongoose.Types.ObjectId();
      const updatedPreference = { _id: preferenceId, city: "Madrid" };
      const req = {
        user: { id: userId },
        params: { id: preferenceId.toString() },
        body: { newCity: "Madrid" },
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(User, "findById").resolves({ _id: userId });
      sinon.stub(Preference, "findOne").resolves({ _id: preferenceId, user: userId });
      sinon.stub(Preference, "findByIdAndUpdate").resolves(updatedPreference);

      await updatePreferenceByIdCtrl(req, res);

      expect(res.json.calledWithMatch(updatedPreference)).to.be.true;
    });
  });

  describe("DELETE /api/preferences/:id", () => {
    it("should delete a preference", async () => {
      const userId = new mongoose.Types.ObjectId();
      const preferenceId = new mongoose.Types.ObjectId();
      const req = { user: { id: userId }, params: { id: preferenceId.toString() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(User, "findById").resolves({ _id: userId });
      sinon.stub(Preference, "findById").resolves({ _id: preferenceId, user: userId });
      sinon.stub(Preference, "findByIdAndDelete").resolves({});

      await deletePreferenceByIdCtrl(req, res);

      expect(res.json.calledWith({ Message: "City has been Deleted" })).to.be.true;
    });
  });
});
