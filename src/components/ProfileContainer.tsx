import { useAuth, UserButton } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const ProfileContainer = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center">
        <Loader className="w-4 h-4 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <Link to="/sign-in">
        <Button size={"sm"} variant={"outline"}>
          Login
        </Button>
      </Link>
      <Link to="/sign-up">
        <Button size={"sm"} variant={"outline"}>
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default ProfileContainer;
