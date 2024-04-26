import { DataTable as Table } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TableWrapper } from "./TableWrapper";
import { column } from "../../types";
import { ButtonGroup, Flex } from '@chakra-ui/react';
import { CiEdit } from "react-icons/ci";

type DataTableProps = {
  columns: column[];
  data: any[];
  handleDelete: Function;
  handleEdit: Function;
  handleCreate: Function;
}

export function DataTable({columns, data, handleCreate, handleDelete, handleEdit}: DataTableProps) {
  return (
    <TableWrapper>
      <Table editMode="row" value={data} paginator={columns.length > 0} rows={8} resizableColumns>
        {columns.map(({header, field}) => (
          <Column key={field} field={field} header={header} sortable></Column>
        ))}
        <Column body={(rowData) => (
              <ButtonGroup cursor="pointer">
                <Flex bg="#3182CE" borderRadius="5px" color="white" w="24px" h="24px" align="center" justify="center" onClick={() => handleCreate()}>
                  +
                </Flex>
                <Flex bg="#FF5551" borderRadius="5px" color="white" w="24px" h="24px" align="center" justify="center" onClick={() => handleDelete(rowData)}>
                  -
                </Flex>
                <Flex bg="#FFCE51" borderRadius="5px" w="24px" h="24px" align="center" justify="center" onClick={() => handleEdit(rowData)}>
                  <CiEdit size="18px" fill="white"/>
                </Flex>
              </ButtonGroup>
            )}></Column>
      </Table>
    </TableWrapper>
  )
}