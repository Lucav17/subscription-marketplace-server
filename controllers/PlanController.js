const mongoose = require('mongoose'),
    Plan = require('../models/Plan');

exports.createPlan = (req, res) => {
    if(!req.body.planName || !req.body.planPrice || !req.body.planDetails || !req.body.planImage) {
        return res.status(400).send({err: "Please send all fields"});
    }
    let newPlan = new Plan({
        planName: req.body.planName,
        planDetails: req.body.planDetails,
        planImage: req.body.planImage,
        planPrice: req.body.planPrice
    });

    newPlan.save((err, plan) => {
        if(err) {
            return res.status(400).send({err: err});
        }
        return res.status(200).send({result: user})
    })
}

exports.deletePlan = (req, res) => {
    if(!req.body.id) {
        return res.status(400).send({err: "No ID provided"})
    }

    Plan.findByIdAndRemove({_id: req.body.id}, (err, result) => {
        if(err) {
            return res.status(400).send({err: err});
        }
        return res.status(200).send({result: result});
    })
}