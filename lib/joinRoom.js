var kaltura = require('kaltura-client');

function joinMeetingRoom(eventId, resourceId, admin, firstName, lastName, email) {
  const config = new kaltura.Configuration();
  config.serviceUrl = process.env.KALTURA_SERVICE_URL;
  const expiry = 86400;
  const type = kaltura.enums.SessionType.USER;
  const client = new kaltura.Client(config);

  // Set priveleges parameter for Kaltura Session (KS) generation.
  // For userContextual role:
  //   0 = admin
  //   3 = guest
  // Mandatory fields: role, userContextualRole, resourceId (or eventId)
  var userContextualRole, role;

  if (admin) {
    userContextualRole = "0";
    role = "adminRole";
  } else {
    userContextualRole = "3";
    role = "viewerRole"
  }

  var privileges = "role:" + role + ",userContextualRole:" + userContextualRole +
    ",firstName:" + firstName + ",lastName:" + lastName + ",email:" + email;

  if (eventId) {
    privileges += ",eventId:" + eventId;
  } else {
    privileges += ",resourceId:" + resourceId;
  }

  // Generate KS
  return kaltura.services.session.start(
    process.env.KALTURA_ADMIN_SECRET,
    email, // this is the user ID which uniquely identifies the user
    type,
    process.env.KALTURA_PARTNER_ID,
    expiry,
    privileges)
    .execute(client)
    .then(result => {
      // Pass the generated url back to caller in order for it to be rendered
      let roomUrl = "https://" + process.env.KALTURA_PARTNER_ID + ".kaf.kaltura.com/virtualEvent/launch?ks=" + result;
      console.log("JOIN URL: " + roomUrl);
      return roomUrl;
    }).catch(e => {
      console.log(e);
    });
}

module.exports = joinMeetingRoom