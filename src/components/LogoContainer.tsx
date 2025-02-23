import { Link } from "react-router-dom";

const LogoContainer = () => {
  return (
    <Link to="/">
      {/* <img src="/svg/logo.svg" className="w-10 h-10" /> */}
      <img src="/logo_js.svg" className="w-10 h-10" />
    </Link>
  );
};

export default LogoContainer;
