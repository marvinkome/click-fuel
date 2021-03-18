import React from "react"
import Layout from "components/Layout"
import Head from "next/head"
import { Center, Text, Box, Heading } from "@chakra-ui/react"

const useTwitter = () => {
    const [twitterLoaded, setTwitterLoaded] = React.useState(false)
    const [twitterLoadError, setTwitterLoadedError] = React.useState(false)

    React.useEffect(() => {
        function initTwitter() {
            // @ts-ignore
            window.twttr.ready().then(() => {
                setTwitterLoaded(true)
                console.log("Twitter loaded")

                // @ts-ignore
                window.twttr.events.bind("tweet", () => {
                    // listen for tweet
                    console.log("tweeted")
                })
            })
        }

        initTwitter()
    }, [])
}

export default function Auth() {
    useTwitter()
    const shareText = "Hey @clickfuel, verify 0x2394badc49230b3909bc456af for this account."

    return (
        <Layout>
            <Head>
                <script src="https://platform.twitter.com/widgets.js"></script>
            </Head>

            <Box mt={20}>
                <Heading fontSize={{ base: "lg", md: "4xl" }} textAlign="center">
                    Tweet at us to verify your account
                </Heading>

                <Box mx={5} mt={16} mb={7} bg="gray.900" px={7} py={6} borderRadius="3xl">
                    <Text fontSize="lg" color="blue.200">
                        {shareText}
                    </Text>
                </Box>

                <Center>
                    <a
                        href="https://twitter.com/intent/tweet"
                        className="twitter-share-button"
                        data-size="large"
                        data-text={shareText}
                        data-dnt="true"
                        data-hashtags="clickfuel"
                    >
                        Tweet
                    </a>
                </Center>
            </Box>
        </Layout>
    )
}
