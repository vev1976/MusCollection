var Sequelize = require("sequelize");

module.exports = {
    init: function(db) {
        var E = db.define("style", {
            id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            name: {type: Sequelize.STRING(256), allowNull: false, field: "name"}
        }, {
            schema: "dbo",
            tableName: "style",
            timestamps: false

        });
        return E;
    }
};

