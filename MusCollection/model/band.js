
var Sequelize = require("sequelize");

module.exports = {
    init: function(db) {
        var E = db.define("band", {
            id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            name: {type: Sequelize.STRING(128), allowNull: false},
            styleID: {type: Sequelize.INTEGER, allowNull: true, field : "style_id"},
            creationDate: {type: Sequelize.DATEONLY, allowNull: true, field: "creation_date"},
            country: {type: Sequelize.STRING(2), allowNull: true},
        }, {
            schema: "dbo",
            tableName: "band",
            timestamps: false

        });
        return E;
    }
};
