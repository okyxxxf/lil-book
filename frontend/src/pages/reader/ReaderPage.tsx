import { Box, Checkbox, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import { ReaderModal, DataTable } from "../../components";
import { FaSearch } from "react-icons/fa";
import { AiOutlineFilter } from "react-icons/ai";
import { useEffect, useState } from "react";
import { reader, column } from "../../types";
import { ReaderService } from "../../services";

const service = new ReaderService();

const baseColumns = [
  { field: "firstName", header: "Имя" },
  { field: "lastName", header: "Фамилия" },
  { field: "middleName", header: "Отчество" },
  { field: "phone", header: "Телефон" },
  { field: "address", header: "Адрес" },
];

export function ReadersPage() {
  const [isOpenToggleColumns, setIsOpenToggleColumns] = useState<boolean>(false);
  const [columns, setColumns] = useState<column[]>();
  const [baseReaders, setBaseReaders] = useState<reader[]>();
  const [readers, setReaders] = useState<reader[]>();
  const [search, setSearch] = useState<string>();
  const [selectedReader, setSelectedReader] = useState<reader | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = (reader: reader) => {
    setSelectedReader(reader);
    setIsOpen(true);
  };

  const updateReaders = () => {
    service.get().then((readers) => setBaseReaders(readers));
    setColumns(baseColumns);
    setReaders(baseReaders);
  };

  const handleDelete = (reader: reader) => {
    service.delete(reader.id || 0).then(() => {
      updateReaders();
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAdd = () => {
    setSelectedReader(null);
    setIsOpen(true);
  };

  const handleSave = (id: number, newReader: reader) => {
    if (selectedReader) service.put(id, newReader).then(() => updateReaders());
    if (!selectedReader) service.post(newReader).then(() => updateReaders());
    setIsOpen(false);
  };

  useEffect(() => {
    updateReaders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!baseReaders) return;
    if (!search) return setReaders(baseReaders);

    const filteredReaders = baseReaders.filter(
      (r) =>
        r.firstName.indexOf(search) !== -1 ||
        r.middleName.indexOf(search) !== -1 ||
        r.lastName.indexOf(search) !== -1 ||
        r.phone.indexOf(search) !== -1 ||
        r.address.indexOf(search) !== -1
    );

    setReaders(filteredReaders);
  }, [baseReaders, search]);

  const handleOpenToggleColumns = () => {
    setIsOpenToggleColumns(!isOpenToggleColumns);
  };

  const toggleColumn = ({ field, header }: column, isCheck: boolean) => {
    if (!columns) return setColumns([{ field: field, header: header }]);

    if (columns.length === baseColumns.length && isCheck) return setColumns([{ field: field, header: header }]);

    const index = columns?.findIndex((c) => c.field === field && c.header === header);

    if (index === -1) {
      return setColumns([...columns, { field: field, header: header }]);
    }

    if (index + 1 === columns.length) return setColumns(baseColumns.sort());

    setColumns([...columns.slice(0, index), ...columns.slice(index + 1)]);
  };

  return (
    <Box w="100%" bg="gray.200" h="calc(100vh - 88px)">
      <Flex align="center" justify="center" m="50px" bg="white" borderRadius="5px" direction="column" p="20px" gap="20px">
        <Flex gap="10px" w="100%">
          <Flex gap="5px" align="center" cursor="pointer" onClick={handleOpenToggleColumns}>
            <Text userSelect="none">Поля</Text>
            <AiOutlineFilter />
          </Flex>
          <InputGroup alignItems="center">
            <InputLeftElement>
              <FaSearch />
            </InputLeftElement>
            <Input placeholder="Поиск" value={search} onChange={(e) => setSearch(e.target.value)} />
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
            <DataTable columns={columns || []} data={readers || []} handleCreate={handleAdd} handleDelete={handleDelete} handleEdit={handleEdit}/> 
          </Flex>
        </Flex>
      </Flex>
      <ReaderModal isOpen={isOpen} onClose={handleClose} reader={selectedReader} onSave={handleSave} />
    </Box>
  );
}
