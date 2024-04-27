import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { book, booking } from "../../types";
import { BookService } from "../../services";

const bookService = new BookService();
type BookingModalProps = {
  isOpen: boolean;
  onClose: Function;
  booking: booking | null;
  onSave: Function;
};

export function BookingModal({ isOpen, onClose, booking, onSave }: BookingModalProps) {
  const [newBooking, setNewBooking] = useState<booking>({
    date: "",
    bookId: 0,
    libraryCardId: 0,
    book: ""
  });
  const [oldBookingId, setOldBookingId] = useState<number>();
  const [books, setBooks] = useState<book[]>([]);

  useEffect(() => {
    setNewBooking(booking || {
      date: "",
      bookId: 0,
      libraryCardId: 0,
      book: ""
    });
    setOldBookingId(booking?.id);
    
    bookService.get().then((books) => setBooks(books));
  }, [booking]);

  const handleSave = () => {
    onSave(oldBookingId, newBooking);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{booking ? "Редактировать бронирование" : "Добавить новое бронирование"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Дата</FormLabel>
            <Input type="date" value={newBooking.date.toLocaleString()} onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Книга</FormLabel>
            {!booking ? (
              <Select value={newBooking.bookId} onChange={(e) => setNewBooking({ ...newBooking, bookId: parseInt(e.target.value) })}>
                <option>Выберите книгу</option>
                {books.map((book, index) => (
                  <option key={index} value={book.id}>{book.name}</option>
                ))}
              </Select>
            ) : (
              <Input value={booking.bookId} disabled/>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Библиотечный билет(id)</FormLabel>
            <Input type="number" value={newBooking.libraryCardId} onChange={(e) => setNewBooking({ ...newBooking, libraryCardId: +e.target.value })} disabled={!!booking}/>
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
