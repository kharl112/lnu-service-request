const Token = require("../db/models/token_model");
const { nanoid } = require("nanoid");

module.exports = async (token_found, staff_id) => {
  if (token_found) {
    token_found.token = nanoid(9);
    token_found.claimer_staff_id = staff_id;

    await token_found.save();
    return token_found.token;
  } else {
    const user_token = new Token({
      claimer_staff_id: staff_id,
      token: nanoid(9),
      claimed: false,
    });
    await user_token.save();
    return user_token.token;
  }
};
