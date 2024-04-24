import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<>layout</>}>
        <Route path="/" element={<>Auth</>}/>
        <Route path="/admin" element={<>latoyt admin</>}>
          <Route path="/authors" element={<>Авторы</>}/>
          <Route path="/books" element={<>Books</>}/>
          <Route path="/cities" element={<>City</>}/>
          <Route path="/issuings" element={<>Issuing</>}/>
          <Route path="/library-cards" element={<>Lib cards</>}/>
          <Route path="/publishers" element={<>Publisher</>}/>
          <Route path="/reader" element={<>Reader</>}/>
        </Route>
      </Route>
     </Routes>
    </BrowserRouter>
  );
}
