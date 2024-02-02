const StreamingDao = require("../dataModel/streamingPlatformDao.js")
const Streaming = require("../dataModel/streamingPlatform");

module.exports = class StreamingService {
    constructor(db) {
        this.dao = new StreamingDao(db, "streamingPlatform")
    }

    insertService(data){
        return this.dao.insert(new Streaming(data.name))
    }
}