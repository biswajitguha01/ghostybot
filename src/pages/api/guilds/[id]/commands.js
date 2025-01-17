import { getGuildById, updateGuildById } from "../../../../utils/functions";

export default async function handler(req, res) {
  const { method, query } = req;
  const guild = await getGuildById(query.id);

  switch (method) {
    case "POST": {
      const body = JSON.parse(req.body);

      if (!body.name || !body.response) {
        return res.json({
          error: "Please fill in all fields",
          status: "error",
        });
      }

      const commandName = body.name.toLowerCase();
      if (body.response.length > 1800) {
        return res.json({
          status: "error",
          error: "Command response cannot be longer than 1800 characters",
        });
      }

      if (guild.custom_commands?.find((x) => x.name === commandName))
        return res.json({
          error: "This command name already exists for this guild",
          status: "error",
        });

      if (req.bot.commands.has(commandName)) {
        return res.json({
          error: "This command name is already in use by the bot!",
          status: "error",
        });
      }

      await updateGuildById(query.id, {
        custom_commands: [...guild.custom_commands, { name: commandName, response: body.response }],
      });

      return res.json({ status: "success" });
    }
    case "PUT": {
      const body = JSON.parse(req.body);
      const { type, name } = body;

      if (!type || !name) {
        return res.status(400).json({ status: "error" });
      }

      if (type === "enable") {
        await updateGuildById(query.id, {
          disabled_commands: guild.disabled_commands.filter((c) => c !== name.toLowerCase()),
        });
      } else if (type === "disable") {
        await updateGuildById(query.id, {
          disabled_commands: [...guild.disabled_commands, name],
        });
      } else {
        return res.status(400).json({ status: "error", error: "invalid type" });
      }

      return res.json({ status: "success" });
    }
    case "DELETE": {
      const filtered = guild.custom_commands?.filter(
        (cmd) => cmd.name.toLowerCase() !== query.name.toLowerCase()
      );

      await updateGuildById(query.id, { custom_commands: filtered });

      return res.json({
        status: "success",
        message: `Successfully delete command: ${query.name}`,
      });
    }
    default: {
      return res.status(405).json({ error: "Method not allowed", status: "error" });
    }
  }
}
