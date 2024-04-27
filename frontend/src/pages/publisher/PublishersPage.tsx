import { Box, Checkbox, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import { PublisherModal, DataTable } from "../../components";
import { FaSearch } from "react-icons/fa";
import { AiOutlineFilter } from "react-icons/ai";
import { useEffect, useState } from "react";
import { publisher, column } from "../../types";
import { CityService, PublisherService } from "../../services"; 

const publisherService = new PublisherService();
const citiesService = new CityService();
const baseColumns = [
  { field: "name", header: "Название" },
  { field: "cityId", header: "Город" },
];

export function PublishersPage() {
  const [isOpenToggleColumns, setIsOpenToggleColumns] = useState<boolean>(false);
  const [columns, setColumns] = useState<column[]>();
  const [basePublishers, setBasePublishers] = useState<publisher[]>();
  const [publishers, setPublishers] = useState<publisher[]>();
  const [search, setSearch] = useState<string>();
  const [selectedPublisher, setSelectedPublisher] = useState<publisher | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const formatPublishers = async (publishers: publisher[]) => {
    const formattedPublishers = await Promise.all(
      publishers.map(async (publisher) => {
        const city = await citiesService.getById(+publisher.cityId);
        return ({
          name: publisher.name,
          cityId: city.name,
        })
      })
    );
    return formattedPublishers;
  }

  const updatePublishers = async () => {
    const publishers = await publisherService.get();
    const formattedPublishers = await formatPublishers(publishers);
    setBasePublishers(formattedPublishers);
    setColumns(baseColumns);
    setPublishers(basePublishers);
  }

  const handleEdit = (publisher: publisher) => {
    setSelectedPublisher(publisher);
    setIsOpen(true);
  }

  const handleDelete = (publisher: publisher) => {
    publisherService.delete(publisher.id || 0).then(() => {
      updatePublishers();
    })
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleAdd = () => {
    setSelectedPublisher(null);
    setIsOpen(true);
  }

  const handleSave = (id: number, newPublisher: publisher) => {
    if (selectedPublisher) publisherService.put(id, newPublisher).then(() => updatePublishers());
    if (!selectedPublisher) publisherService.post(newPublisher).then(() => updatePublishers());
    setIsOpen(false);
  }

  useEffect(() => {
    updatePublishers();
  }, []);

  useEffect(() => {
    if (!basePublishers) return;
    if (!search) return setPublishers(basePublishers);

    const filteredPublishers = basePublishers.filter((p) =>
      p.name.indexOf(search) !== -1
    );

    setPublishers(filteredPublishers);
  }, [basePublishers, search]);

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
          ) :null}
          <Flex w="100%" justify="center">
            <DataTable columns={columns || []} data={publishers || []} handleCreate={handleAdd} handleDelete={handleDelete} handleEdit={handleEdit}/> 
          </Flex>
        </Flex>
      </Flex>
      <PublisherModal isOpen={isOpen} onClose={handleClose} publisher={selectedPublisher} onSave={handleSave} />
    </Box>
  );
}