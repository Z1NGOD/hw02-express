const User = require("../../models/users");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");

const registration = async (req, res, next) => {
  try {
    req.body.avatarURL = await gravatar.url(req.body.email, {
      protocol: "https",
      s: "250",
    });
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const { id } = await User.create(req.body);
    const user = await User.findById(id, { _id: 0, password: 0, __v: 0 });
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else if (error.name === "Error") {
      res.status(400).json({ message: "Password required" });
    } else {
      res.status(409).json({ message: "email in use" });
    }
  }
};
module.exports = registration;
