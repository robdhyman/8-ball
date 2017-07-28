// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());


// array of 8-ball answers, why are there so many more than eight?
var answers = [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes',
    'Better not tell you now',
    'It\'s.... Complicated',
];
var answer;

var bot = new builder.UniversalBot(connector, function (session) {
    var message = session.message.text;
    if (message) {
        //go right to fortune dialog
        session.beginDialog("fortune");
        
    } else {
        //what would you ask of the 8 ball dialog
        session.beginDialog("ask");
    }
    
    
});

bot.dialog('ask', [

    function (session) {
         builder.Prompts.text(session, 'Hello, what would you ask of the 8-ball?');
     },

    /**
    function (session) {
        builder.Prompts.text(session, 'Hello, what would you ask of the 8-ball?',
    
                speak: 'Hello, what outcome should 8-ball predict?',
                retrySpeak: 'Hello, please ask the 8-ball to predict an outcome',
                inputHint: builder.InputHint.expectingInput
          
            );}

    function (session, results) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Sorry, I need you to ask your fortune!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        session.endDialog('Your fortune:', results.response);
    **/
]);

bot.dialog('fortune', [
  
    //  "[user asks fortune"
    //8-ball is "shaken" and an answer is drawn at random
    function (session, results) {
        //builder.Prompts.number(session, 'Hmmm... ' + results.response);
        answer = answers[Math.floor(Math.random() * answers.length)];
        builder.Prompts.text(session, 'Hmmm... ' + answer);

    },

    // this funciton to be replaced by more robust solution in comment above
   function (session, results) {
        session.endDialog('Ask 8-ball for a fortune!');
    },


]);