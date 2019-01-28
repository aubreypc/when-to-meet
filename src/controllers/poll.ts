import { Request, Response, NextFunction } from "express";
import { default as Poll, PollModel, PollChoice, Voter } from "../models/Poll";

const request = require("express-validator");

export let getPoll = (req: Request, res: Response) => {
    Poll.findOne({"readablePath": req.params.readablePath}, (err, poll: PollModel) => {
        if (err) {
            return res.send("it broke");
        }
        return res.send(poll.title);
    });
};

// temporary function for dev purposes.
// actual creation of polls should be a POST
export let getPollNew = (req: Request, res: Response) => {
    const poll = new Poll({
        title: req.params.title,
    });
    poll.save((err, p) => {
        return res.send(p.toObject().readablePath);
    });
};

export let postPollNew = (req: Request, res: Response) => {
    req.check(req.params.title, "Poll title is between 1 and 200 characters")
        .isLength({min: 1, max: undefined});
    req.check(req.params.duration, "Duration must be an integer between 10 and 1440")
        .isInt({min: 10, max: 1440});

    const errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        req.flash("errors", errors);
        return res.redirect("/poll/new");
    }

    const poll = new Poll({
        title: req.params.title,
        duration: req.params.duration,
        earliestTimeOfDay: req.params.earliestTimeOfDay,
        latestTimeOfDay: req.params.latestTimeOfDay
    });

    poll.save((err, p) => {
        console.log(p);
        return res.send(p.toObject());
    });
};
