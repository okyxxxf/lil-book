import { Box, Checkbox, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import { BookModal, DataTable } from "../../components";
import { FaSearch } from "react-icons/fa";
import { AiOutlineFilter } from "react-icons/ai";
import { useEffect, useState } from "react";
import { book, column } from "../../types";
import { BookService, AuthorService, PublisherService } from "../../services"; 

const service = new BookService(); 
const authorService = new AuthorService();
const publisherService = new PublisherService();

const baseColumns = [
  { field: "name", header: "Название" },
  { field: "year", header: "Год издания" },
  { field: "price", header: "Цена"},
  { field: "count", header: "Колличество"},
  { field: "authorId", header: "Автор"},
  { field: "publisherId", header: "Издательство"},
];

export function BooksPage() {
  const [isOpenToggleColumns, setIsOpenToggleColumns] = useState<boolean>(false);
  const [columns, setColumns] = useState<column[]>();
  const [baseBooks, setBaseBooks] = useState<book[]>();
  const [books, setBooks] = useState<book[]>();
  const [search, setSearch] = useState<string>();
  const [selectedBook, setSelectedBook] = useState<book | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const formatBooks = async (books: book[]) => {
    const formattedBooks = await Promise.all(
      books.map(async (book) => {
        const author = await authorService.getById(+book.authorId);
        const publisher = await publisherService.getById(+book.publisherId);
        return ({
          ...book,
          authorId: author.firstName + " " + author.lastName,
          publisherId: publisher.name,
        })
      })
    );
    return formattedBooks;
  }

  const updateBooks = async () => {
    const books = await service.get();
    const formattedBooks = await formatBooks(books);
    setBaseBooks(formattedBooks);
    setColumns(baseColumns);
    setBooks(baseBooks)
  }

  const handleEdit = (book: book) => {
    setSelectedBook(book);
    setIsOpen(true);
  }

  const handleDelete = (book: book) => {
    service.delete(book.id || 0).then(() => {
      updateBooks();
    })
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleAdd = () => {
    setSelectedBook(null);
    setIsOpen(true);
  }

  const handleSave = (id: number, newBook: book) => {
    if (selectedBook) service.put(id, newBook).then(() => updateBooks());
    if (!selectedBook) service.post(newBook).then(() => updateBooks());
    setIsOpen(false);
  }

  useEffect(() => {
    updateBooks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!baseBooks) return;
    if (!search) return setBooks(baseBooks);

    const filteredBooks = baseBooks.filter((b) =>
      b.name.indexOf(search) !== -1
    );

    setBooks(filteredBooks);
  }, [baseBooks, search]);

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
            <DataTable columns={columns || []} data={books || []} handleCreate={handleAdd} handleDelete={handleDelete} handleEdit={handleEdit}/> 
          </Flex>
        </Flex>
      </Flex>
      <BookModal isOpen={isOpen} onClose={handleClose} book={selectedBook} onSave={handleSave} />
    </Box>
  );
}
