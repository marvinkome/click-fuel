import React from "react"
import Layout from "components/Layout"
import { AspectRatio, Box, Flex, Heading, HStack, Img, Text, VStack } from "@chakra-ui/react"

function Home() {
    return (
        <Layout>
            <Box mt={7}>
                {[0, 1, 2].map((_, id) => (
                    <Box key={id} borderBottom="1px" borderColor="gray.600" py={7} mx={3}>
                        <HStack spacing={7} mb={3}>
                            <Text color="gray.400" fontSize="sm">
                                Posted by @mrlonelywolf
                            </Text>
                            <Text color="gray.400" fontSize="sm">
                                3 hours ago
                            </Text>
                        </HStack>

                        <Text>Loved this article I found a while back!!!</Text>

                        <Box
                            border="1px"
                            borderColor="gray.600"
                            borderRadius="20"
                            overflow="hidden"
                            mt={5}
                        >
                            <AspectRatio maxW="100%" ratio={2 / 1}>
                                <Img src="https://via.placeholder.com/720x360" objectFit="cover" />
                            </AspectRatio>

                            <Box px={3} py={5}>
                                <Heading textTransform="capitalize" size="md">
                                    How To: A guide to collaterizing StEth with Arcx
                                </Heading>

                                <Text mt={5} color="gray.300">
                                    blog.lido.fi
                                </Text>
                            </Box>
                        </Box>

                        {/* actions */}
                        <Flex align="center" justify="space-between" pt={7} px={2}>
                            <HStack align="center">
                                <Img src="/flame-icon.svg" boxSize="30px" />
                                <Text color="red.400">120k</Text>
                            </HStack>

                            <VStack spacing="0">
                                <Text fontSize="xs">Time Left</Text>
                                <Text color="green.500">22:05:16</Text>
                            </VStack>

                            <HStack align="center">
                                <Img src="/snowflake-icon.svg" boxSize="30px" />
                                <Text>5.4k</Text>
                            </HStack>
                        </Flex>
                    </Box>
                ))}
            </Box>
        </Layout>
    )
}

export default Home
