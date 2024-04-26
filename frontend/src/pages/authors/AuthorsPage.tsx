import { Box, Checkbox, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import { AuthorModal, DataTable } from "../../components";
import { FaSearch } from "react-icons/fa";
import { AiOutlineFilter } from "react-icons/ai";
import { useEffect, useState } from "react";
import { author, column } from "../../types";
import { AuthorService } from "../../services";

const service = new AuthorService();

const baseColumns = [
  {field: "firstName", header: "Имя"},
  {field: "lastName", header: "Фамилия"},
  {field: "middleName", header: "Отчество"},
]

export function AuthorsPage() {
  const [isOpenToggleColumns, setIsOpenToggleColumns] = useState<boolean>(false); 
  const [columns, setColumns] = useState<column[]>();
  const [baseAuthors, setBaseAuthors] = useState<author[]>();
  const [authors, setAuthors] = useState<author[]>();
  const [search, setSearch] = useState<string>();
  const [selectedAuthor, setSelectedAuthor] = useState<author | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = (author: author) => {
    setSelectedAuthor(author);
    setIsOpen(true);
  }

  const updateAuthors = () => {
    service.get().then((authors) => setBaseAuthors(authors));
    setColumns(baseColumns);
    setAuthors(baseAuthors)
  }

  const handleDelete = (author: author) => {
    service.delete(author.id || 0).then(() => {
      updateAuthors();
    })
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleAdd = () => {
    setSelectedAuthor(null);
    setIsOpen(true);
  }

  const handleSave = (id: number, newAuthor: author) => {
    if (selectedAuthor) service.put(id, newAuthor).then(() => updateAuthors());
    if (!selectedAuthor) service.post(newAuthor).then(() => updateAuthors());
    setIsOpen(false);
  }

  useEffect(() => {
    updateAuthors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!baseAuthors) return;
    if (!search) return setAuthors(baseAuthors);
    
    const filteredAuthors = baseAuthors.filter((a) => 
      a.firstName.indexOf(search) !== -1 || 
      a.middleName.indexOf(search) !== -1 || 
      a.lastName.indexOf(search) !== -1 ||
      a.id?.toString().indexOf(search) !== -1
    );
  
    setAuthors(filteredAuthors);
  }, [baseAuthors, search]);

  const handleOpenToggleColumns = () => {
    setIsOpenToggleColumns(!isOpenToggleColumns);
  }

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
            <DataTable columns={columns || []} data={authors || []} handleCreate={handleAdd} handleDelete={handleDelete} handleEdit={handleEdit}/> 
          </Flex>
        </Flex>
      </Flex>
      <AuthorModal isOpen={isOpen} onClose={handleClose} author={selectedAuthor} onSave={handleSave} />
    </Box>
  )
}