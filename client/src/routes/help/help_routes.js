import Help from "../../components/pages/Help/Help";
import About from "../../components/pages/Help/children/About";
import PrivacyAndPolicy from "../../components/pages/Help/children/PrivacyAndPolicy";
import Tutorials from "../../components/pages/Help/children/Tutorials";

export const about_routes = {
  path: "/help",
  component: Help,
  children: [
    { path: "about", component: About },
    { path: "tutorials", component: Tutorials },
    { path: "privacy-and-policy", component: PrivacyAndPolicy },
  ],
};
