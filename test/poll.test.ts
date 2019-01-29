import app from "../src/app";
import request from "supertest";
import { default as Poll, PollChoice, PollAPIObject } from "../src/models/Poll";
import { generatePollChoices } from "../src/controllers/poll";

const chai = require("chai");
const expect = chai.expect;

describe("Poll API tests", () => {
    it("should create a poll and return expected getAPIObject result", (done) => {
        const createPoll: PollAPIObject = {
            title: "poll.test.ts",
            duration: 60,
            earliestTimeOfDay: 9,
            latestTimeOfDay: 11,
        };
        Poll.create(createPoll, (err, poll) => {
            const APIObject = poll.getAPIObject();
            const expected: PollAPIObject = {
                ...createPoll,
                earliestDate: APIObject.earliestDate,
                readablePath: APIObject.readablePath,
                choices: APIObject.choices,
                voters: APIObject.voters
            };
            expect(APIObject).to.eql(expected); // note: .eql() deep compares objects
            done();
        });
    });

    it("should create a poll and fetch its JSON representation via GET", (done) => {
        const createPoll = {
            title: "poll.test.ts",
            duration: 60,
            earliestTimeOfDay: 9,
            latestTimeOfDay: 11
        };
        Poll.create(createPoll, (err, poll) => {
            return request(app)
                .get(`/poll/${poll.readablePath}`)
                .expect(200)
                .then(res => {
                    const expected = poll.getAPIObject();
                    // TODO: fix this test by properly retrieving req.body.earliestDate as a Date rather than string
                    expect(res.body).to.eql(expected);
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
