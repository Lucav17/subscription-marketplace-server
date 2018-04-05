const stripeConfig = require('../configs/stripe'),
    axios = require('axios');

//On page load, call this post function to verify user and then redirect
exports.verifyConnection = (req, res) => {
    axios.post('https://connect.stripe.com/oauth/token', {
        client_secret: stripeConfig.STRIPE_LIVE_SECRET,
        code: req.body.code,
        grant_type: 'authorization_code'
    }).then(resp => {
        return res.status(200).send({result: resp})
    }).catch(e => {
        return res.status(400).send({err: e})
    })
};

