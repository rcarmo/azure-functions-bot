'use strict'

const fs = require('fs'),
    SOLUTION_NAME = process.env.SOLUTION_NAME;

fs.writeFileSync("parameters.json", JSON.stringify({
    redisServerName: {
        value: SOLUTION_NAME 
    },
    functionAppName: {
        value: SOLUTION_NAME
    },
    storagePrefix: {
        value: SOLUTION_NAME.toLowerCase().replace(/\W+/g,'')
    }
}))
