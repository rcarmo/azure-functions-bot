'use strict';

var builder = require('botbuilder');
var connector = new builder.ChatConnector({
    appId: process.env.CHAT_CONNECTOR_APP_ID,
    appPassword: process.env.CHAT_CONNECTOR_APP_PASSWORD
});
var listener = connector.listen();
var bot = new builder.UniversalBot(connector, { persistConversationData: true });

bot.dialog('/', function (session) {
    session.sendTyping();
    session.send('%s said %s', session.userData.name, session.message.text);
});

bot.use(builder.Middleware.firstRun({ version: 1.0, dialogId: '*:/intro' }));
bot.dialog('/intro', [
    function (session) {
        builder.Prompts.text(session, "Hi! what's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog('Hi %s. Now tell me something', session.userData.name);
    }
]);

// Environment glue

if (process.env.FUNCTIONS_EXTENSION_VERSION) {
    // If we are inside Azure Functions, export the standard handler.
    module.exports = { default: listener }
} else {
    // Local server for testing
    var server = require('restify').createServer();
    server.post('/api/messages', listener);
    server.listen(process.env.port || process.env.PORT || 3978, function () {
        console.log('%s listening to %s', server.name, server.url);
    });
}