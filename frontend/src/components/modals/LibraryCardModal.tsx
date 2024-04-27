import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { libraryCard, reader } from "../../types";
import { ReaderService } from "../../services";

const readerService = new ReaderService();

type LibraryCardModalProps = {
  isOpen: boolean;
  onClose: Function;
  libraryCard: libraryCard | null;
  onSave: Function;
};

export function LibraryCardModal({ isOpen, onClose, libraryCard, onSave }: LibraryCardModalProps) {
  const [newLibraryCard, setNewLibraryCard] = useState<libraryCard>({
    dateCreated: "",
    readerId: 0,
  });
  const [oldLibraryCardId, setOldLibraryCardId] = useState<number>();
  const [readers, setReaders] = useState<reader[]>([]);

  useEffect(() => {
    setNewLibraryCard(libraryCard || {
      dateCreated: "",
      readerId: 0,
    });
    setOldLibraryCardId(libraryCard?.id);
    
    readerService.get().then((readers) => setReaders(readers));
  }, [libraryCard]);

  const handleSave = () => {
    onSave(oldLibraryCardId, newLibraryCard);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{libraryCard ? "Редактировать библиотечный билет" : "Добавить новый библиотечный билет"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Дата создания</FormLabel>
            <Input value={newLibraryCard.dateCreated.toLocaleString()} onChange={(e) => setNewLibraryCard({ ...newLibraryCard, dateCreated: e.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Читатель</FormLabel>
            {!libraryCard ? (
              <Select value={newLibraryCard.readerId} onChange={(e) => setNewLibraryCard({ ...newLibraryCard, readerId: parseInt(e.target.value) })}>
                <option>Выберите читателя</option>
                {readers.map((reader, index) => (
                  <option key={index} value={reader.id}>{`${reader.firstName} ${reader.lastName}`}</option>
                ))}
              </Select>
            ) : (
              <Input value={libraryCard.readerId} disabled/>
            )}
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
  );
}
