import express from 'express';
import bodyParser from 'body-parser';

const app = express();
// Helper to handle json response
app.use(bodyParser.json());

// Start the server
const server = app.listen(process.env.PORT, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Web server started at https://%s:%s', host, port);
});

// Listen for the webhook post from bot
const listenBot = (bot) => {
  app.post('/' + bot.token, (request, response) => {
    bot.processUpdate(request.body);
    response.sendStatus(200);
  });
};

export { listenBot };
