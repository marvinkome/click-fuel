import React from "react"
import Layout from "components/Layout"
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
} from "@chakra-ui/react"
import { truncateAddress } from "libs/utils"
import { CopyIcon } from "@chakra-ui/icons"

function WalletPage() {
    const address: string = "0xb63F27E0E5A4c463e056DC835821f0BEE339406A"
    const { hasCopied, onCopy } = useClipboard(address)

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
                        10 FUEL
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

                    <form>
                        <FormControl mb={5} id="amount">
                            <FormLabel>Amount to send</FormLabel>
                            <Input size="lg" placeholder="Enter amount" type="number" />
                        </FormControl>

                        <FormControl mb={5} id="address">
                            <FormLabel>Receiver's address</FormLabel>
                            <Input size="lg" placeholder="Enter address" type="text" />
                        </FormControl>

                        <Button colorScheme="blue" variant="outline" type="submit">
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
