var kaltura = require('kaltura-client');
const KalturaClientFactory = require('./kalturaClientFactory');

async function scheduleEventResource(adminKs, eventId, roomId) {
  const client = await KalturaClientFactory.getClient(adminKs);
  let scheduleEventResource = new kaltura.objects.ScheduleEventResource();
  scheduleEventResource.eventId = eventId;
  scheduleEventResource.resourceId = roomId; 

  // *** https://developer.kaltura.com/console/service/scheduleEventResource/action/add
  return kaltura.services.scheduleEventResource.add(scheduleEventResource)
    .execute(client)
    .then(result => {
      console.log(result);
      return result;
    }).catch(e => {
      console.log("scheduleEventResource ERROR");
      console.log(e);
    });
}

module.exports = scheduleEventResource