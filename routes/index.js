var express = require('express');
var router = express.Router();

const kaltura = require('kaltura-client');
const scheduleEvent = require('../lib/scheduleEvent');
const scheduleEventResource = require('../lib/scheduleEventResource');
const createRoom = require('../lib/createRoom');
const joinRoom = require('../lib/joinRoom');
const KalturaClientFactory = require('../lib/kalturaClientFactory');
const addMedia = require('../lib/mediaEntry');
var listMedia = require('../lib/mediaList');
var getMedia = require('../lib/mediaGet');

const { v4: uuidv4 } = require('uuid');

router.get('/', async function (req, res, next) {
  let adminKs = await KalturaClientFactory.getKS(process.env.KALTURA_USER_ID,
    { type: kaltura.enums.SessionType.ADMIN });

  //create room aka resource
  let room = await createRoom(adminKs, "Room Topic");

  //create a uuid to uniquely identify this media
  var adhocUUID = uuidv4();
  //remove - so it is searchable
  adhocUUID = adhocUUID.replace(/\-/g, '');

  //create mediaentry as template
  let media = await addMedia(adminKs, "The name");

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
    adminUrl: adminRoom,
    entryId:media.id
  });

});

router.get('/check', async function (req, res, next) {
  let adminKs = await KalturaClientFactory.getKS(process.env.KALTURA_USER_ID,
    { type: kaltura.enums.SessionType.ADMIN });

    let media = await getMedia(adminKs,req.query.entryId);

    //search for recording to display if available
    var recording = await listMedia(adminKs, req.query.entryId);
  
    if (recording.totalCount > 0) {
      recording = recording.objects[0];
    }
    //security for demo, you can delete in your app.
    delete media.partnerId;
    delete media.userId;
    delete media.creatorId;
    delete recording.partnerId;
    delete recording.userId;
    delete recording.creatorId;
  
    res.render('check', {
      time: Date(),
      template: JSON.stringify(media, null, 2),
      recording: JSON.stringify(recording, null, 2),
    });
  });

module.exports = router;