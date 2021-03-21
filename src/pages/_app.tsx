import App from "next/app"
import type { AppProps, AppContext } from "next/app"
import theme from "theme"
import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { getAddressFromCookie } from "wallet/utils"
import { WalletProvider } from "wallet/context"

type Props = AppProps & { initialAddress?: string }
function ClickFuelApp({ Component, ...appProps }: Props) {
    return (
        <ChakraProvider theme={theme}>
            <WalletProvider address={appProps.initialAddress}>
                <Component {...appProps.pageProps} />
            </WalletProvider>
        </ChakraProvider>
    )
}

ClickFuelApp.getInitialProps = async (appContext: AppContext) => {
    const { req, res } = appContext.ctx
    const serverSide = !!req && !!res

    // get initial wallet from cookie
    const address = getAddressFromCookie(appContext.ctx, serverSide)
    console.log(address)

    // @ts-ignore
    const appProps = await App.getInitialProps({ ...appContext, initialAddress: address })

    return { ...appProps, initialAddress: address }
}

export default ClickFuelApp
