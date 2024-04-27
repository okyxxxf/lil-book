// CityPage.tsx

import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Input, InputGroup, InputLeftElement, Checkbox, VStack } from '@chakra-ui/react';
import { AiOutlineFilter } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';
import { city, column } from '../../types';
import { CityService } from '../../services';
import { CityModal, DataTable } from '../../components';

const baseColumns = [
  {field: "name", header: "Название"},
];

const service = new CityService();

export function CityPage() {
  const [isOpenToggleColumns, setIsOpenToggleColumns] = useState<boolean>(false);
  const [columns, setColumns] = useState<column[]>();
  const [baseCities, setBaseCities] = useState<city[]>();
  const [cities, setCities] = useState<city[]>();
  const [search, setSearch] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<city | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = (city: city) => {
    setSelectedCity(city);
    setIsOpen(true);
  }

  const updateCities = () => {
    service.get().then((citys) => setBaseCities(citys));
    setColumns(baseColumns);
    setCities(baseCities)
  }

  const handleDelete = (city: city) => {
    service.delete(city.id || 0).then(() => {
      updateCities();
    })
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleAdd = () => {
    setSelectedCity(null);
    setIsOpen(true);
  }

  const handleSave = (id: number, newcity: city) => {
    if (selectedCity) service.put(id, newcity).then(() => updateCities());
    if (!selectedCity) service.post(newcity).then(() => updateCities());
    setIsOpen(false);
  }

  useEffect(() => {
    updateCities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!baseCities) return;
    if (!search) return setCities(baseCities);
    
    const filteredcitys = baseCities.filter((c) => c.name.indexOf(search) !== -1 );
  
    setCities(filteredcitys);
  }, [baseCities, search]);

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
            <DataTable columns={columns || []} data={cities || []} handleCreate={handleAdd} handleDelete={handleDelete} handleEdit={handleEdit}/> 
          </Flex>
        </Flex>
      </Flex>
      <CityModal isOpen={isOpen} onClose={handleClose} city={selectedCity} onSave={handleSave} />
    </Box>
  );
}
