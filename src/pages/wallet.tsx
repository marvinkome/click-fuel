import React from "react"
import Layout from "components/Layout"
import * as walletHooks from "wallet/hooks"
import {
    Box,
    Flex,
    Heading,
    IconButton,
    Text,
    Img,
    useClipboard,
    Circle,
    FormControl,
    FormLabel,
    Input,
    Button,
    FormErrorMessage,
    useToast,
} from "@chakra-ui/react"
import { truncateAddress } from "libs/utils"
import { CopyIcon } from "@chakra-ui/icons"

import { useGoogleLogin } from "react-google-login"

function useVerifyAccount() {
    const toast = useToast()
    const getTokens = walletHooks.useGetTokens()

    const data = useGoogleLogin({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        onSuccess: async (data) => {
            // @ts-ignore
            await getTokens(data.googleId)
        },
        onFailure: (res) => {
            console.log("Login failed", res)
            toast({
                title: "Login Failed",
                description: res.details || "Unexpected error occurred",
                status: "error",
                position: "top-right",
                isClosable: true,
            })
        },
    })

    return data
}

function useTransferTokenForm() {
    const toast = useToast()
    const transferTokens = walletHooks.useTransferTokens()
    const [formState, setFormState] = React.useState({
        sending: false,
        error: "",
    })

    const [data, setData] = React.useState({
        amount: "",
        receiver: "",
    })

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [field]: event.target.value })
    }

    const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault()
        const { amount, receiver } = data

        setFormState({ ...formState, sending: true })
        try {
            await transferTokens(parseInt(amount, 10), receiver)
        } catch (error) {
            setFormState({ ...formState, error: error.message })
        }

        setFormState({ ...formState, sending: false })
        setData({ amount: "", receiver: "" })
        toast({
            title: "Transfer Successful",
            description: `${amount} FUEL has been sent to ${receiver}`,
            status: "success",
            isClosable: true,
            position: "top-right",
        })
    }

    return {
        ...formState,
        data,
        handleChange,
        handleSubmit,
    }
}

function useImportAccountForm() {
    const toast = useToast()
    const importWallet = walletHooks.useImportWallet()
    const [error, setError] = React.useState("")
    const [mnemonic, setMnemonic] = React.useState("")

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError("")
        setMnemonic(event.target.value)
    }

    const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault()

        importWallet(mnemonic)
            .then(() => {
                toast({
                    title: "Wallet imported",
                    description: `Your wallet have been imported`,
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                })

                setMnemonic("")
            })
            .catch((err) => {
                console.log(err)
                setError("Failed to import wallet. Please check your seed phrase and try again")
            })
    }

    return {
        error,
        mnemonic,
        handleChange,
        handleSubmit,
    }
}

function WalletPage() {
    const address: string = walletHooks.useAddress()
    const balance = walletHooks.useBalance()
    const account = walletHooks.useAccount()
    const { hasCopied, onCopy } = useClipboard(address)
    const accountCopy = useClipboard(account)
    const transferForm = useTransferTokenForm()
    const importAccountForm = useImportAccountForm()
    const googleSignIn = useVerifyAccount()
    const isVerified = walletHooks.useAccountVerified()

    return (
        <Layout hideCreate>
            <Box mb={14} mt={7}>
                <Flex
                    direction="column"
                    align="center"
                    borderRadius="3xl"
                    py={10}
                    px={7}
                    bg="primary"
                >
                    <Circle bg="whiteAlpha.400" boxSize="50px" mb={5}>
                        <Img src="/flame-icon.svg" boxSize="25px" />
                    </Circle>

                    <Text mb={7} fontSize="lg">
                        {balance} FUEL
                    </Text>

                    <Flex justify="center" align="center">
                        <Text fontSize="xl">{truncateAddress(address || "", 8)}</Text>
                        <IconButton
                            variant="outline"
                            ml={4}
                            mr={2}
                            aria-label="Copy wallet address"
                            onClick={onCopy}
                            icon={<CopyIcon />}
                        />
                    </Flex>

                    {!isVerified && (
                        <Button
                            isDisabled={!googleSignIn.loaded}
                            onClick={googleSignIn.signIn}
                            mt={3}
                            variant="ghost"
                        >
                            Verify Google account for 50 fuel tokens
                        </Button>
                    )}

                    {hasCopied && <Text>Copied</Text>}
                </Flex>

                <Box mt={16}>
                    <Heading mb={7} fontSize="x-large">
                        Transfer $FUEL Tokens
                    </Heading>

                    <form onSubmit={transferForm.handleSubmit}>
                        <FormControl isInvalid={!!transferForm.error} isRequired mb={5} id="amount">
                            <FormLabel>Amount to send</FormLabel>
                            <Input
                                onChange={transferForm.handleChange("amount")}
                                value={transferForm.data.amount}
                                size="lg"
                                placeholder="Enter amount"
                                type="number"
                            />
                        </FormControl>

                        <FormControl
                            isInvalid={!!transferForm.error}
                            isRequired
                            mb={5}
                            id="receiver"
                        >
                            <FormLabel>Receiver's address</FormLabel>
                            <Input
                                onChange={transferForm.handleChange("receiver")}
                                value={transferForm.data.receiver}
                                size="lg"
                                placeholder="Enter address"
                                type="text"
                            />

                            <FormErrorMessage>{transferForm.error}</FormErrorMessage>
                        </FormControl>

                        <Button
                            isLoading={transferForm.sending}
                            colorScheme="blue"
                            variant="outline"
                            type="submit"
                        >
                            Send Tokens
                        </Button>
                    </form>
                </Box>

                <Box mt={16}>
                    <Heading mb={7} fontSize="x-large">
                        Manage wallet
                    </Heading>

                    <Button
                        onClick={accountCopy.onCopy}
                        colorScheme="blue"
                        isFullWidth
                        size="lg"
                        mb={10}
                        variant="outline"
                    >
                        {accountCopy.hasCopied ? "Copied seed phrase!" : "Export wallet"}
                    </Button>

                    <form onSubmit={importAccountForm.handleSubmit}>
                        <FormControl isInvalid={!!importAccountForm.error} mb={5} id="importWallet">
                            <FormLabel>Import Wallet</FormLabel>
                            <Input
                                onChange={importAccountForm.handleChange}
                                value={importAccountForm.mnemonic}
                                size="lg"
                                placeholder="Your seed phrase"
                                type="text"
                            />
                            <FormErrorMessage>{importAccountForm.error}</FormErrorMessage>
                        </FormControl>

                        <Button colorScheme="blue" variant="outline" type="submit">
                            Import wallet
                        </Button>
                    </form>
                </Box>
            </Box>
        </Layout>
    )
}

export default WalletPage
