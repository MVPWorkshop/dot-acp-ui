import { Outlet } from "react-router-dom";
import HeaderTopNav from "../components/organism/HeaderTopNav";
import SeoHelmet from "../components/atom/SeoHelmet";

const MainLayout = () => {
  return (
    <>
      <SeoHelmet />
      <HeaderTopNav />
      <Outlet />
    </>
  );
};

export default MainLayout;
