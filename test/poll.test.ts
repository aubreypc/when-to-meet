import app from "../src/app";
import request from "supertest";
import { default as Poll, PollChoice } from "../src/models/Poll";
import { generatePollChoices } from "../src/controllers/poll";

const chai = require("chai");
const expect = chai.expect;

describe("Poll API tests", () => {
    it("should create a poll and fetch its JSON representation via GET", (done) => {
        Poll.create({title: "poll.test.ts"}, (err, poll) => {
            return request(app)
                .get(`/poll/${poll.readablePath}`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.property("title");
                    expect(res.body).to.have.property("earliestTimeOfDay");
                    expect(res.body).to.have.property("latestTimeOfDay");
                    done();
                });
        });
    });

    it("should reply to POST /poll/new with status code 200", (done) => {
        return request(app)
            .post("/poll/new")
            .send({"title": "poll.test.ts"})
            .expect(200, done);
    });

    it("should create poll via POST /poll/new", (done) => {
        // TODO: write test
        return request(app)
            .post("/poll/new")
            .send({"title": "poll.test.ts"})
            .then(res => {
                Poll.findOne(res.body, (err, p) => {
                    if (err) return done(err);
                    return done();
                });
            });
    });
});

describe("Generating poll choices", () => {
    const choices: PollChoice[] = generatePollChoices(0, 23);
    it("should return a nonempty PollChoice[]", (done) => {
        expect(choices).to.not.have.lengthOf(0);
        done();
    });

    it("should return a PollChoice[] of correct length", (done) => {
        expect(choices).to.have.lengthOf(322);
        done();
    });
});
