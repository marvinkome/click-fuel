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
} from "@chakra-ui/react"

export default function CreateModal(props: {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}) {
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
                    <VStack>
                        <Input mb={5} placeholder="https://" size="lg" />

                        <Button onClick={props.onOpen}>Share</Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
