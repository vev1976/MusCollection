var Sequelize = require("sequelize");

module.exports = {
    init: function(db) {
        var E = db.define("album", {
            id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            bandID: {type: Sequelize.INTEGER, allowNull: false, field : "band_id"},
            name: {type: Sequelize.STRING(256), allowNull: false, field: "name"},
            year: {type: Sequelize.INTEGER, allowNull: true}
        }, {
            schema: "dbo",
            tableName: "album",
            timestamps: false

        });
        return E;
    }
};

