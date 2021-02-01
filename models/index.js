const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose')

const dirs = fs.readdirSync(path.join(__dirname, "../schemas"));

const models = {};

dirs.forEach((item) => {
  const name = item.split(".")[0];
  const model = require(path.join(__dirname, "../schemas", item));
  if (!model.statics) {
    model = {
      fetch: async function () {
        return await this.find({}).sort("time").exec();
      },
      findById: async function (id) {
        return await this.findOne({ _id: id }).exec();
      },
    };
  }
  models[name] = mongoose.model(name.replace(/^\S/, (s) => s.toUpperCase()), model);
});


module.exports = models;
