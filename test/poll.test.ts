import request from "supertest";
import app from "../src/app";
import { default as Poll, PollChoice } from "../src/models/Poll";
import { generatePollChoices } from "../src/controllers/poll";

const chai = require("chai");
const expect = chai.expect;

describe("Creating a poll", () => {
    it("should create a poll and locate it by its readable path", (done) => {
        return Poll.create({title: "Test Poll"}, (err, poll) => {
            expect(poll).to.have.property("readablePath");
            // Look the poll up by the readablePath --- make sure we get the same thing back
            Poll.find({readablePath: poll.readablePath}, (_err, _poll) => {
                expect(poll._id).to.equal(_poll._id);
            });
            done();
        });
    });

    it("should create a new poll via POST request", (done) => {
        return request(app)
            .post("/poll/new")
            .send({
                title: "poll.test.ts",
                earliestTimeOfDay: 9,
                latestTimeOfDay: 21
            })
            .end(function(err, res) {
                expect(res.body).to.have.property("title");
                expect(res.body.title).to.equal("poll.test.ts");
                expect(res.body).to.have.property("duration");
                expect(res.body.duration).to.equal(30);
                expect(res.body).to.have.property("earliestTimeOfDay");
                expect(res.body.earliestTimeOfDay).to.equal(9);
                expect(res.body).to.have.property("latestTimeOfDay");
                expect(res.body.latestTimeOfDay).to.equal(21);
                expect(res.body).to.have.property("readablePath");

                // Verify that the poll was saved correctly
                const pollPath = res.body.readablePath;
                Poll.find({readablePath: pollPath}, (err, poll) => {
                    expect(poll).to.have.property("title");
                    expect(poll.title).to.equal("poll.test.ts");
                });
                done();
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

describe("Querying existing poll", () => {
    it("should create a poll and fetch its JSON representation via GET", (done) => {
        // TODO: write test
        done();
    });
});
