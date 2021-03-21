import React from "react"
import Link from "next/link"
import { LinkBox, Flex, Img, LinkOverlay, Box, Text, Button, useToast } from "@chakra-ui/react"
import { useGoogleLogin } from "react-google-login"
import { useAccount, useBalance, useCreateWallet } from "wallet/hooks"

function useLogin() {
    const toast = useToast()
    const createWallet = useCreateWallet()

    const data = useGoogleLogin({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        onSuccess: async (data) => {
            // @ts-ignore
            await createWallet(data.googleId)
        },
        onFailure: (res) => {
            console.log("Login failed", res)
            toast({
                title: "Login Failed",
                description: res.details || "Unexpected error occurred",
                status: "error",
                position: "top-right",
            })
        },
    })

    return data
}

export function Account() {
    const { signIn, loaded } = useLogin()
    const isLoggedIn = !!useAccount()
    const balance = useBalance()

    if (!isLoggedIn) {
        return (
            <Button
                onClick={signIn}
                isDisabled={!loaded}
                bg="primary"
                _hover={{ bg: "primary", opacity: 0.8 }}
            >
                Get started
            </Button>
        )
    }

    return (
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
    )
}
