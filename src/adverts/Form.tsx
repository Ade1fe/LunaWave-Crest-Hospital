import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Textarea, useToast } from '@chakra-ui/react'
import  { useState, FC } from 'react'

interface FormProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const Form: FC<FormProps> = ({ isOpen, onClose }) => {
  const toast = useToast()
  const [complaint, setComplaint] = useState("")

  const handleSubmit = () => {
    toast({
      title: "Complaint received.",
      description: "We've received your complaint. Thank you for your feedback.",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
    setComplaint("") // Clear the textarea
    onClose() // Close the modal
  }

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader>Submit your Complaint</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <Textarea
              placeholder="Please enter your complaint here..."
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Form
