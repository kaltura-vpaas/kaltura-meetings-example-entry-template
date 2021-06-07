var kaltura = require('kaltura-client');
const KalturaClientFactory = require('./kalturaClientFactory');

async function scheduleEvent(adminKs, topicName, start, end,templateEntryId) {
  const client = await KalturaClientFactory.getClient(adminKs);
  let scheduleEvent = new kaltura.objects.RecordScheduleEvent();
  scheduleEvent.startDate = start;
  scheduleEvent.endDate = end;
  scheduleEvent.summary = topicName;
  scheduleEvent.recurrenceType = kaltura.enums.ScheduleEventRecurrenceType.NONE;
  scheduleEvent.templateEntryId = templateEntryId
  

  // *** https://developer.kaltura.com/console/service/scheduleEvent/action/add
  return kaltura.services.scheduleEvent.add(scheduleEvent)
    .execute(client)
    .then(result => {
      console.log(result);
      return result;
    }).catch(e => {
      console.log("scheduleEvent ERROR");
      console.log(e);
    });
}

module.exports = scheduleEvent