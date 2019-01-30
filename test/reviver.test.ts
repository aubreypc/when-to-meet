import app from "../src/app";
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

    it("should pass regex .test()", (done) => {
        const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}\.\d{2,}Z$/;
        expect(dateFormat.test("2019-01-29T15:45:09.022Z"));
        done();
    });
});
