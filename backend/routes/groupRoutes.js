const express = require('express');
const router = express.Router();
const { createGroup, getGroups, getGroup } = require('../controllers/groupController');

router.route('/').post(createGroup).get(getGroups);
router.route('/:id').get(getGroup);

module.exports = router;
