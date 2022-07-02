import React from 'react';
import '../src/scss/app.scss';
import { Header } from './components/Header/Header';
import { Home } from './pages/Home';
import { ErrorPage } from './pages/ErrorPage/ErrorPage';
import { Cart } from './pages/Cart';

import { Routes, Route } from 'react-router-dom';

export const SearchContext = React.createContext();

function App() {
  const [searchItem, setSearchItem] = React.useState('');

  return (
    <div className="wrapper">
      <SearchContext.Provider value={{ searchItem, setSearchItem }}>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </SearchContext.Provider>
    </div>
  );
}

export default App;
