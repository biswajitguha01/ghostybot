const ms = require("ms");

module.exports = {
  name: "setreminder",
  description: "Set a reminder, the bot will ping you when the timer runs out",
  category: "reminder",
  requiredArgs: ["time", "message"],
  aliases: ["addreminder"],
  usage: "setreminder <time> <message>",
  async execute(bot, message, args) {
    const lang = await bot.getGuildLang(message.guild.id);
    const [time, ...rest] = args;
    const msg = rest.join(" ");

    const { user } = await bot.getUserById(message.author.id, message.guild.id);

    if (user.reminder.on === true) {
      return message.channel.send(lang.REMINDER.ALREADY_ON);
    }

    await bot.updateUserById(message.author.id, message.guild.id, {
      reminder: {
        ends_at: Date.now() + ms(time),
        msg,
        channel_id: message.channel.id,
        on: true,
        time,
      },
    });

    return message.channel.send(lang.REMINDER.SUCCESS);
  },
};
