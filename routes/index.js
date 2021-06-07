var express = require('express');
var router = express.Router();
var createRoom = require('../lib/createroom');
var joinRoom = require('../lib/joinroom');
var listMedia = require('../lib/mediaList');
var kaltura = require('kaltura-client');
const KalturaClientFactory = require('../lib/kalturaClientFactory');


/* GET home page. */
router.get('/', async function (req, res, next) {
  let adminKs = await KalturaClientFactory.getKS(process.env.KALTURA_USER_ID);
  let media = await listMedia(adminKs, req.cookies.sched_uuid);
  console.log("MK:" + media.totalCount);

  res.render('index', { sched: "asd" });
});

/* POST */
router.post('/', async function (req, res, next) {
  let adminKs = await KalturaClientFactory.getKS(process.env.KALTURA_USER_ID);

  let adhocUUID = uuidv4();
  res.cookie('adhoc_uuid', adhocUUID);

  createRoom(adminKs, req.body.question + " " + adhocUUID).then(room => {
    console.log("creating room with: " + room);
    let adminRoom = joinRoom(null, room.id,
      true,
      "Adminx Name",
      "Adminx Last Name",
      "admi3n@admin.admin");

    let studentRoom = joinRoom(null, room.id,
      false,
      req.body.firstName,
      req.body.lastName,
      req.body.email);

    Promise.all([adminRoom, studentRoom]).then((values) => {
      console.log("ALL");
      console.log(values);
      console.log("ALLD");
      res.render('start', {
        adminUrl: values[0],
        studentUrl: values[1]
      });
    });
  });
});

module.exports = router;
