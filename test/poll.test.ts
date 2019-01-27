import request from "supertest";
import app from "../src/app";

const chai = require("chai");
const expect = chai.expect;

describe("POST /poll/new", () => {
    it("should create a new poll successfully", (done) => {
        return request(app)
            .post("/poll/new")
            .field("title", "New Poll for poll.test.ts")
            .field("duration", 30)
            .field("earliestTimeOfDay", 9)
            .field("latestTimeOfDay", 21)
            .expect(200)
            .end(function(err, res) {
                done();
            });
    });
});
