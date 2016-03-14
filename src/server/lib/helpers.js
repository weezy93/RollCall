// ensureAuthenticated() - protect routes that require authenticated;
// loginRedirect() = checks req.user is true, if so, redirects to the main route.
var bcrypt = require('bcrypt');

function ensureAuthenticated(req, res, next) {
  // check if user is authenticated.
    // if not, redirect to login.
    // otherwise, call next();
    if (!req.user) {
      res.redirect('/login');
    } else {
      return next();
    }
}

function loginRedirect(req, res, next) {
  // check if user is authenticated.
    // if not, call next();
    // otherwise, redirect to main route;
    if (req.user) {
      res.redirect('/');
    } else {
      return next();
    }
}

function hashing(password) {
  // add Promises;
  return bcrypt.hashSync(password, 10);


  // var newPassword;
  // bcrypt.hash(password, 10, null, function(err, hash) {
  //   newPassword = hash;
  // });
  // return newPassword;
}

function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
  ensureAuthenticated: ensureAuthenticated,
  loginRedirect: loginRedirect,
  hashing: hashing,
  comparePassword: comparePassword
};
