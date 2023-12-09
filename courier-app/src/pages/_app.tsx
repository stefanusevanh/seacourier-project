import LoginRegisterLayout from "@/components/layout/LoginRegisterLayout";
import MainLayoutAdmin from "@/components/layout/MainLayoutAdmin";
import MainLayoutUser from "@/components/layout/MainLayoutUser";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  let OutputComponent: JSX.Element;
  if (router.pathname.includes("/auth")) {
    OutputComponent = (
      <LoginRegisterLayout>
        <Component {...pageProps} />
      </LoginRegisterLayout>
    );
  } else if (router.pathname.includes("/dashboard")) {
    OutputComponent = (
      <MainLayoutAdmin>
        <Component {...pageProps} />
      </MainLayoutAdmin>
    );
  } else {
    OutputComponent = (
      <MainLayoutUser>
        <Component {...pageProps} />
      </MainLayoutUser>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{ duration: 2500 }}
      />
      {OutputComponent}
    </>
  );
}
