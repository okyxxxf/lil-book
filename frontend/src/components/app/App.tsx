import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from '../header/Header';

export function App() {
  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<Header/>}>
        <Route path="/" element={<>Auth</>}/>
        <Route path="/admin" element={<>latoyt admin</>}>
          <Route path="/admin/authors" element={<>Авторы</>}/>
          <Route path="/admin/books" element={<>Books</>}/>
          <Route path="/admin/cities" element={<>City</>}/>
          <Route path="/admin/issuings" element={<>Issuing</>}/>
          <Route path="/admin/library-cards" element={<>Lib cards</>}/>
          <Route path="/admin/publishers" element={<>Publisher</>}/>
          <Route path="/admin/reader" element={<>Reader</>}/>
        </Route>
      </Route>
     </Routes>
    </BrowserRouter>
  );
}
