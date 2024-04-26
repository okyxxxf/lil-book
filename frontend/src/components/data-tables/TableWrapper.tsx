import styled from "styled-components";

export const TableWrapper = styled.div`
  background-color: white;
  max-width: 1200px;
  font-size: 16px;
  color: black;
  font-weight: 700;
  width: 100%;

  & th {
    padding: 10px;
    border: 1px solid #EDF2F7;

    & > .p-column-header-content {
      gap: 10px;
    }
  }

  & td {
    padding: 15px;
    border: 1px solid #EDF2F7;
  }

  & .p-datatable-thead {
    background-color: #D9D9D9;
  }

  & .p-paginator {
    padding: 20px 0;
    gap: 10px;

    & .p-paginator-prev, 
    .p-paginator-next, 
    .p-paginator-last, 
    .p-paginator-first,
    .p-paginator-page {
      width: 46px;
      height: 46px;
      border-radius: 50%;

      &.p-disabled {
        border: 1px solid #A0AEC0;
      }

      &:not(.p-disabled) {
        border: 1px solid #F56565;
        color: #F56565;
        transition: 0.4s;

        &:hover {
          background-color: #F56565;
          color: white;
        }
      }
    }

    & > .p-paginator-pages {
      display: flex;
      gap: 10px;
      & > .p-highlight {
        background-color: #F56565;
        color: white;
      }
    }
  }
`