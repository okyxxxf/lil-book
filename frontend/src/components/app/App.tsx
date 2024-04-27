import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AsideLayout, HeaderLayout } from '../../layouts';
import { AuthPage, BooksPage, AuthorsPage, CityPage, PublishersPage, ReadersPage, LibraryCardsPage, BookingsPage } from '../../pages';
import { Box } from '@chakra-ui/react';

export function App() {
  return (
    <Box fontFamily="inter">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeaderLayout/>}>
          <Route path="/" element={<AuthPage/>}/>
          <Route path="/admin" element={<AsideLayout/>}>
            <Route path="/admin/authors" element={<AuthorsPage/>}/>
            <Route path="/admin/books" element={<BooksPage/>}/>
            <Route path="/admin/cities" element={<CityPage/>}/>
            <Route path="/admin/issuings" element={<>Issuing</>}/>
            <Route path="/admin/library-cards" element={<LibraryCardsPage/>}/>
            <Route path="/admin/publishers" element={<PublishersPage/>}/>
            <Route path="/admin/readers" element={<ReadersPage/>}/>
            <Route path="/admin/booking" element={<BookingsPage/>}/>
          </Route>
        </Route>
      </Routes>
      </BrowserRouter>
    </Box>
  );
}
