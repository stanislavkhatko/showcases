const Parse = require('parse/node');

Parse.serverURL = process.env.PARSE_SERVER_URL;

Parse.initialize(
  process.env.PARSE_ID,
  process.env.PARSE_JSKEY,
  process.env.PARSE_MASTERKEY
);

Parse.User.enableUnsafeCurrentUser()
Parse.secret = process.env.PARSE_SECRET;

module.exports = Parse;
