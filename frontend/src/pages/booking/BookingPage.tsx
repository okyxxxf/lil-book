import { Box, Checkbox, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import { BookingModal, DataTable } from "../../components";
import { FaSearch } from "react-icons/fa";
import { AiOutlineFilter } from "react-icons/ai";
import { useEffect, useState } from "react";
import { booking, column } from "../../types";
import { BookService, BookingService } from "../../services";

const bookingService = new BookingService();
const bookService = new BookService();

const baseColumns = [
  { field: "date", header: "Дата" },
  { field: "bookId", header: "Книга" },
  { field: "libraryCardId", header: "ID библиотечного билета" },
];

export function BookingsPage() {
  const [isOpenToggleColumns, setIsOpenToggleColumns] = useState<boolean>(false);
  const [columns, setColumns] = useState<column[]>();
  const [baseBookings, setBaseBookings] = useState<booking[]>();
  const [bookings, setBookings] = useState<booking[]>(); 
  const [search, setSearch] = useState<string>();
  const [selectedBooking, setSelectedBooking] = useState<booking | null>(null); 
  const [isOpen, setIsOpen] = useState(false);

  const formatBookings = async (bookings: booking[]) => {
    const formattedBooks = await Promise.all(
      bookings.map(async (booking) => {
        const book = await bookService.getById(+booking.bookId);
        return ({
          ...booking,
          date: new Date(booking.date).toLocaleDateString(),
          bookId: book.name,
        })
      })
    );
    return formattedBooks;
  }

  const updateBookings = async () => {
    const bookings = await bookingService.get();
    const formattedBookings = await formatBookings(bookings);
    setBaseBookings(formattedBookings);
    setColumns(baseColumns);
    setBookings(baseBookings)
  }

  const handleEdit = (booking: booking) => {
    setSelectedBooking(booking);
    setIsOpen(true);
  }

  const handleDelete = (booking: booking) => {
    bookingService.delete(booking.id || 0).then(() => {
      updateBookings();
    })
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleAdd = () => {
    setSelectedBooking(null);
    setIsOpen(true);
  }

  const handleSave = (id: number, newBooking: booking) => {
    if (selectedBooking) bookingService.put(id, newBooking).then(() => updateBookings());
    if (!selectedBooking) bookingService.post(newBooking).then(() => updateBookings());
    setIsOpen(false);
  }

  useEffect(() => {
    updateBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!baseBookings) return;
    if (!search) return setBookings(baseBookings);

    const filteredBooks = baseBookings.filter((b) =>
      b.bookId.toString().indexOf(search) !== -1
    );

    setBookings(filteredBooks);
  }, [baseBookings, search]);

  const handleOpenToggleColumns = () => {
    setIsOpenToggleColumns(!isOpenToggleColumns);
  };

  const toggleColumn = ({field, header} : column, isCheck: boolean) => {
    if (!columns) return setColumns([{field: field, header: header}]);

    if (columns.length === baseColumns.length && isCheck) return setColumns([{field: field, header: header}]);

    const index = columns?.findIndex((c) => c.field === field && c.header === header);

    if (index === -1) {
      return setColumns([...columns, {field: field, header: header}]);
    }

    if (index + 1 === columns.length) return setColumns(baseColumns.sort());

    setColumns([...columns.slice(0, index), ...columns.slice(index + 1)]);
  }


  return (
    <Box w="100%" bg="gray.200" h="calc(100vh - 88px)">
      <Flex align="center" justify="center" m="50px" bg="white" borderRadius="5px" direction="column" p="20px" gap="20px">
        <Flex gap="10px" w="100%">
          <Flex gap="5px" align="center" cursor="pointer" onClick={handleOpenToggleColumns}>
            <Text userSelect="none">Поля</Text>
            <AiOutlineFilter/>
          </Flex>
          <InputGroup alignItems="center">
            <InputLeftElement>
              <FaSearch/>
            </InputLeftElement>
            <Input placeholder="Поиск" value={search} onChange={(e) => setSearch(e.target.value)}/>
          </InputGroup>
        </Flex>
        <Flex w="100%" gap="20px" justify="end">
          {isOpenToggleColumns ? (
          <VStack bg="#D9D9D9" p="20px" align="stretch" h="min-content">
            {baseColumns.map(({header, field}) => (
              <Checkbox key={field} display="flex" onChange={(e) => toggleColumn({header: header, field: field}, e.target.checked)} defaultChecked>
                {header}
              </Checkbox>
            ))}
          </VStack>
          ) : null}
          <Flex w="100%" justify="center">
            <DataTable columns={columns || []} data={bookings || []} handleCreate={handleAdd} handleDelete={handleDelete} handleEdit={handleEdit}/> 
          </Flex>
        </Flex>
      </Flex>
      <BookingModal isOpen={isOpen} onClose={handleClose} booking={selectedBooking} onSave={handleSave} />
    </Box>
  );
}
