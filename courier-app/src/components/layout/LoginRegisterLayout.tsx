import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const LoginRegisterLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-primary_blue  to-primary_orange  ">
      <div className="card lg:card-side  shadow-2xl w-4/6 h-[90%] bg-primary_blue ">
        <div className="card-body max-w-lg  -m-[1.25%] h-[104%] bg-base-100 rounded-r-box rounded-l-[inherit] ">
          <h2 className="card-title mx-auto">
            <Image
              src={"/img/logo.png"}
              width={100}
              height={100}
              alt="SeaCourier logo"
            />
          </h2>
          <div className="flex flex-row justify-center gap-6 border-b-[1px] border-solid border-[#e7e7e7]">
            <Link
              href="/auth/login"
              className={`h-full box-content px-4 font-medium transition ${
                router.pathname.includes("/auth/login") &&
                "border-b-4 border-solid border-[#fec33b]"
              } `}
            >
              LOG IN
            </Link>
            <Link
              href="/auth/register"
              className={`h-full box-content px-2 font-medium transition ${
                router.pathname.includes("/auth/register") &&
                "border-b-4 border-solid border-[#fec33b]"
              }`}
            >
              REGISTER
            </Link>
          </div>
          {children}
        </div>
        <figure className="w-3/5 jus pl-3">
          <div className="rounded-full bg-primary_red flex justify-center items-center bg-gradient-to-br from-primary_red  to-primary_orange w-[90%] h-[85%]">
            <Image
              src={"/img/login-register-cover.png"}
              alt="courier driver ilustration"
              width={"700"}
              height={"700"}
            />
          </div>
        </figure>
      </div>
    </div>
  );
};

export default LoginRegisterLayout;
