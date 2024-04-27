import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { city } from "../../types";

type CityModalProps = {
  isOpen: boolean;
  onClose: Function;
  city: city | null; 
  onSave: Function;
}

export function CityModal({ isOpen, onClose, city, onSave }: CityModalProps) {
  const [newCity, setNewCity] = useState<city>({ name: "" });
  const [oldCityId, setOldCityId] = useState<number>();

  useEffect(() => {
    setNewCity(city || { name: "" });
    setOldCityId(city?.id);
  }, [city]);

  const handleSave = () => {
    onSave(oldCityId, newCity);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{city ? "Редактировать город" : "Добавить новый город"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Название</FormLabel>
            <Input value={newCity.name} onChange={(e) => setNewCity({ ...newCity, name: e.target.value })} />
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
