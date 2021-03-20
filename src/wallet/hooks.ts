import Cookies from "js-cookie"
import { Wallet } from "ethers"
import { useEffect, useState } from "react"
import { STORAGE_NAME, getAccountFromLocalStorage, toBase64 } from "wallet"
import { useClientContext } from "./context"

export function useWalletUpdater() {
    const [state, actions] = useClientContext()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)

        if (!state.address) {
            // create new wallet
            console.log("Creating a new wallet...")
            const { mnemonic, address } = Wallet.createRandom()
            return actions.initialize(mnemonic.phrase, address)
        }

        // get address from local storage
        const mnemonic = getAccountFromLocalStorage()
        const address = Wallet.fromMnemonic(mnemonic).address

        // confirm local storage address matches cookie address
        if (!!state.address && address !== state.address) {
            throw new Error(
                "Your cookies are out of sync. Please clear your cookies and try again."
            )
        }

        actions.initialize(mnemonic, address)
    }, [])

    // storage updates
    useEffect(() => {
        if (isClient && !!state.account) {
            console.log("store account", state.account)
            const data = toBase64({ mnemonic: state.account })
            window.localStorage.setItem(STORAGE_NAME, data)
        }
    }, [isClient, state.account])

    useEffect(() => {
        if (isClient && !!state.address) {
            console.log("store address", state.address)
            const data = toBase64({ address: state.address })
            Cookies.set(STORAGE_NAME, data, { expires: 365 * 10, secure: true })
        }
    }, [isClient, state.address])
}
