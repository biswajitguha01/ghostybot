const { model, Schema, models } = require("mongoose");

const userSchema = new Schema({
  user_id: { type: String, required: true },
  guild_id: { type: String, required: true },
  inventory: { type: Array, default: null },
  money: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  daily: { type: Number, default: null },
  weekly: { type: Number, default: null },
  work: { type: Number, default: null },
  xp: { type: Number, default: 0 },
  blacklisted: { type: Boolean, default: false },
  afk: {
    type: Object,
    default: {
      is_afk: false,
      reason: null,
    },
  },
  mute: {
    type: Object,
    default: {
      muted: false,
      time: String,
      ends_at: Number,
      reason: String,
    },
  },
  reminder: {
    type: Object,
    default: {
      channel_id: null,
      ends_at: null,
      msg: null,
      on: false,
      time: null,
    },
  },
});

module.exports = models.User || model("User", userSchema);
