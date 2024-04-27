import React, { useState, useEffect } from "react";
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from "@chakra-ui/react";
import { book, issuing } from "../../types"; // Предположим, что у вас есть тип данных issuing
import { BookService } from "../../services";

const bookService = new BookService();

type IssuingModalProps = {
  isOpen: boolean;
  onClose: Function;
  issuing: issuing | null;
  onSave: Function;
};

export function IssuingModal({ isOpen, onClose, issuing, onSave }: IssuingModalProps) {
  const [newIssuing, setNewIssuing] = useState<issuing>({
    dateIssue: "",
    dateReturn: "",
    bookId: 0,
    book: "",
    libraryCardId: "",
  });
  const [oldIssuingId, setOldIssuingId] = useState<number>();
  const [books, setBooks] = useState<book[]>([]);

  useEffect(() => {
    setNewIssuing(issuing || {
      dateIssue: "",
      dateReturn: "",
      bookId: 0,
      libraryCardId: "",
      book: "",
    });
    setOldIssuingId(issuing?.id);
    
    bookService.get().then((books) => setBooks(books));
  }, [issuing]);

  const handleSave = () => {
    onSave(oldIssuingId, newIssuing);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{issuing ? "Редактировать выдачу" : "Добавить новую выдачу"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Дата выдачи</FormLabel>
            <Input type="date" value={newIssuing.dateIssue.toLocaleString()} onChange={(e) => setNewIssuing({ ...newIssuing, dateIssue: e.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Дата возврата</FormLabel>
            <Input type="date" value={newIssuing.dateReturn.toLocaleString()} onChange={(e) => setNewIssuing({ ...newIssuing, dateReturn: e.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Книга</FormLabel>
            {!issuing ? (
              <Select value={newIssuing.bookId} onChange={(e) => setNewIssuing({ ...newIssuing, bookId: parseInt(e.target.value) })}>
                <option>Выберите книгу</option>
                {books.map((book, index) => (
                  <option key={index} value={book.id}>{book.name}</option>
                ))}
              </Select>
            ) : (
              <Input value={issuing.bookId} disabled/>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Библиотечный билет (id)</FormLabel>
            <Input value={newIssuing.libraryCardId} onChange={(e) => setNewIssuing({ ...newIssuing, libraryCardId: e.target.value })} disabled={!!issuing}/>
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
