import ForgotPassword from "../../components/pages/ForgotPassword/ForgotPassword";
import Pass1 from "../../components/pages/ForgotPassword/contents/Pass1";
import Pass2 from "../../components/pages/ForgotPassword/contents/Pass2";
import Pass3 from "../../components/pages/ForgotPassword/contents/Pass3";

import store from "../../store/store";

export const forgot_password_routes = {
  path: "/:user_type/forgot/password",
  component: ForgotPassword,
  beforeEnter: (to, from, next) => {
    store.dispatch("message/defaultState", null);
    const { user_type } = to.params;
    return user_type === "faculty" || user_type === "admin"
      ? next()
      : next(false);
  },
  children: [
    { path: "step=1", component: Pass1 },
    { path: "step=2", component: Pass2 },
    { path: "reset/:encrypted_id", component: Pass3 },
  ],
};
