var express = require('express');
var router = express.Router();

const scheduleEvent = require('../lib/scheduleEvent');
const scheduleEventResource = require('../lib/scheduleEventResource');
const createRoom = require('../lib/createRoom');
const joinRoom = require('../lib/joinRoom');
const KalturaClientFactory = require('../lib/kalturaClientFactory');
const addMedia = require('../lib/mediaEntry');

const { v4: uuidv4 } = require('uuid');

/* POST */
router.post('/', async function (req, res, next) {
  let adminKs = await KalturaClientFactory.getKS(process.env.KALTURA_USER_ID);

  //create room aka resource
  let room = await createRoom(adminKs, req.body.question);

  //create mediaentry as template

  let ourUUID = uuidv4();
  let media = await addMedia(adminKs, ourUUID);
  res.cookie('sched_uuid', ourUUID);

  //create schedule event
  let now = Math.floor(Date.now() / 1000);
  let end = now + 10800;
  let event = await scheduleEvent(adminKs, req.body.question, now, end,media.id);

  //associate room with event
  await scheduleEventResource(adminKs, event.id, room.id);



  let adminRoom = joinRoom(event.id, null,
    true,
    "Admin Name",
    "Admin Last Name",
    "admin@admin.admin");

  let studentRoom = joinRoom(event.id, null,
    false,
    req.body.firstName,
    req.body.lastName,
    req.body.email);

  Promise.all([adminRoom, studentRoom]).then((values) => {
    res.render('start', {
      adminUrl: values[0],
      studentUrl: values[1]
    });
  });
});

module.exports = router;
