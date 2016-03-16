var bcrypt = require('bcrypt');

function ensureAuthenticated(req, res, next) {
  if (!req.user || req.user.school_id != req.params.schoolId) {
    res.redirect('/login');
  } else {
    return next();
  }
}

function ensureAdmin(req, res, next) {
  if (req.user.is_admin) {
    next();
  } else {
    res.redirect('/' + req.params.schoolId);
  }
}

function loginRedirect(req, res, next) {
  if (req.user) {
    res.redirect('/');
  } else {
    return next();
  }
}

function hashing(password) {
  return bcrypt.hashSync(password, 10);
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
