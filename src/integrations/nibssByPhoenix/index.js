const nibssAuth = require('./nibss.auth');
const nibssOnboarding = require('./nibss.onboarding');
const nibssBvn = require('./nibss.bvn');
const nibssNin = require('./nibss.nin');
const nibssAccount = require('./nibss.account');
const nibssTransaction = require('./nibss.transaction');

module.exports = {
    auth: nibssAuth,

    onboarding: nibssOnboarding,

    bvn: nibssBvn,

    nin: nibssNin,

    account: nibssAccount,

    transaction: nibssTransaction
};