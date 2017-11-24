let mongoose = require('mongoose');
let ObjectDB = require('../models/object');

/*
 * POST /object to save a new object.
 */
/**
 * Example:
    Method: POST
    Endpoint: /object
    Body: JSON: {mykey : value1}
    Time: 6.00 pm
    Response: {"key":"mykey", "value":"value1", "timestamp": time } 
    //Where time is timestamp of the post request (6.00pm) .
*/
function postObject(req, res) {
    Object.keys(req.body).forEach(function(key){ 
        console.log('key', key, req.body[key]);
        var object = new ObjectDB();				// create a new instance of the model
            object.key = key;  				// set the key
            object.value = req.body[key];  	// set the value
        var now = Date.now();
            object.createdAt = now;
        var ts = Math.ceil(now / 1000) //timestamp

        object.save(function(err) {
            if (err)
                res.send(err);

            res.json({ key: key, value: req.body[key], timestamp: ts });
        });
    });
}

/*
 * GET /object route to retrieve all the objects.
 */
function getObjects(req, res) {
    ObjectDB.find(function(err, objects) {
        if (err)
            res.send(err);
        //If no errors, send them back to the client
        res.json(objects.map(d => {
            var dt = new Date(d.createdAt);
            return {
                key: d.key, 
                value: d.value,
                ts: new Date(d.createdAt)/1000,
                tsc: Math.ceil(new Date(d.createdAt) /1000),
                minutes: [dt.getHours(),dt.getMinutes()].join(':')
            }
        }));
    });
}

/*
 * GET /object/:key route to retrieve a object given its id.
 */
/**
 * Method: GET
    Endpoint: /object/mykey
    Endpoint: /object/mykey?timestamp=1440568980
    Response: {"value": value1 }
    */
function getObject(req, res) {
    var timestamp = req.query.timestamp;
    var criteria = {
        key: req.params.key
    }
    if(req.query.timestamp) {
        var ts = new Date(timestamp*1000)
        criteria.createdAt = { $lte: ts };
    }
    ObjectDB.findOne(criteria, function(err, data) {
        if (err)
            res.send(err);

        res.json(data);
    }).sort({createdAt: -1}).limit(1);
}

//export all the functions
module.exports = { postObject, getObjects, getObject };