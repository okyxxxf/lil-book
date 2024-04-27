import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { publisher, city } from "../../types";
import { CityService } from "../../services";

type PublisherModalProps = {
  isOpen: boolean;
  onClose: Function;
  publisher: publisher | null;
  onSave: Function;
};

const cityService = new CityService();

export function PublisherModal({ isOpen, onClose, publisher, onSave }: PublisherModalProps) {
  const [newPublisher, setNewPublisher] = useState<publisher>({
    name: "",
    cityId: 0,
  });
  const [oldPublisherId, setOldPublisherId] = useState<number>();
  const [cities, setCities] = useState<city[]>([]);

  useEffect(() => {
    setNewPublisher(publisher || {
      name: "",
      cityId: 0,
    });
    setOldPublisherId(publisher?.id);
    
    cityService.get().then((cities) => setCities(cities));
  }, [publisher]);

  const handleSave = () => {
    onSave(oldPublisherId, newPublisher);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{publisher ? "Редактировать издательство" : "Добавить новое издательство"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Название</FormLabel>
            <Input value={newPublisher.name} onChange={(e) => setNewPublisher({ ...newPublisher, name: e.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Город</FormLabel>
            {!publisher ? (
              <Select value={newPublisher.cityId} onChange={(e) => setNewPublisher({ ...newPublisher, cityId: parseInt(e.target.value) })}>
                <option>Выберите город</option>
                {cities.map((city, index) => (
                  <option key={index} value={city.id}>{city.name}</option>
                ))}
              </Select>
            ) : (
              <Input value={publisher.cityId} disabled />
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
