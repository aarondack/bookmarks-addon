var http = require('request');
var cors = require('cors');

module.exports = function (app, addon) {
  var hipchat = require('../lib/hipchat')(addon);

  // Root route. This route will serve the `addon.json` unless a homepage URL is
  // specified in `addon.json`.
  app.get('/',
    function(req, res) {
      // Use content-type negotiation to choose the best way to respond
      res.format({
        // If the request content-type is text-html, it will decide which to serve up
        'text/html': function () {
          res.redirect(addon.descriptor.links.homepage);
        },
        // This logic is here to make sure that the `addon.json` is always
        // served up when requested by the host
        'application/json': function () {
          res.redirect('/atlassian-connect.json');
        }
      });
    }
  );

app.get('/sidebar',
  addon.authenticate(),
  function(req,res) {
    addon.logger.info("Servicing /sidebar for ", req.clientInfo.clientKey);
    res.render('sidebar', { 
      identity: req.identity,
      message: req.message
    });
});


app.get('/dialog',
  addon.authenticate(),
  function(req,res) {
    res.render('dialog', {
      identity: req.identity,
      message: req.message
    });
});

  app.get('/glance',
    cors(),
    addon.authenticate(),
    function (req, res) {
        addon.logger.info("Servicing /glance for ", req.clientInfo.clientKey);
        var glancedata = {
            "label": {
                "type": "html",
                "value": "</strong> Bookmarks"
            }
        };
        console.log(glancedata);
        addon.logger.info(JSON.stringify(glancedata));
        res.send(glancedata);
    }
);

  // This is an example route that's used by the default for the configuration page
  app.get('/config',
    // Authenticates the request using the JWT token in the request
    addon.authenticate(),
    function(req, res) {
      // The `addon.authenticate()` middleware populates the following:
      // * req.clientInfo: useful information about the add-on client such as the
      //   clientKey, oauth info, and HipChat account info
      // * req.context: contains the context data accompanying the request like
      //   the roomId
      res.render('config', req.context);
    });

 // app.post('/hello',
 //    addon.authenticate(),
 //    function (req, res) {

 //      var roomId = req.identity.roomId;
 //      var userName = req.body.item.message.from.name;
 //      console.log("received a greeting from " + userName);

 //      hipchat.getRoom(req.clientInfo, roomId).then(function (data) {
 //        var room = data.body;

 //        //send a card
 //        var message = "Well, hey there " + userName;

 //        var card = {
 //            style: "application",
 //            url: "http://www.helloworld.com",
 //            id: "http://www.helloworld.com/1",
 //            icon: {
 //                url: "http://findicons.com/files/icons/175/halloween_avatar/256/mike.png"
 //            },
 //            title: "Hello World!",
 //            description: message,
 //            images: {
 //                 image : "http://assets1.ignimgs.com/2014/01/10/gremlinjpg-e97afc_610w.jpg"
 //            },
 //          };  

 //        hipchat.sendMessage(req.clientInfo, roomId, message,{},card)
 //          .then(function (data) {
 //            console.log(data);
 //            res.send(200);
 //          });
 //      });
 //    }
 //  );

        // hipchat.sendMessage(userName,roomId,clientInfo,{}, card);

  // This is an example route to handle an incoming webhook
  app.post('/webhook',
    addon.authenticate(),
    function(req, res) {
      hipchat.sendMessage(req.clientInfo, req.context.item.room.id, 'pong')
        .then(function(data){
          res.send(200);
        });
    }
  );

  // Notify the room that the add-on was installed
  addon.on('installed', function(clientKey, clientInfo, req){
    hipchat.sendMessage(clientInfo, req.body.roomId, 'The ' + addon.descriptor.name + ' add-on has been installed in this room');
  });

  // Clean up clients when uninstalled
  addon.on('uninstalled', function(id){
    addon.settings.client.keys(id+':*', function(err, rep){
      rep.forEach(function(k){
        addon.logger.info('Removing key:', k);
        addon.settings.client.del(k);
      });
    });
  });

};
