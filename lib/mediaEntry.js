var kaltura = require('kaltura-client');
const KalturaClientFactory = require('./kalturaClientFactory');

async function addMedia(adminKs, tag) {
    const client = await KalturaClientFactory.getClient(adminKs);
    let entry = new kaltura.objects.MediaEntry();
    entry.tags = tag;
    entry.mediaType = kaltura.enums.MediaType.VIDEO;

     // *** https://developer.kaltura.com/console/service/media/action/add
    return kaltura.services.media.add(entry)
        .execute(client)
        .then(result => {
            console.log(result);
            return result;
        }).catch(e => {
            console.log("media add ERROR");
            console.log(e);
        });
}

module.exports = addMedia;