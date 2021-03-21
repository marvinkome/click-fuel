import Cookies from "js-cookie"
import { Wallet } from "ethers"
import { useCallback, useEffect, useMemo, useState } from "react"
import { STORAGE_NAME, getAccountFromLocalStorage, toBase64 } from "wallet/utils"
import { useClientContext } from "./context"
import { getOVMBalance, transferToken } from "./index"

export function useAddress() {
    const [{ address }] = useClientContext()
    return address
}

export function useAccount() {
    const [{ account }] = useClientContext()
    return account
}

export function useWallet() {
    const [{ account }] = useClientContext()

    const wallet = useMemo(() => {
        return account ? Wallet.fromMnemonic(account) : null
    }, [account])

    return wallet
}

export function useBalance() {
    const [{ balance }] = useClientContext()
    return balance
}

export function useImportWallet() {
    const [_, actions] = useClientContext()

    return useCallback(async (mnemonic: string) => {
        const wallet = Wallet.fromMnemonic(mnemonic)
        const balance = await getOVMBalance(wallet)
        const address = wallet.address

        actions.initialize(mnemonic, address, balance)
    }, [])
}

export function useCreateWallet() {
    const [_, actions] = useClientContext()

    return useCallback(async (googleId: string) => {
        console.log("Creating a new wallet...")

        const wallet = Wallet.createRandom()
        actions.initialize(wallet.mnemonic.phrase, wallet.address)

        console.log("Wallet created successfully")

        // TODO:: Uncomment when moving to OVM
        // await getTokens(wallet, googleId)
        // const balance = await getOVMBalance(wallet)
        // actions.updateBalance(balance)
    }, [])
}

export function useTransferTokens() {
    const [state, actions] = useClientContext()
    const wallet = useWallet()

    return useCallback(
        async (amount: number, receiver: string) => {
            await transferToken(wallet, receiver, amount)
            actions.updateBalance(state.balance - amount)
        },
        [wallet, state.balance]
    )
}

export function useWalletUpdater() {
    const [state, actions] = useClientContext()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        ;(async function () {
            setIsClient(true)
            if (!state.address) return

            // get address from local storage
            const mnemonic = getAccountFromLocalStorage()
            const wallet = Wallet.fromMnemonic(mnemonic)
            const address = wallet.address

            // confirm local storage address matches cookie address
            if (!!state.address && address !== state.address) {
                throw new Error(
                    "Your cookies are out of sync. Please clear your cookies and try again."
                )
            }

            const balance = await getOVMBalance(wallet)
            actions.initialize(mnemonic, address, balance)
        })()
    }, [])

    // storage updates
    useEffect(() => {
        if (isClient && !!state.account) {
            const data = toBase64({ mnemonic: state.account })
            window.localStorage.setItem(STORAGE_NAME, data)
        }
    }, [isClient, state.account])

    useEffect(() => {
        if (isClient && !!state.address) {
            const data = toBase64({ address: state.address })
            Cookies.set(STORAGE_NAME, data, { expires: 365 * 10, secure: true })
        }
    }, [isClient, state.address])
}
