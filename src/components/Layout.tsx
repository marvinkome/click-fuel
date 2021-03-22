import React from "react"
import Head from "next/head"
import Link from "next/link"
import {
    Container,
    Flex,
    Img,
    Box,
    Button,
    HStack,
    useDisclosure,
    IconButton,
    LinkBox,
    Text,
    LinkOverlay,
} from "@chakra-ui/react"
import { IoCreateOutline } from "react-icons/io5"
import CreateModal from "./CreateModal"
import { useAccount, useBalance, useWalletUpdater } from "wallet/hooks"

const Layout: React.FC<{ hideCreate?: boolean }> = ({ children, hideCreate = false }) => {
    useWalletUpdater()

    const balance = useBalance()
    const disclosure = useDisclosure()

    return (
        <>
            <Head>
                <title>ClickFuel</title>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <Flex justify="space-between" px={{ md: 14, base: 3 }} mt={{ md: 10, base: 5 }}>
                <Link href="/">
                    <a>
                        <Img src="/logo.svg" alt="ClickFuel logo" />
                    </a>
                </Link>

                <HStack align="center" spacing={10}>
                    {!hideCreate && (
                        <Button display={{ base: "none", md: "block" }} onClick={disclosure.onOpen}>
                            Submit Link
                        </Button>
                    )}

                    <LinkBox
                        as={Flex}
                        borderRadius="20"
                        border="1px"
                        borderColor="gray.500"
                        bg="gray.700"
                        align="center"
                    >
                        <Img ml={3} boxSize="20px" src="/flame-icon.svg" alt="Flame Icon" />

                        <Text fontSize="lg" ml={2} mr={5}>
                            {balance}
                        </Text>

                        <Link passHref href="/wallet">
                            <LinkOverlay>
                                <Box w="40px" h="40px" borderRadius="full" bg="primary" />
                            </LinkOverlay>
                        </Link>
                    </LinkBox>
                </HStack>
            </Flex>

            <Container my={5}>{children}</Container>

            {!hideCreate && (
                <Box
                    borderRadius="full"
                    p={2}
                    pos="fixed"
                    bottom="10"
                    right="10"
                    display={{ base: "block", md: "none" }}
                >
                    <IconButton
                        isRound
                        colorScheme="brand"
                        size="lg"
                        fontSize="25px"
                        aria-label="Submit link"
                        color="white"
                        onClick={disclosure.onOpen}
                        icon={<IoCreateOutline style={{ marginTop: -3, marginLeft: 3 }} />}
                    />
                </Box>
            )}

            <CreateModal {...disclosure} />
        </>
    )
}

export default Layout
