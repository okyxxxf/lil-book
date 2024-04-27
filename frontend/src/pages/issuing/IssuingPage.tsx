import React, { useState, useEffect } from "react";
import { Box, Checkbox, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import { IssuingModal, DataTable } from "../../components"; // Предположим, что у вас есть компонент IssuingModal
import { FaSearch } from "react-icons/fa";
import { AiOutlineFilter } from "react-icons/ai";
import { issuing, column } from "../../types"; // Предположим, что у вас есть тип данных issuing
import { BookService, IssuingService } from "../../services"; // Предположим, что у вас есть сервис IssuingService

const issuingService = new IssuingService();
const bookService = new BookService();

const baseColumns = [
  { field: "dateIssue", header: "Дата выдачи" },
  { field: "dateReturn", header: "Дата возврата" },
  { field: "bookId", header: "Книга" },
  { field: "libraryCardId", header: "ID библиотечного билета" },
];

export function IssuingPage() {
  const [isOpenToggleColumns, setIsOpenToggleColumns] = useState<boolean>(false);
  const [columns, setColumns] = useState<column[]>();
  const [baseIssuings, setBaseIssuings] = useState<issuing[]>();
  const [issuings, setIssuings] = useState<issuing[]>(); 
  const [search, setSearch] = useState<string>();
  const [selectedIssuing, setSelectedIssuing] = useState<issuing | null>(null); 
  const [isOpen, setIsOpen] = useState(false);

  const formatIssuings = async (issuings: issuing[]) => {
    const formattedBooks = await Promise.all(
      issuings.map(async (issuing) => {
        const book = await bookService.getById(+issuing.bookId);
        return ({
          ...issuing,
          bookId: book.name,
        })
      })
    );
    return formattedBooks;
  }

  const updateIssuings = async () => {
    const issuings = await issuingService.get();
    const formattedIssuings = await formatIssuings(issuings);
    setBaseIssuings(formattedIssuings);
    setColumns(baseColumns);
    setIssuings(baseIssuings)
  }

  const handleEdit = (issuing: issuing) => {
    setSelectedIssuing(issuing);
    setIsOpen(true);
  }

  const handleDelete = (issuing: issuing) => {
    issuingService.delete(issuing.id || 0).then(() => {
      updateIssuings();
    })
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleAdd = () => {
    setSelectedIssuing(null);
    setIsOpen(true);
  }

  const handleSave = (id: number, newIssuing: issuing) => {
    if (selectedIssuing) issuingService.put(id, newIssuing).then(() => updateIssuings());
    if (!selectedIssuing) issuingService.post(newIssuing).then(() => updateIssuings());
    setIsOpen(false);
  }

  useEffect(() => {
    updateIssuings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!baseIssuings) return;
    if (!search) return setIssuings(baseIssuings);

    const filteredBooks = baseIssuings.filter((b) =>
      b.bookId.toString().indexOf(search) !== -1 || 
      b.dateIssue.toLocaleString().indexOf(search) !== - 1 ||
      b.dateReturn.toLocaleString().indexOf(search) !== -1 
    );

    setIssuings(filteredBooks);
  }, [baseIssuings, search]);

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
            <DataTable columns={columns || []} data={issuings || []} handleCreate={handleAdd} handleDelete={handleDelete} handleEdit={handleEdit}/> 
          </Flex>
        </Flex>
      </Flex>
      <IssuingModal isOpen={isOpen} onClose={handleClose} issuing={selectedIssuing} onSave={handleSave} />
    </Box>
  );
}
