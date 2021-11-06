import ForgotPassword from "../../components/pages/ForgotPassword/ForgotPassword";
import Pass1 from "../../components/pages/ForgotPassword/contents/Pass1";
import Pass2 from "../../components/pages/ForgotPassword/contents/Pass2";
import Pass3 from "../../components/pages/ForgotPassword/contents/Pass3";

export const forgot_password_routes = {
  path: "/forgot/password",
  component: ForgotPassword,
  children: [
    { path: "step=1", component: Pass1 },
    { path: "step=2", component: Pass2 },
    { path: "reset/:encrypted_id", component: Pass3 },
  ],
};
