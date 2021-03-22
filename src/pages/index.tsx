import React from "react"
import fetch from "isomorphic-fetch"
import Layout from "components/Layout"
import dayjs from "dayjs"
import RelativeTime from "dayjs/plugin/relativeTime"
import Duration from "dayjs/plugin/duration"
import {
    AspectRatio,
    Box,
    Flex,
    Heading,
    HStack,
    Img,
    Text,
    VStack,
    Link,
    Button,
    Tooltip,
    Center,
    Spinner,
} from "@chakra-ui/react"
import { PostType, usePosts, useVotePost } from "wallet/hooks"
import { calculatePostTimeLeft, truncateAddress } from "libs/utils"

dayjs.extend(RelativeTime)
dayjs.extend(Duration)

const Post: React.FC<{ post: PostType[0]; postId: number }> = ({ post, postId }) => {
    const [flameCount, setFlameCount] = React.useState(0)
    const [linkData, setLinkData] = React.useState<any>(null)
    const [timeLeft, setTimeLeft] = React.useState(0)
    const votePost = useVotePost()

    // keep flame count in state so we can recalculate after any action
    React.useEffect(() => {
        setFlameCount(post.flameCount)
    }, [post])

    // fetch link data
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

    // update timeLeft
    React.useEffect(() => {
        if (flameCount <= 0) return

        setTimeLeft(calculatePostTimeLeft(post.createdTime, flameCount))

        const interval = setInterval(() => {
            setTimeLeft(calculatePostTimeLeft(post.createdTime, flameCount))
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [flameCount])

    const handleVote = async (upvote: boolean) => {
        await votePost(upvote, postId)
        setFlameCount(upvote ? flameCount + 1 : flameCount - 1)
    }

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
                <Tooltip label="Use Flames to keep post alive">
                    <Button
                        onClick={() => handleVote(true)}
                        colorScheme="red"
                        variant="ghost"
                        size="lg"
                        align="center"
                    >
                        <Img src="/flame-icon.svg" boxSize="30px" />
                    </Button>
                </Tooltip>

                <VStack spacing="0">
                    <Text fontSize="xs">Time Left</Text>
                    <Text color="green.500">
                        {dayjs.duration(timeLeft, "m").format("HH:mm:ss")}
                    </Text>
                </VStack>

                <Tooltip label="Use Ice to kill post faster">
                    <Button
                        onClick={() => handleVote(false)}
                        colorScheme="blue"
                        variant="ghost"
                        size="lg"
                        align="center"
                    >
                        <Img src="/snowflake-icon.svg" boxSize="30px" />
                    </Button>
                </Tooltip>
            </Flex>
        </Box>
    )
}

function Home() {
    const { posts, isFetching } = usePosts()
    const validPosts = posts.filter(
        (post) => calculatePostTimeLeft(post.createdTime, post.flameCount) > 0
    )

    return (
        <Layout>
            <Box mt={7}>
                {validPosts.map((post, id) => (
                    <Post post={post} postId={id} key={id} />
                ))}

                {isFetching && (
                    <Center h="50vh">
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                        />
                    </Center>
                )}

                {!validPosts.length && !isFetching && (
                    <Text align="center">
                        No posts yet. Post the best content on the internet and earn crypto
                    </Text>
                )}
            </Box>
        </Layout>
    )
}

export default Home
