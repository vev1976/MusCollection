
try {
    var Band   = require("./band");
    var Member = require("./member");
    var Album  = require("./album");
    var Style  = require("./style");
    var Song   = require("./song");
} catch (err) {
    throw (err);
}

var init = function(db) {
    var model = {};
    try {
        model = {
            Band: Band.init(db),
            Member: Member.init(db),
            Album: Album.init(db),
            Style: Style.init(db),
            Song: Song.init(db)
        };
        
    } catch (err) {
//        logger.error (err);
        throw (err);
    }
    
    return model;
};

module.exports = {
    init: init
};
