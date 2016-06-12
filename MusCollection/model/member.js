var Sequelize = require("sequelize");

module.exports = {
    init: function(db) {
        var E = db.define("member", {
            id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            firstName: {type: Sequelize.STRING(64), allowNull: false, field: "first_name"},
            lastName: {type: Sequelize.STRING(64), allowNull: false, field: "last_name"},
            bandID: {type: Sequelize.INTEGER, allowNull: false, field : "band_id"},
            birthday: {type: Sequelize.DATEONLY, allowNull: true, field: "birthday"},
            memberFrom: {type: Sequelize.DATEONLY, allowNull: false, field: "member_from"},
            memberTo: {type: Sequelize.DATEONLY, allowNull: true, field: "member_to", defaultValue:"9999-01-01"},
            profession: {type: Sequelize.STRING(128), allowNull: true}
        }, {
            schema: "dbo",
            tableName: "member",
            timestamps: false

        });
        return E;
    }
};