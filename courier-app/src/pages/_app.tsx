import LoginRegisterLayout from "@/components/layout/LoginRegisterLayout";
import MainLayoutAdmin from "@/components/layout/MainLayoutAdmin";
import MainLayoutUser from "@/components/layout/MainLayoutUser";
import { persistor, store } from "@/stores/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{ duration: 2500 }}
        />
        {OutputComponent}
      </PersistGate>
    </Provider>
  );
}
