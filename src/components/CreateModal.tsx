import React from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    Input,
    Button,
    FormControl,
    FormErrorMessage,
    useToast,
} from "@chakra-ui/react"
import { useCreatePost } from "wallet/hooks"

type IProps = {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}
export default function CreateModal(props: IProps) {
    const [link, setLink] = React.useState("")
    const createPost = useCreatePost()
    const toast = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()

        createPost(link)
            .then(() => {
                toast({
                    title: "Link publish",
                    description:
                        "You link has been published successfully. Use $FUEL to keep it longer",
                    status: "success",
                    position: "top-right",
                    isClosable: true,
                })

                setLink("")
                props.onClose()
            })
            .catch((e) => {
                toast({
                    title: "Failed to publish link",
                    description: e.message,
                    status: "error",
                    position: "top-right",
                    isClosable: true,
                })
            })
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl" isCentered>
            <ModalOverlay bg="rgba(196, 196, 196, 0.65)" />

            <ModalContent
                w="90%"
                px={{ base: 1, md: 5 }}
                py={{ base: 3, md: 5 }}
                borderRadius="3xl"
                bg="gray.900"
            >
                <ModalHeader>Share something awesome!</ModalHeader>
                <ModalCloseButton />

                <ModalBody mb={5}>
                    <form onSubmit={handleSubmit}>
                        <VStack>
                            <Input
                                type="url"
                                mb={5}
                                placeholder="https://"
                                size="lg"
                                value={link}
                                isRequired
                                autoFocus
                                onChange={(e) => setLink(e.target.value)}
                            />

                            <Button type="submit">Share</Button>
                        </VStack>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
