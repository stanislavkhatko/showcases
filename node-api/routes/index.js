const router = require('express').Router();
const photoProof = require('./photoProof');
const admin = require('./admin');
const {workspaceUser, userAuth, userRole} = require('../middlewares/middleware');

router.use('/api/*', userAuth, userRole, workspaceUser)

router.use('/', photoProof, admin);
module.exports = router;
