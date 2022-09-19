const bcrypt = require("bcryptjs");

const users = [
   
  {
    username: "LeastGorgon671",
    email: "john@example.com",
    password: bcrypt.hashSync("default12", 10),
  },
  {
    username: "SubduralHematoma670",
    email: "jane@example.com",
    password: bcrypt.hashSync("default12", 10),
  },
];

module.exports = users;
