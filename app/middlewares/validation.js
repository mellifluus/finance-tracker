const { body, validationResult } = require('express-validator');
const { storeMessages } = require('../util/messageManager');

exports.validateLoginInput = async (req, res, next) => {
  await body('username', 'Please input a valid username.')
    .trim()
    .isLength({ min: 4, max: 30 })
    .run(req);

  await body('password', 'Please input a valid password.')
    .isLength({ min: 8 })
    .run(req);

  const result = formatResult(req);

  if (Object.keys(result).length) {
    storeMessages(req, result);
    return res.redirect('/user/login');
  } else return next();
};

exports.validateRegisterInput = async (req, res, next) => {
  await body('username', 'Username length must be between 4 and 30 characters.')
    .trim()
    .isLength({ min: 4, max: 30 })
    .run(req);

  await body(
    'password',
    'At least 1x uppercase letter, 1x digit, 1x symbol, 8 characters long.'
  )
    .isStrongPassword()
    .run(req);

  await body('confirm_password', "Passwords don't match")
    .equals(req.body.password)
    .run(req);

  const result = formatResult(req);

  if (Object.keys(result).length) {
    storeMessages(req, result);
    return res.redirect('/user/register');
  } else return next();
};

exports.validateDeleteInput = async (req, res, next) => {
  await body('confirmation', 'Please input "DELETE" to delete your account.')
    .trim()
    .equals('DELETE')
    .run(req);

  const result = formatResult(req);

  if (Object.keys(result).length) {
    storeMessages(req, result);
    return res.redirect('/settings');
  } else return next();
};

exports.validateIncomeInput = async (req, res, next) => {
  await body('income', 'Please input a valid decimal value.')
    .trim()
    .isFloat({ min: 0.0 })
    .run(req);

  const result = formatResult(req);

  if (Object.keys(result).length) {
    storeMessages(req, result);
    return res.redirect('/settings');
  } else return next();
};

formatResult = (req) =>
  Object.fromEntries(
    Object.entries(validationResult(req).mapped()).map(([key, val]) => [
      key,
      val.msg,
    ])
  );

exports.validateExpenseInput = async (req, res, next) => {
  await body('amount', 'Please input a valid amount.')
    .trim()
    .isFloat({ min: 0.0 })
    .run(req);

  await body('categoryId').isInt({ min: 0, max: 5 }).run(req);

  await body('date').isDate().run(req);

  const result = formatResult(req);

  if ('amount' in result) {
    storeMessages(req, result);
    return res.redirect('/home');
  }

  return Object.keys(result).length
    ? next({ status: 500, msg: 'Internal error' })
    : next();
};
