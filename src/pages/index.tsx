import React from "react"
import fetch from "isomorphic-fetch"
import Layout from "components/Layout"
import dayjs from "dayjs"
import RelativeTime from "dayjs/plugin/relativeTime"
import { AspectRatio, Box, Flex, Heading, HStack, Img, Text, VStack, Link } from "@chakra-ui/react"
import { PostType, usePosts } from "wallet/hooks"
import { truncateAddress } from "libs/utils"

dayjs.extend(RelativeTime)

const Post: React.FC<{ post: PostType[0] }> = ({ post }) => {
    const [linkData, setLinkData] = React.useState<any>(null)

    React.useEffect(() => {
        ;(async () => {
            const previewData = await fetch("/api/ogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ link: post.link }),
            })
                .then((response) => response.json())
                .catch((err) => {
                    console.log(err)
                    return {}
                })

            setLinkData(previewData)
        })()
    }, [post.link])

    return (
        <Box borderBottom="1px" borderColor="gray.600" py={7} mx={3}>
            <HStack spacing={7} mb={3}>
                <Text color="gray.400" fontSize="sm">
                    Posted by {truncateAddress(post.creator, 4)}
                </Text>
                <Text color="gray.400" fontSize="sm">
                    {dayjs.unix(post.createdTime).fromNow()}
                </Text>
            </HStack>

            <Box border="1px" borderColor="gray.600" borderRadius="20" overflow="hidden" mt={5}>
                {!linkData || !linkData.title ? (
                    <Link href={post.link} isExternal>
                        <Text p={5}>{post.link}</Text>
                    </Link>
                ) : (
                    <>
                        {linkData.image && (
                            <AspectRatio maxW="100%" ratio={2 / 1}>
                                <Img src={linkData.image} objectFit="cover" />
                            </AspectRatio>
                        )}

                        <Box px={3} py={5}>
                            <Heading textTransform="capitalize" size="md">
                                {linkData.title}
                            </Heading>

                            <Link href={post.link} isExternal>
                                <Text mt={5} color="gray.300">
                                    {post.link}
                                </Text>
                            </Link>
                        </Box>
                    </>
                )}
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
    )
}

function Home() {
    const posts = usePosts()

    return (
        <Layout>
            <Box mt={7}>
                {posts.map((post, id) => (
                    <Post post={post} key={id} />
                ))}

                {!posts.length && (
                    <Text align="center">
                        No posts yet. Post the best content on the internet and earn crypto
                    </Text>
                )}
            </Box>
        </Layout>
    )
}

export default Home
