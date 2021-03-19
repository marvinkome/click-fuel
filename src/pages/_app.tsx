import App from "next/app"
import type { AppProps, AppContext } from "next/app"
import theme from "theme"
import React from "react"
import { ChakraProvider } from "@chakra-ui/react"

function ClickFuelApp({ Component, pageProps, wallet }: AppProps & { wallet: any }) {
    return (
        <ChakraProvider theme={theme}>
            <Component wallet={wallet} {...pageProps} />
        </ChakraProvider>
    )
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
