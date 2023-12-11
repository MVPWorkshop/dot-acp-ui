import { Outlet, useSearchParams } from "react-router-dom";
import SeoHelmet from "../components/atom/SeoHelmet";
import Footer from "../components/organism/Footer";
import HeaderTopNav from "../components/organism/HeaderTopNav";
import { useEffect } from "react";

const MainLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const network = searchParams.get("network");
  const networkSession = sessionStorage.getItem("network");

  useEffect(() => {
    if (network) {
      sessionStorage.setItem("network", network);
    }
    if (networkSession) {
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
