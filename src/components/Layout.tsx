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
} from "@chakra-ui/react"
import { IoCreateOutline } from "react-icons/io5"
import CreateModal from "./CreateModal"
import { useAccount, useWalletUpdater } from "wallet/hooks"
import { Account } from "./Account"

const Layout: React.FC<{ hideCreate?: boolean }> = ({ children, hideCreate = false }) => {
    useWalletUpdater()

    const isLoggedIn = !!useAccount()
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
                    {!hideCreate && isLoggedIn && (
                        <Button display={{ base: "none", md: "block" }} onClick={disclosure.onOpen}>
                            Submit Link
                        </Button>
                    )}

                    <Account />
                </HStack>
            </Flex>

            <Container my={5}>{children}</Container>

            {!hideCreate && isLoggedIn && (
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
