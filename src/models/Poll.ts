import mongoose from "mongoose";
import getRandomInt from "../util/random";
import nouns from "../util/nouns.json";

export type PollModel = mongoose.Document & {
    title: string,
    earliestDate: Date,
    choices: PollChoice[],
    earliestTimeOfDay: number,
    latestTimeOfDay: number,
    duration: number,
    voters: Voter[],
    getAPIObject: () => object;
    readablePath: () => void;
};

const readablePath = function() {
    const randomInts: number[] = [];
    const chosenNouns: string[] = [];
    for (let i = 0; i < 3; i++) {
        let rand = -1;
        while (rand == -1 || randomInts.indexOf(rand) !== -1) {
            rand = getRandomInt(1, nouns.length - 1);
        }
        randomInts.push(rand);
        let noun = nouns[rand];
        noun = noun.charAt(0).toUpperCase() + noun.slice(1);
        chosenNouns.push(noun);
    }
    return chosenNouns.join("");
};

export type PollChoice = {
    startTimestamp: Date,
    endTimestamp: Date,
    voters: Voter[]
};

export type Voter = {
    name: string
};

export interface PollAPIObject {
    title: string;
    readablePath?: string;
    earliestDate?: Date;
    choices?: number[][];
    voters?: string[];
    duration?: number;
    earliestTimeOfDay: number;
    latestTimeOfDay: number;
}

const pollSchema = new mongoose.Schema({
    title: String,
    duration: Number,
    earliestDate: {
        type: Date,
        default: Date.now
    },
    earliestTimeOfDay: {
        type: Number,
        default: 9,
    },
    latestTimeOfDay: {
        type: Number,
        default: 23,
    },
    choices: Array,
    voters: Array,
    readablePath: {
        type: String,
        default: readablePath,
        unique: true
    }
}, { timestamps: true });

pollSchema.methods.getAPIObject = function() {
    const APIObject: PollAPIObject = {
        title: this.title,
        readablePath: this.readablePath,
        duration: this.duration,
        earliestDate: this.earliestDate,
        earliestTimeOfDay: this.earliestTimeOfDay,
        latestTimeOfDay: this.latestTimeOfDay,
        choices: this.choices,
        voters: this.voters
    };
    return APIObject;
};

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
