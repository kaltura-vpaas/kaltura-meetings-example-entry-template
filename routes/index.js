var express = require('express');
var router = express.Router();

const kaltura = require('kaltura-client');
const scheduleEvent = require('../lib/scheduleEvent');
const scheduleEventResource = require('../lib/scheduleEventResource');
const createRoom = require('../lib/createRoom');
const joinRoom = require('../lib/joinRoom');
const KalturaClientFactory = require('../lib/kalturaClientFactory');
const addMedia = require('../lib/mediaEntry');

const { v4: uuidv4 } = require('uuid');

router.get('/', async function (req, res, next) {
  let adminKs = await KalturaClientFactory.getKS(process.env.KALTURA_USER_ID,
    { type: kaltura.enums.SessionType.ADMIN });

  //create room aka resource
  let room = await createRoom(adminKs, "Room Topic");

  //create mediaentry as template
  let media = await addMedia(adminKs, "The tag");

  //create schedule event
  let now = Math.floor(Date.now() / 1000);
  let end = now + 10800;
  let event = await scheduleEvent(adminKs, "Event Topic", now, end, media.id);

  //associate room with event
  await scheduleEventResource(adminKs, event.id, room.id);

  let adminRoom = await joinRoom(event.id, null,
    true,
    "Admin Name",
    "Admin Last Name",
    "admin@admin.admin");

  res.render('index', {
    adminUrl:adminRoom
  });

});

module.exports = router;