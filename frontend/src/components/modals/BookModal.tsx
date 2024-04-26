import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { author, book, publisher } from "../../types"; // Подключите ваши типы
import { AuthorService, PublisherService } from "../../services";

const authorService = new AuthorService();
const publisherService = new PublisherService();

type BookModalProps = {
  isOpen: boolean;
  onClose: Function;
  book: book | null;
  onSave: Function;
};

export function BookModal({ isOpen, onClose, book, onSave }: BookModalProps) {
  const [newBook, setNewBook] = useState<book>({
    name: "",
    year: 0,
    price: 0,
    count: 0,
    authorId: 0,
    publisherId: 0,
  });
  const [oldBookId, setOldBookId] = useState<number>();
  const [authors, setAuthors] = useState<author[]>([]); 
  const [publishers, setPublishers] = useState<publisher[]>([]); 

  useEffect(() => {
    setNewBook(book || {
      name: "",
      year: 0,
      price: 0,
      count: 0,
      authorId: 0,
      publisherId: 0,
    });
    setOldBookId(book?.id);

    authorService.get().then((authors) => setAuthors(authors));
    publisherService.get().then((publishers) => setPublishers(publishers));
  }, [book]);

  const handleSave = () => {
    onSave(oldBookId, newBook);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{book ? "Редактировать книгу" : "Добавить новую книгу"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Название</FormLabel>
            <Input value={newBook.name} onChange={(e) => setNewBook({ ...newBook, name: e.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Год издания</FormLabel>
            <Input type="number" value={newBook.year} onChange={(e) => setNewBook({ ...newBook, year: parseInt(e.target.value) })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Цена</FormLabel>
            <Input type="number" value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: parseFloat(e.target.value) })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Количество</FormLabel>
            <Input type="number" value={newBook.count} onChange={(e) => setNewBook({ ...newBook, count: parseInt(e.target.value) })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Автор</FormLabel>
            {!book ? (
              <Select value={newBook.authorId} onChange={(e) => setNewBook({ ...newBook, authorId: parseInt(e.target.value) })}>
                <option>Выберите автора</option>
                {authors.map((author, index) => (
                  <option key={index} value={author.id}>{`${author.firstName} ${author.lastName}`}</option>
                ))}
              </Select>
            ) : (
              <Input value={book.authorId} disabled/>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Издатель</FormLabel>
            {!book ? (            
              <Select value={newBook.publisherId} onChange={(e) => setNewBook({ ...newBook, publisherId: parseInt(e.target.value) })}>
                <option>Выберите издательство</option>
                {publishers.map((publisher, index) => (
                  <option key={index} value={publisher.id}>{publisher.name}</option>
                ))}
              </Select>
            ) : (
              <Input value={book.publisherId} disabled/>
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