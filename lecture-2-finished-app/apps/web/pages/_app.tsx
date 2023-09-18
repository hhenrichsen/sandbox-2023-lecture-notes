import type { AppType } from "next/app";
import { trpc } from "../util/trpc";

function MyApp({ Component, pageProps }): AppType {
  return <Component {...pageProps} />;
}

export default trpc.withTRPC(MyApp);
