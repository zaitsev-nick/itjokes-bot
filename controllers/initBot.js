import Tgfancy from 'tgfancy';

/**
 * @type {Tgfancy}
 */
let BOT;

// Closure
const setBot = (b) => (BOT = b);

const initializeBot = async () => {
  try {
    const token = process.env.TOKEN;
    let bot;
    // Run webHook only in production
    if (process.env.NODE_ENV === 'production') {
      bot = new Tgfancy(token, {
        tgfancy: {
          ratelimiting: {
            // number of times to retry a request before giving up
            maxRetries: 10, // default: 10
            // number of milliseconds to wait before retrying the
            // request (if API does not advise us otherwise!)
            timeout: 1000 * 60, // default: 60000 (1 minute)
            // maximum number of milliseconds to allow for waiting
            // in backoff-mode before retrying the request.
            // This is important to avoid situations where the server
            // can cause lengthy timeouts e.g. too long of a wait-time
            // that is causes adverse effects on efficiency and performance.
            maxBackoff: 1000 * 60 * 5, // default: 5 minutes
          },
        },
      });
      await bot.setWebHook(process.env.HEROKU_URL + bot.token);
    } else {
      bot = new Tgfancy(token, { polling: true });
    }
    await bot.on('webhook_error', (error) => {
      console.log(error.code); // => 'EPARSE'
    });
    console.log('** Server started in the ' + process.env.NODE_ENV + ' mode');
    setBot(bot);
  } catch (error) {
    console.error(error);
  }
};

export { initializeBot, BOT };
