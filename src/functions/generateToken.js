const Token = require("../db/models/token_model");

module.exports = async (token_found, staff_id) => {
  if (token_found) {
    token_found.token = Math.random().toString(36).substring(1, 10);
    token_found.claimer_staff_id = staff_id;

    await token_found.save();
    return token_found;
  } else {
    const user_token = new Token({
      claimer_staff_id: staff_id,
      token: Math.random().toString(36).substring(1, 10),
    });
    await user_token.save();
    return user_token;
  }
};
