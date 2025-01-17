import { getGuildById, updateGuildById } from "../../../../utils/functions";

export default async function handler(req, res) {
  const { method, query } = req;
  const guild = await getGuildById(query.id);
  const lang = await req.bot.getGuildLang(query.id);

  switch (method) {
    case "POST": {
      const body = JSON.parse(req.body);

      if (!body.name || !body.price) {
        return res.json({
          error: "Please fill in all fields",
          status: "error",
        });
      }

      const isNumber = /^\d+$/;
      const price = Number(body.price);
      const name = body.name.toLowerCase();

      if (!isNumber.test(price)) {
        return res.status(400).json({
          error: lang.ECONOMY.MUST_BE_NUMBER,
          status: "error",
        });
      }

      if (guild.custom_commands?.find((x) => x.name === name))
        return res.status(400).json({
          error: lang.ECONOMY.ALREADY_EXISTS.replace("{item}", name),
          status: "error",
        });

      await updateGuildById(query.id, {
        store: [...guild.store, { name: name, price: price }],
      });

      return res.json({ status: "success" });
    }
    case "DELETE": {
      const filtered = guild.store?.filter(
        (item) => item.name.toLowerCase() !== query.name.toLowerCase()
      );

      await updateGuildById(query.id, { store: filtered });

      return res.json({
        status: "success",
        message: lang.ECONOMY.REMOVED_FROM_STORE.replace("{item}", query.name),
      });
    }
    default: {
      return res
        .status(405)
        .json({ error: "Method not allowed", status: "error" });
    }
  }
}
