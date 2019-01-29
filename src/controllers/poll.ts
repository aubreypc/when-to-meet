import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { default as Poll, PollModel, PollChoice, Voter } from "../models/Poll";

const request = require("express-validator");

export let getPoll = (req: Request, res: Response) => {
    Poll.findOne({"readablePath": req.params.readablePath}, (err, poll: PollModel) => {
        if (err) {
            return res.send("it broke");
        }
        return res.json(poll);
    });
};

// temporary function for dev purposes.
// actual creation of polls should be a POST
export let getPollNew = (req: Request, res: Response) => {
    const poll = new Poll({
        title: req.params.title,
    });
    poll.save((err, p) => {
        return res.json(p);
    });
};

export let postPollNew = (req: Request, res: Response) => {
    const newPoll = req.body;

    // TODO: Validate POST request
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.status(500).json({"error": "Something went wrong with validation"});
    }

    // Generate all the possible timeslots to serve as poll choices
    newPoll.choices = generatePollChoices(newPoll.earliestTimeOfDay, newPoll.latestTimeOfDay, newPoll.duration);

    Poll.create(newPoll).then((p: PollModel) => {
        const resObject = {
            title: p.title,
            readablePath: p.readablePath,
            duration: p.duration,
            earliestTimeOfDay: p.earliestTimeOfDay,
            latestTimeOfDay: p.latestTimeOfDay
        };
        return res.json(resObject);
    });
};

export const generatePollChoices = (earliestTimeOfDay: number, latestTimeOfDay: number, duration = 30, numDays = 7) => {
    const nextDate = new Date();
    const choices: PollChoice[] = [];

    // Iterate through the poll's date range
    for (let d = 0;  d < 7; d++) {
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate.setHours(earliestTimeOfDay);
        nextDate.setMinutes(0);
        nextDate.setSeconds(0);

        // Create a poll choice beginning every `duration` minutes
        for (let m = 60 * earliestTimeOfDay; m < 60 * latestTimeOfDay; m += duration) {
            const choice: PollChoice = {
                startTimestamp: new Date(nextDate.getMinutes() + m),
                endTimestamp: new Date(nextDate.getMinutes() + m + duration),
                voters: []
            };
            choices.push(choice);
        }
    }
    return choices;
};
