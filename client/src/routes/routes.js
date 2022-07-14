import { landing_routes } from "./landing/landing_routes";
import { register_routes } from "./register/register_routes";
import { login_routes } from "./login/login_routes";
import { forgot_password_routes } from "./forgot_password/forgot_password_routes";
import { track_routes } from "./track/track_routes";
import { admin_routes } from "./admin/admin_routes";
import { user_routes } from "./user/user_routes";
import { about_routes } from "./help/help_routes";

export const routes = [
  register_routes,
  admin_routes,
  user_routes,
  landing_routes,
  track_routes,
  login_routes,
  forgot_password_routes,
  about_routes,
];
