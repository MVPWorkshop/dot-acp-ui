import { Outlet } from "react-router-dom";
import EmptyFiller from "../components/atom/EmptyFiller";
import SeoHelmet from "../components/atom/SeoHelmet";
import Footer from "../components/organism/Footer";
import HeaderTopNav from "../components/organism/HeaderTopNav";

const MainLayout = () => {
  return (
    <>
      <SeoHelmet />
      <HeaderTopNav />
      <Outlet />
      <EmptyFiller />
      <Footer />
    </>
  );
};

export default MainLayout;
