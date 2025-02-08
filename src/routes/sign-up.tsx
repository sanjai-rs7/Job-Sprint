import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center relative">
      <img
        src="/img/bg.png"
        alt="bg"
        className="absolute w-full h-full object-cover opacity-40"
      />
      <SignUp path="/sign-up" />
    </div>
  );
};

export default SignUpPage;
