import app from "../src/app";
import request from "supertest";
import JSONDatesReviver from "../src/util/reviver";

const chai = require("chai");
const expect = chai.expect;

describe("JSON reviver to convert date/time strings into Date objects", () => {
    it("should transform a JSON date string", (done) => {
        const testObject = {
            date: new Date()
        };
        const stringRepr = JSON.stringify(testObject);
        const parsedWithReviver = JSON.parse(stringRepr, JSONDatesReviver);
        expect(parsedWithReviver).to.eql(testObject);
        done();
    });
});
