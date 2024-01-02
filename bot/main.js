import { InlineKeyboard } from './logic/inline_keyboard.js';
import { Keyboard } from './logic/keyboard.js';
import { prisma } from './../controllers/prismaClient.js';
import { generateRandom } from './../helpers/utils.js';

/**
 * @param {Tgfancy} bot Object
 */
const runBot = (bot) => {
  try {
    /**
     * Ping bot when starting
     *
     */
    bot.getMe().then((me) => {
      console.log(`** Bot Is Running => ${me.username}(id: ${me.id})`);
    });

    /**
     * /START
     *
     */
    bot.onText(/^[\/!#]start$/i, async (message) => {
      const {
        chat: { id },
      } = message;
      const name = message.from.first_name || message.from.username;
      await bot.sendMessage(
        id,
        `Hello <a href="tg://user?id=${message.from.id}">${name}</a> 👋`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            keyboard: Keyboard.home,
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    });

    bot.onText(/Show me a random joke/i, async (message) => {
      const { message_id } = message;
      const { text } = message;
      const {
        chat: { id },
      } = message;
      await bot.deleteMessage(id, message_id);
      const lastRecord = await prisma.jokes.findMany({
        take: 1,
        orderBy: {
          id: 'desc',
        }
      })
      // Generate random id
      const randomID = generateRandom(21, lastRecord[0].id);
      const joke = await prisma.jokes.findUnique({
        where: {
          id: randomID
        },
      })
      await bot.sendPhoto(id, joke.image_url, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: InlineKeyboard.secondMenu,
        }
      });
    });

    /**
     * callbackQuery - represents an incoming callback query
     * from a callback button in an inline keyboard
     *
     */
    bot.on('callback_query', async (callbackQuery) => {
      const {
        message: { chat, message_id, text },
      } = callbackQuery;
      // Handle buttons clicks / commands
      switch (callbackQuery.data) {
        case 'random':
          await bot.deleteMessage(chat.id, message_id);
          const lastRecord = await prisma.jokes.findMany({
            take: 1,
            orderBy: {
              id: 'desc',
            }
          })
          // Generate random id
          const randomID = generateRandom(21, lastRecord[0].id);
          const joke = await prisma.jokes.findUnique({
            where: {
              id: randomID
            },
          })
          await bot.sendPhoto(chat.id, joke.image_url, {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: InlineKeyboard.secondMenu,
            }
          });
          break;
        default:
      }
      // Answer on each incoming callback
      await bot.answerCallbackQuery(callbackQuery.id, {});
    });
  } catch (error) {
    console.log(error);
  }
};

export { runBot };
