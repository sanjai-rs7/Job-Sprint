import ContainerComponent from "@/components/ContainerComponent";
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
    </div>
  );
};

export default MainLayout;
