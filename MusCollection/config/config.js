

module.exports   = {
    dburi     : "mssql://techuser:123start@localhost:1433/test_vev",
    dboptions : {pool: {max: 10, min: 1, idle: 10000 },
                 timezone: "+00:00",
                 requestTimeout: 0    //infinity
                },
    dbupdatepath       : '/dbupdates',
    dbscript_delimiter : '$$'
};
 