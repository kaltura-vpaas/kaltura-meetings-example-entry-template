# Summary
This project is a proof of concept to show you how to programmatically use a template to supply metadata like Name, Tags, Category etc for the recording of a Kaltura Meeting.

# Video Walkthrough:



# Prerequisites

1. [Nodejs](https://nodejs.org/en/) 
2. [Kaltura VPaaS account](https://corp.kaltura.com/video-paas/registration?utm_campaign=Meetabout&utm_medium=affiliates&utm_source=GitHub). Once you've opened an account, send an email to <VPaaS@kaltura.com> to activate Meetings.

# How to Run
1. Copy env.template to .env and fill in your information
2. run npm install
3. npm run dev for developement
4. npm start for production

# Documentation

To start a meeting, the code from [kaltura-nodejs-template](https://github.com/kaltura-vpaas/kaltura-nodejs-template)  was copied into this project, and you can refer to [Kaltura Meetings Integration Guide](https://github.com/kaltura-vpaas/virtual-meeting-rooms ) for a comprehensive guide to the Meetings API. 

```javascript
  //create room aka resource
  let room = await createRoom(adminKs, "Room Topic");
```

The room is created in [createRoom.js](https://github.com/kaltura-vpaas/kaltura-meetings-example-entry-template/blob/main/lib/createRoom.js)

Take note of the `custom_rec_auto_start:1` parameter being used to automatically start recordings when the meeting starts. You can learn about other parameters for Kaltura Meetings at [Kaltura Meetings Integration Guide](https://github.com/kaltura-vpaas/virtual-meeting-rooms )

Next, a [mediaEntry](https://developer.kaltura.com/console/service/media) is created as the template. Almost all meta data from this template will be applied to the recording. 

```javascript
  //create mediaEntry as template
  let media = await addMedia(adminKs, "The name");
```

In this example, only the name field is being assigned, however almost all metadata will be applied from the template, like Tags, Category, etc, you can take a look at [mediaEntry.add](https://developer.kaltura.com/console/service/media/action/add) for a full list of meta data available. 

Next, an event is created starting now, and going 3 hours into the future.

```javascript
  //create schedule event
  let now = Math.floor(Date.now() / 1000);
  let end = now + 10800;
  let event = await scheduleEvent(adminKs, "Event Topic", now, end, media.id);
```

And `media.id` is passed into the event creation in [scheduleEvent.js](https://github.com/kaltura-vpaas/kaltura-meetings-example-entry-template/blob/main/lib/scheduleEvent.js) which is a wrapper for the [scheduleEvent.add](https://developer.kaltura.com/console/service/scheduleEvent/action/add
 ) API call. 

```javascript
async function scheduleEvent(adminKs, topicName, start, end, templateEntryId) {
  const client = await KalturaClientFactory.getClient(adminKs);
  let scheduleEvent = new kaltura.objects.RecordScheduleEvent();
  scheduleEvent.startDate = start;
  scheduleEvent.endDate = end;
  scheduleEvent.summary = topicName;
  scheduleEvent.recurrenceType = kaltura.enums.ScheduleEventRecurrenceType.NONE;
  scheduleEvent.templateEntryId = templateEntryId
 
  // *** https://developer.kaltura.com/console/service/scheduleEvent/action/add
  return kaltura.services.scheduleEvent.add(scheduleEvent)
```

While it is not required to schedule an event in order to host a Kaltura Meeting, the only way to apply a template to a recording is via `scheduleEvent.add`  and since this event is schedule to start now, effectively, this technique can be used for adhoc, on-the-fly meetings as well. 

As you see, the `id` of the `mediaEntry` that was created previously is passed into `scheduleEvent` and used as the `templateEntryId` 

Now in `index.js`  the `room`, `mediaEntry` template and `event` have been created, next:

```javascript
  //associate room with event
  await scheduleEventResource(adminKs, event.id, room.id);

  let adminRoom = await joinRoom(event.id, null,
    true,
    "Admin Name",
    "Admin Last Name",
    "admin@admin.admin");
```

The room is associated with the event via [scheduleEventResource](https://developer.kaltura.com/console/service/scheduleEventResource/action/add
 ) and finally, a url for the admin to join the event is created and passed to [index.ejs](https://github.com/kaltura-vpaas/kaltura-meetings-example-entry-template/blob/main/views/index.ejs)

```javascript
  res.render('index', {
    adminUrl:adminRoom
  });
```

At this point, the user would start a meeting, record it, stop the recording and finally, the recording would be available in your [KMC](https://kmc.kaltura.com/index.php/kmcng/content/entries/list) with the metadata from your template, in this case its name would be "The name"

# How you can help (guidelines for contributors) 

Thank you for helping Kaltura grow! If you'd like to contribute please follow these steps:
* Use the repository issues tracker to report bugs or feature requests
* Read [Contributing Code to the Kaltura Platform](https://github.com/kaltura/platform-install-packages/blob/master/doc/Contributing-to-the-Kaltura-Platform.md)
* Sign the [Kaltura Contributor License Agreement](https://agentcontribs.kaltura.org/)

# Where to get help
* Join the [Kaltura Community Forums](https://forum.kaltura.org/) to ask questions or start discussions
* Read the [Code of conduct](https://forum.kaltura.org/faq) and be patient and respectful

# Get in touch
You can learn more about Kaltura and start a free trial at: http://corp.kaltura.com    
Contact us via Twitter [@Kaltura](https://twitter.com/Kaltura) or email: community@kaltura.com  
We'd love to hear from you!

# License and Copyright Information
All code in this project is released under the [AGPLv3 license](http://www.gnu.org/licenses/agpl-3.0.html) unless a different license for a particular library is specified in the applicable library path.   

Copyright © Kaltura Inc. All rights reserved.   
Authors and contributors: See [GitHub contributors list](https://github.com/kaltura/YOURREPONAME/graphs/contributors).  

### Open Source Libraries Used
