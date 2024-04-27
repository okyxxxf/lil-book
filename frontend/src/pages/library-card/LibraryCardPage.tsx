import { Box, Checkbox, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import { LibraryCardModal, DataTable } from "../../components";
import { FaSearch } from "react-icons/fa";
import { AiOutlineFilter } from "react-icons/ai";
import { useEffect, useState } from "react";
import { libraryCard, column } from "../../types";
import { LibraryCardService } from "../../services"; 

const libraryCardService = new LibraryCardService();
const baseColumns = [
  { field: "dateCreated", header: "Дата создания" },
  { field: "reader", header: "Читатель" },
];

export function LibraryCardsPage() {
  const [isOpenToggleColumns, setIsOpenToggleColumns] = useState<boolean>(false);
  const [columns, setColumns] = useState<column[]>();
  const [baseLibraryCards, setBaseLibraryCards] = useState<libraryCard[]>();
  const [libraryCards, setLibraryCards] = useState<libraryCard[]>();
  const [search, setSearch] = useState<string>();
  const [selectedLibraryCard, setSelectedLibraryCard] = useState<libraryCard | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const formatLibraryCards = (libraryCards: libraryCard[]) => {
    const formattedLibraryCards = 
      libraryCards.map( (libraryCard) => {
        const {reader} = libraryCard;
        if (typeof reader === "string") return ({
          id: libraryCard.id,
          dateCreated: new Date(libraryCard.dateCreated).toLocaleDateString(),
          reader: reader,
          readerId: libraryCard.readerId,
        });
        return ({
          id: libraryCard.id,
          dateCreated: new Date(libraryCard.dateCreated).toLocaleDateString(),
          reader: reader?.firstName + " " + reader?.lastName,
          readerId: reader?.id,
        })
      })
    return formattedLibraryCards;
  }

  const updateLibraryCards = async () => {
    const libraryCards = await libraryCardService.get();
    const formattedLibraryCards = formatLibraryCards(libraryCards);
    setBaseLibraryCards(formattedLibraryCards);
    setColumns(baseColumns);
    setLibraryCards(baseLibraryCards);
  }

  const handleEdit = (libraryCard: libraryCard) => {
    setSelectedLibraryCard(libraryCard);
    setIsOpen(true);
  }

  const handleDelete = (libraryCard: libraryCard) => {
    libraryCardService.delete(libraryCard.id || 0).then(() => {
      updateLibraryCards();
    })
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleAdd = () => {
    setSelectedLibraryCard(null);
    setIsOpen(true);
  }

  const handleSave = (id: number, newLibraryCard: libraryCard) => {
    if (selectedLibraryCard) {
      if (typeof newLibraryCard.reader === "string") libraryCardService.put(id, 
        {id: id, dataCreated: newLibraryCard.dateCreated, readerId: newLibraryCard.readerId}
      ).then(() => updateLibraryCards());
    }
    if (!selectedLibraryCard) libraryCardService.post(newLibraryCard).then(() => updateLibraryCards());
    setIsOpen(false);
  }

  useEffect(() => {
    updateLibraryCards();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!baseLibraryCards) return;
    if (!search) return setLibraryCards(baseLibraryCards);

    const filteredLibraryCards = baseLibraryCards.filter((lc) =>
      lc.dateCreated.toLocaleString().indexOf(search) !== -1
    );

    setLibraryCards(filteredLibraryCards);
  }, [baseLibraryCards, search]);

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
            <DataTable columns={columns || []} data={libraryCards || []} handleCreate={handleAdd} handleDelete={handleDelete} handleEdit={handleEdit}/> 
          </Flex>
        </Flex>
      </Flex>
      <LibraryCardModal isOpen={isOpen} onClose={handleClose} libraryCard={selectedLibraryCard} onSave={handleSave} />
    </Box>
  );
}
