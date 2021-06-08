var kaltura = require('kaltura-client');
const KalturaClientFactory = require('./kalturaClientFactory');

async function createMeetingRoom(adminKs, topicName) {
  const client = await KalturaClientFactory.getClient(adminKs);

  // Create the virtual room
  // *** https://developer.kaltura.com/console/service/scheduleResource/action/add
  let scheduleResource = new kaltura.objects.LocationScheduleResource();
  scheduleResource.name = topicName;
  scheduleResource.tags = "vcprovider:newrow,custom_rec_auto_start:1"; // mandatory tag

  return kaltura.services.scheduleResource.add(scheduleResource)
    .execute(client)
    .then(result => {
      console.log(result);
      return result;
    }).catch(e => {
      console.log("scheduleResource.add ERROR");
      console.log(e);
    });
}

module.exports = createMeetingRoom