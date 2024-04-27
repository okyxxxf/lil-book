import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { reader } from "../../types";

type ReaderModalProps = {
  isOpen: boolean;
  onClose: Function;
  reader: reader | null;
  onSave: Function;
};

export function ReaderModal({ isOpen, onClose, reader, onSave }: ReaderModalProps) {
  const [newReader, setNewReader] = useState<reader>({
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    address: "",
  });
  const [oldReaderId, setOldReaderId] = useState<number | undefined>();

  useEffect(() => {
    setNewReader(reader || {
      firstName: "",
      lastName: "",
      middleName: "",
      phone: "",
      address: "",
    });
    setOldReaderId(reader?.id);
  }, [reader]);

  const handleSave = () => {
    onSave(oldReaderId, newReader);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{reader ? "Редактировать читателя" : "Добавить нового читателя"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Имя</FormLabel>
            <Input value={newReader.firstName} onChange={(e) => setNewReader({ ...newReader, firstName: e.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Фамилия</FormLabel>
            <Input value={newReader.lastName} onChange={(e) => setNewReader({ ...newReader, lastName: e.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Отчество</FormLabel>
            <Input value={newReader.middleName} onChange={(e) => setNewReader({ ...newReader, middleName: e.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Телефон</FormLabel>
            <Input value={newReader.phone} onChange={(e) => setNewReader({ ...newReader, phone: e.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Адрес</FormLabel>
            <Input value={newReader.address} onChange={(e) => setNewReader({ ...newReader, address: e.target.value })} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => handleSave()}>
            Сохранить
          </Button>
          <Button variant="ghost" onClick={() => onClose()}>
            Отмена
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
