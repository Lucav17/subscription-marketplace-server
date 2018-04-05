const mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  Store = require("../models/Store"),
  bcrypt = require("bcrypt-nodejs"),
  config = require("../configs/config");

//Generate a session token for the user upon sign in and sign up
function generateToken(user) {
  return jwt.sign(user, config.SECRET_KEY, {
    expiresIn: 2628000 // in seconds
  });
}

// Set user info from request
function setUserInfo(request) {
  return {
    _id: request._id,
    email: request.email
  };
}

//REGISTER USER
exports.register = function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // Return error if no user provided
  if (!email) {
    return res.status(422).send({ error: "You must enter an email address." });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: "You must enter a password." });
  }

  Store.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      res.send(400).json({ error: err });
    }
    if (existingUser) {
      return res
        .status(422)
        .send({ error: "That user address is already in use." });
    }
    let newStore = new Store({
      email: email,
      password: password
    });

    newStore.save(function(err, user) {
      if (err) {
        return res.send(400).json({ error: err });
      }
      let userInfo = setUserInfo(user);
      return res.status(201).json({
        token: "JWT " + generateToken(userInfo),
        user: userInfo
      });
    });
  });
};

//UPDATE STORE ATTRIBUTE
exports.updateStoreInformation = (req, res) => {
  if (
    !req.bod.storeName ||
    !req.bod.storeDescr ||
    !req.bod.storeImage ||
    !req.body.features ||
    !req.bod.address ||
    !req.bod.city ||
    !req.bod.state ||
    !req.bod.zipCode ||
    !req.bod.categories
  ) {
    return res.status(401).send({ err: "Missing Fields" });
  }

  Store.findByIdAndUpdate(
    { _id: req.body.userID },
    {
      "store.storeName": req.body.storeName,
      "store.storeDescription": req.body.storeDescr,
      "store.image": req.body.storeImage,
      "store.address": req.body.address,
      "store.city": req.body.city,
      "store.state": req.body.state,
      "store.zipCode": req.body.zipCode,
      "store.categories": req.body.categories,
      "store.features": req.body.features
    },
    (err, result) => {
      if (err) {
        return res.status(400).send({ err: err });
      }
      return res.status(200).send({ result: result });
    }
  );
};

//UPDATE PASSWORD EMAIL AND BASIC INFORMATION
exports.updateAccount = (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.title || req.body.userID) {
    return res.status(401).send({ err: "Missing Fields" });
  }
  if (req.body.password) {
    bcrypt.hash(req.body.password, null, null, (hashErr, hash) => {
      if (hashEerr) {
        return res.status(400).send({ err: "Password hash error" });
      }
      if (req.body.email) {
        Store.findOne({ email: req.body.email }, (err, existingEmail) => {
          if (err) {
            return res.status(400).send({ err: err });
          }

          if (existingEmail) {
            return res.status(422).send({ err: "existing email" });
          }

          store.findByIdAndUpdate(
            { _id: req.body.userID },
            {
              "attributes.firstName": req.body.firstName,
              "attributes.lastName": req.body.lastName,
              "attributes.title": req.body.title,
              email: req.body.email,
              password: hash
            }, (updateErr, storeResult) => {
                if(updateErr) {
                    return res.status(400).send({err: updateErr});
                }
                return res.status(200).send({storeResult});
            }
          );
        });
      } else {
        store.findByIdAndUpdate(
            { _id: req.body.userID },
            {
              "attributes.firstName": req.body.firstName,
              "attributes.lastName": req.body.lastName,
              "attributes.title": req.body.title,
              password: hash
            }, (updateErr, storeResult) => {
                if(updateErr) {
                    return res.status(400).send({err: updateErr});
                }
                return res.status(200).send({storeResult});
            }
          );
      }
    });
  }

  if(req.body.email) {
    store.findByIdAndUpdate(
        { _id: req.body.userID },
        {
          "attributes.firstName": req.body.firstName,
          "attributes.lastName": req.body.lastName,
          "attributes.title": req.body.title,
          email: req.body.email
        }, (updateErr, storeResult) => {
            if(updateErr) {
                return res.status(400).send({err: updateErr});
            }
            return res.status(200).send({storeResult});
        }
      );
  }

  Store.findByIdAndUpdate(
    { _id: req.body.userID },
    {
      "attributes.firstName": req.body.firstName,
      "attributes.lastName": req.body.lastName,
      "attributes.title": req.body.title
    },
    (err, result) => {
      if (err) {
        return res.status(400).send({ err: err });
      }
      return res.status(200).send({ result: result });
    }
  );
};

//LOGIN USER
exports.login = function(req, res) {
  Store.findOne(
    {
      email: req.body.email
    },
    function(err, store) {
      if (err) throw err;
      if (!store) {
        return res
          .status(401)
          .json({ message: "Authentication failed. User not found." });
      } else if (store) {
        store.comparePassword(req.body.password, (err, isMatch) => {
          if (!isMatch) {
            return res
              .status(401)
              .json({ message: "Authentication failed. Wrong password." });
          }
          let userInfo = setUserInfo(store);
          return res.json({
            token: "JWT " + generateToken(userInfo)
          });
        });
      }
    }
  );
};

//MIDDLEWARE FOR LOG IN REQUIRED FUNCTIONS
exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user!" });
  }
};
