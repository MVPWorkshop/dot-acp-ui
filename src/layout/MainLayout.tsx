import { Outlet, useSearchParams } from "react-router-dom";
import SeoHelmet from "../components/atom/SeoHelmet";
import Footer from "../components/organism/Footer";
import HeaderTopNav from "../components/organism/HeaderTopNav";
import { useEffect } from "react";

const MainLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const networkSession = window.sessionStorage.getItem("network");

  useEffect(() => {
    if (networkSession && searchParams) {
      setSearchParams({ network: networkSession });
    }
  }, []);
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
