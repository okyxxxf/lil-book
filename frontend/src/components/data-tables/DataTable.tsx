import { DataTable as Table } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TableWrapper } from "./TableWrapper";
import { column } from "../../types";
import { Button, ButtonGroup } from '@chakra-ui/react';
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
              <ButtonGroup>
                <Button colorScheme="blue" onClick={() => handleCreate()}>+</Button>
                <Button colorScheme="red" onClick={() => handleDelete(rowData)}>-</Button>
                <Button colorScheme="yellow" onClick={() => handleEdit(rowData)}><CiEdit/></Button>
              </ButtonGroup>
            )}></Column>
      </Table>
    </TableWrapper>
  )
}