import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AsideLayout, HeaderLayout } from '../../layouts';
import { AuthPage } from '../../pages';
import { AuthorsPage } from '../../pages/authors/AuthorsPage';

export function App() {
  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<HeaderLayout/>}>
        <Route path="/" element={<AuthPage/>}/>
        <Route path="/admin" element={<AsideLayout/>}>
          <Route path="/admin/authors" element={<AuthorsPage/>}/>
          <Route path="/admin/books" element={<>Books</>}/>
          <Route path="/admin/cities" element={<>City</>}/>
          <Route path="/admin/issuings" element={<>Issuing</>}/>
          <Route path="/admin/library-cards" element={<>Lib cards</>}/>
          <Route path="/admin/publishers" element={<>Publisher</>}/>
          <Route path="/admin/readers" element={<>Reader</>}/>
          <Route path="/admin/booking" element={<>Booking</>}/>
        </Route>
      </Route>
     </Routes>
    </BrowserRouter>
  );
}
