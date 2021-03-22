import Cookies from "js-cookie"
import { Wallet } from "ethers"
import { useCallback, useEffect, useMemo, useState } from "react"
import { STORAGE_NAME, getAccountFromLocalStorage, toBase64 } from "wallet/utils"
import { useClientContext } from "./context"
import {
    checkAccountVerification,
    createLink,
    getOVMBalance,
    getTokens,
    transferToken,
    getLinks,
    voteForPost,
} from "./index"
import { useToast } from "@chakra-ui/react"

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
    ...args: any
) => Promise<infer R>
    ? R
    : any

export type PostType = AsyncReturnType<typeof getLinks>

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

export function useAccountVerified() {
    const [{ verified }] = useClientContext()
    return verified
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

export function useGetTokens() {
    const [state, actions] = useClientContext()
    const wallet = useWallet()

    return useCallback(
        async (googleId: string) => {
            await getTokens(wallet, googleId)
            const balance = await getOVMBalance(wallet)

            actions.updateBalance(balance)
            actions.updateAccountVerified(true)
        },
        [wallet, state.balance]
    )
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

export function useCreatePost() {
    const [state, actions] = useClientContext()
    const wallet = useWallet()

    return useCallback(
        async (link: string) => {
            await createLink(wallet, link)
            actions.updateBalance(state.balance - 10)
        },
        [wallet, state.balance]
    )
}

export function usePosts() {
    const [isFetching, setIsFetching] = useState(true)
    const [posts, setPosts] = useState<PostType>([])
    const wallet = useWallet()
    const toast = useToast()

    const _getPosts = useCallback(async () => {
        setIsFetching(true)
        const posts = await getLinks(wallet).catch((e) => {
            toast({
                title: "Failed to get links",
                description: e.message || "Unexpected error",
                status: "error",
                position: "top-right",
                isClosable: true,
            })

            return []
        })

        setPosts(posts)
        setIsFetching(false)
    }, [wallet])

    useEffect(() => {
        if (!wallet) return
        _getPosts()
    }, [wallet])

    return { posts, isFetching }
}

export function useVotePost() {
    const [state, actions] = useClientContext()
    const wallet = useWallet()

    return useCallback(
        async (upvote: boolean, postId: number) => {
            await voteForPost(wallet, upvote, postId)
            actions.updateBalance(state.balance - 1)
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
            if (!state.address) {
                console.log("Creating a new wallet...")
                const wallet = Wallet.createRandom()
                return actions.initialize(wallet.mnemonic.phrase, wallet.address, 0)
            }

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
            const verified = await checkAccountVerification(wallet)

            actions.initialize(mnemonic, address, balance, verified)
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
