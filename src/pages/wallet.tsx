import React from "react"
import Layout from "components/Layout"
import { useRouter } from "next/router"
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
import { useAddress, useBalance, useTransferTokens } from "wallet/hooks"

function useTransferTokenForm() {
    const toast = useToast()
    const transferTokens = useTransferTokens()
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
        })
    }

    return {
        ...formState,
        data,
        handleChange,
        handleSubmit,
    }
}

function WalletPage() {
    const router = useRouter()
    const address: string = useAddress()
    const balance = useBalance()
    const { hasCopied, onCopy } = useClipboard(address)
    const transferForm = useTransferTokenForm()

    React.useEffect(() => {
        if (!address) {
            router.push("/")
        }
    }, [address])

    return (
        <Layout hideCreate>
            <Box mt={7}>
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
                        <Text fontSize="xl">{truncateAddress(address, 8)}</Text>
                        <IconButton
                            variant="outline"
                            ml={4}
                            mr={2}
                            aria-label="Copy wallet address"
                            onClick={onCopy}
                            icon={<CopyIcon />}
                        />
                    </Flex>

                    {hasCopied && <Text>Copied</Text>}
                </Flex>

                <Box mt={16}>
                    <Heading mb={7} fontSize="x-large">
                        Transfer $FUEL Tokens
                    </Heading>

                    <form onSubmit={transferForm.handleSubmit}>
                        <FormControl isRequired mb={5} id="amount">
                            <FormLabel>Amount to send</FormLabel>
                            <Input
                                onChange={transferForm.handleChange("amount")}
                                value={transferForm.data.amount}
                                size="lg"
                                placeholder="Enter amount"
                                type="number"
                            />
                        </FormControl>

                        <FormControl isRequired mb={5} id="receiver">
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

                    <Button colorScheme="blue" isFullWidth size="lg" mb={10} variant="outline">
                        Export wallet
                    </Button>

                    <form>
                        <FormControl mb={5} id="amount">
                            <FormLabel>Import Wallet</FormLabel>
                            <Input size="lg" placeholder="Your seed phrase" type="number" />
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
