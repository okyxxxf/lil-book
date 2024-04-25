import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { author } from "../../types";

type AuthorModalProps = {
  isOpen: boolean;
  onClose: Function;
  author: author | null; 
  onSave: Function;
}

export function AuthorModal({ isOpen, onClose, author, onSave }: AuthorModalProps) {
  const [newAuthor, setNewAuthor] = useState<author>({firstName: "", lastName: "", middleName: ""});
  const [oldAuthorId, setOldAuthorId] = useState<number>()

  useEffect(() => {
    setNewAuthor(author || {firstName: "", lastName: "", middleName: ""});
    setOldAuthorId(author?.id);
  }, [author]);

  const handleSave = () => {
    onSave(oldAuthorId, newAuthor);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{author ? "Редактировать автора" : "Добавить нового автора"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Имя</FormLabel>
            <Input value={newAuthor.firstName} onChange={(e) => setNewAuthor({...newAuthor, firstName: e.target.value})} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Фамилия</FormLabel>
            <Input value={newAuthor.lastName} onChange={(e) => setNewAuthor({...newAuthor, lastName: e.target.value})} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Отчество</FormLabel>
            <Input value={newAuthor.middleName} onChange={(e) => setNewAuthor({...newAuthor, middleName: e.target.value})} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => handleSave()}>
            Сохранить
          </Button>
          <Button variant="ghost" onClick={() => onClose()}>Отмена</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}