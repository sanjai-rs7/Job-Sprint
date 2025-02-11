import ContainerComponent from "@/components/ContainerComponent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="">
      <Header />
      <ContainerComponent className="">
        <main className="">
          <Outlet />
        </main>
      </ContainerComponent>
      <Footer />
    </div>
  );
};

export default MainLayout;
