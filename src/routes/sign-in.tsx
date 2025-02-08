import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center relative">
      <img
        src="/img/bg.png"
        alt="bg"
        className="absolute w-full h-full object-cover opacity-10"
      />
      <SignIn path="/sign-in" />
    </div>
  );
};

export default SignInPage;
