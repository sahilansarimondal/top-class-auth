import Image from "next/image";
import Button from "@/components/ui/Button";
import { GoogleLoginButton } from "react-social-login-buttons";
import { MicrosoftLoginButton } from "react-social-login-buttons";
import { DiscordLoginButton } from "react-social-login-buttons";
import { useState } from "react";

export default function SignIn() {
  const [page, setPage] = useState("Signin");

  function changeState() {
    if (page === "Signin") {
      setPage("Signup");
    } else {
      setPage("Signin");
    }
  }
  return (
    <main className="flex justify-start p-4 md:items-center md:flex-row flex-col  min-h-screen w-full bg-gradient-to-r from-violet-900 to-violet-700 text-white ">
      <div className="min-w-[60%]">
        <div>
          <div className=" py-20 md:py-36 flex gap-6 justify-center flex-col items-center ">
            <img
              className="w-[50px] md:hidden"
              src="/Isotipo Gaming-Store Negativo.svg"
              alt="Paradise Gaming Logo"
            />
            <img
              className=" hidden md:w-[400px] lg:w-[500px] xl:w-[600px] md:block"
              src="/ParadiseGaming Negativo.svg"
              alt="Paradise Gaming Logo"
            />
            <h4 className="text-2xl p-6 xl:px-24 text-center hidden md:block">
              Your sales pitch Your sales pitch Your sales pitch. Your sales
              pitch Your sales pitch Your sales pitch. Your sales pitch Your
              sales pitch Your sales pitch.
            </h4>
          </div>
        </div>
      </div>
      <div className=" flex min-w-[40%] flex-col gap-8 items-center md:items-start">
        <h2 className="text-5xl md:text-6xl font-bold pb-6">Happening now</h2>
        <h4 className=" text-2xl md:text-3xl font-bold">Join today.</h4>
        <div className="flex flex-col gap-3 w-64">
          <GoogleLoginButton className=" " />
          <MicrosoftLoginButton />
          <DiscordLoginButton />
        </div>

        <div className=" w-64 flex gap-4 justify-center items-center">
          <div className=" w-full border-b border-slate-500"></div>
          <div className=" text-center "> or</div>
          <div className=" w-full border-b border-slate-500"></div>
        </div>

        <div className="w-[64px] md:block flex flex-col justify-center items-center ">
          <input
            className=" rounded py-2 pl-2"
            type={"text"}
            placeholder={"Email"}
          />
        </div>
        <Button
          name={page === "Signin" ? "Sign in" : "Sign up"}
          className=" text-slate-900  hover:bg-slate-200 text-lg font-medium  hover:text-black min-w-64"
        />

        <div className="flex justify-center gap-3 items-center">
          <p className="">
            {page === "Signin"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button onClick={changeState} className=" text-blue-500 underline">
            {page === "Signin" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
