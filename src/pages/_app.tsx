import App from "next/app"
import type { AppProps, AppContext } from "next/app"

function ClickFuelApp({ Component, pageProps, wallet }: AppProps & { wallet: any }) {
    return <Component wallet={wallet} {...pageProps} />
}

ClickFuelApp.getInitialProps = async (appContext: AppContext) => {
    const { req, res } = appContext.ctx
    const serverSide = !!req && !!res

    // get existing wallet from cookie
    // const { publicKey } = getWallet(appContext.ctx, serverSide)

    const appProps = await App.getInitialProps(appContext)
    return { ...appProps, wallet: "any" }
}

export default ClickFuelApp
