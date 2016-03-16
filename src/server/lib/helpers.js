var queries = require('../routes/queries/queries.js');
var bcrypt = require('bcrypt');

function ensureAuthenticated(req, res, next) {
  queries.getEventById(req.params.eventId)
  .then(function(event) {
    if (!req.user || req.user.school_id != event[0].school_id) {
      res.redirect('/login');
    } else {
      return next();
    }
  });
}

function ensureAdmin(req, res, next) {
  console.log('User: ', req.user);
  console.log('Params: ', req.params);
  if (req.user.is_admin && req.user.school_id == req.params.schoolId) {
    return next();
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

function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}



module.exports = {
  ensureAuthenticated: ensureAuthenticated,
  loginRedirect: loginRedirect,
  ensureAdmin: ensureAdmin,
  comparePassword: comparePassword,
};
