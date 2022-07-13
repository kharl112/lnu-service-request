import About from "../../components/pages/About/About";
import SubAbout from "../../components/pages/About/children/SubAbout";
import PrivacyAndPolicy from "../../components/pages/About/children/PrivacyAndPolicy";
import Tutorials from "../../components/pages/About/children/Tutorials";

export const about_routes = {
  path: "/about",
  component: About,
  children: [
    { path: "", component: SubAbout },
    { path: "tutorials", component: Tutorials },
    { path: "privacy-and-policy", component: PrivacyAndPolicy },
  ],
};
