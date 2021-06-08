var kaltura = require('kaltura-client');
const KalturaClientFactory = require('./kalturaClientFactory');

async function getMedia(adminKs, entryId) {
    const client = await KalturaClientFactory.getClient(adminKs);

    let version = -1;
     // *** https://developer.kaltura.com/console/service/media/action/get
     return kaltura.services.media.get(entryId, version)
     .execute(client)
     .then(result => {
         console.log(result);
         return result;
     });
}

module.exports = getMedia;