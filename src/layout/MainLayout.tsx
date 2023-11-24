import { Outlet } from "react-router-dom";
import SeoHelmet from "../components/atom/SeoHelmet";
import Footer from "../components/organism/Footer";
import HeaderTopNav from "../components/organism/HeaderTopNav";

const MainLayout = () => {
  return (
    <>
      <SeoHelmet />
      <HeaderTopNav />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
