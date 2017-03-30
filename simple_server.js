const express = require('express');
const app = express();
const fs = require('fs');

// for static assets
app.use(express.static(__dirname + '/dist'));

// for bundled js
app.use(express.static(__dirname + '/build'));

app.listen(3000, function () {
  console.log('React starter running on :3000');
});

app.get('/listConfigurations', function (req, res) {
    let numHosts = req.query.host;

    fs.readFile( __dirname + '/listConfigurations/configurations.json', 'utf8', function (err, data) {

        let dataJSON = JSON.parse(data);

        if ( numHosts > dataJSON.configurations.length ) {
            numHosts = dataJSON.configurations.length;
        }

        dataJSON.configurations = dataJSON.configurations.slice(0,numHosts);

        let dataStr = JSON.stringify(dataJSON);

        res.end( dataStr );
    });
})