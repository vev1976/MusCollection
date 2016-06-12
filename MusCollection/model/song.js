var Sequelize = require("sequelize");

module.exports = {
    init: function(db) {
        var E = db.define("song", {
            id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            name: {type: Sequelize.STRING(256), allowNull: false, field: "name"},
            year: {type: Sequelize.INTEGER, allowNull: true},
            bandID: {type: Sequelize.INTEGER, allowNull: false, field : "band_id"},
            albumID: {type: Sequelize.INTEGER, allowNull: true, field : "album_id"},
            longSec: {type: Sequelize.INTEGER, allowNull: true, field : "long_sec"},
            content: {type: Sequelize.TEXT("medium"), allowNull: true},
            mp3: {type: Sequelize.BLOB("medium"), allowNull: true}
        }, {
            schema: "dbo",
            tableName: "song",
            timestamps: false

        });
        return E;
    }
};

