import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthHandler from "@/handlers/AuthHandler";

const PublicLayout = () => {
  return (
    <div className="w-full">
      <AuthHandler />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
