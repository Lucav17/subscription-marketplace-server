// Importing Node packages required for schema
const mongoose = require("mongoose"),
  bcrypt = require("bcrypt-nodejs"),
  Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    attributes: {
      firstName: { type: String },
      lastName: { type: String },
      title: { type: String }
    },
    store: {
      storeName: { type: String },
      storeDescription: { type: String },
      image: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      categories: [{ type: String }],
      features: [{ type: String }]
    },
    social: {
      facebook: { type: String },
      instagram: { type: String },
      pinterest: { type: String }
    },
    plan: { type: String },
    listings: [{ type: String }]
    //STRIPE: {}
  },
  {
    timestamps: true
  }
);

//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
StoreSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// Method to compare password for login
StoreSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("Store", StoreSchema);
