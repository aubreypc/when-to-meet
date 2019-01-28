import mongoose from "mongoose";
import getRandomInt from "../util/random";
import nouns from "../util/nouns.json";

export type PollModel = mongoose.Document & {
    title: string,
    dateCreated: Date,
    dateExpires: Date,
    choices: PollChoice[],
    earliestTimeOfDay: number,
    latestTimeOfDay: number,
    duration: number,
    voters: Voter[]
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


const pollSchema = new mongoose.Schema({
    title: String,
    dateCreated: {
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

// When a new poll is saved to the DB, populate it with PollChoices
/*pollSchema.pre("save", (next) => {
    if (this.isNew) {
        console.log("Populating entry");
        const nextDate: Date = this.dateCreated;
        const choices: PollChoice[] = [];

        // Iterate through the poll's date range
        for (let d = 0;  d < 7; d++) {
            nextDate.setDate(nextDate.getDate() + 1);
            nextDate.setHours(this.earliestTimeOfDay);
            nextDate.setMinutes(0);
            nextDate.setSeconds(0);

            // Create a poll choice beginning every `duration` minutes
            for (let m = 60 * this.earliestTimeOfDay; m < 60 * this.latestTimeOfDay; m += this.duration) {
                const choice: PollChoice = {
                    startTimestamp: new Date(nextDate.getMinutes() + m),
                    endTimestamp: new Date(nextDate.getMinutes() + m + this.duration),
                    voters: []
                };
                choices.push(choice);
            }
        }

        this.choices = choices;
        next();
    }
});*/

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
