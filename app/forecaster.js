'use strict';


module.exports = function(req, res) {

    console.log('New request for the forecaster:\n', req.body);

    if (req.body.request.type === 'IntentRequest' &&
               req.body.request.intent.name === 'GetLyrics') {

        if (req.body.request.intent.slots.Lyrics &&
            req.body.request.intent.slots.Lyrics.value) {

            getLyrics(req.body.request.intent.slots.Lyrics.value)
              .then(function(song) {
                console.log('responding to Lyric request for ' + req.body.request.intent.slots.Lyrics.value + ' with ', song);
                res.json(
                    buildResponse( {}, '<speak>' + song + '</speak>')
                );
              })
                .catch(function(err) {
                    res.json(
                        buildResponse( {}, '<speak>' + err + '</speak>', {}, true )
                    );
              });
        }

    } else {
        console.error('Intent not implemented: ', req.body);
        res.status(504).json({ message: 'Intent Not Implemented' });
    }

};


function buildResponse(session, speech, card, end) {
  console.log("Response returned was: ",speech);
    return {
        version: VERSION,
        sessionAttributes: session,
        response: {
            outputSpeech: {
                type: 'SSML',
                ssml: speech
            }
        }
    };
}

function getLyrics(lyrics){
  var api = require('genius-api');
  var genius = new api("dXif373aX9mzBQRvThIKy5Jm25hcvzaGjz9FA7_TVuZp3Ke5DKuCCJC1eK17urdv");

  return new Promise(function(resolve, reject) {
    //search
    genius.search(lyrics).then(function(response) {
      console.log('hits', response.hits[0].result.full_title);
       resolve( {response.hits[0].result.full_title});
    });
  }
}
