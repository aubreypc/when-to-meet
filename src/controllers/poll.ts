import { Request, Response, NextFunction } from "express";
import { default as Poll, PollModel, Voter } from "../models/Poll";

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
