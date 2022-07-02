import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setCategoryId } from '../redux/slices/filterSlice';

import { PizzaItem } from '../components/PizzaItem/PizzaItem';
import { PizzaSkeleton } from '../components/PizzaItem/PizzaSkeleton';
import { Sort } from '../components/Sort/Sort';
import { Categories } from '../components/Categories/Categories';
import { Pagination } from '../components/Pagination/Pagination';
import { SearchContext } from '../App';

export const Home = ({}) => {
  const categoryId = useSelector((state) => state.filterReducer.categoryId);
  const sortType = useSelector((state) => state.filterReducer.sort.sortProperty);
  const dispatch = useDispatch();

  const { searchItem } = React.useContext(SearchContext);

  const [pizzaItem, setPizzaItem] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  //   .filter((obj) => obj.name.toLowerCase().includes(searchItem.toLowerCase())) для статичного массива
  const pizzas = pizzaItem.map((pizza, index) => {
    return <PizzaItem key={`${pizza}_${index}`} {...pizza} />;
  });
  const pizzaSkeletons = [...new Array(6)].map((_, index) => <PizzaSkeleton key={index} />);

  React.useEffect(() => {
    setIsLoading(true);

    const order = sortType.includes('-') ? 'asc' : 'desc';
    const sortBy = sortType.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchItem ? `&search=${searchItem}` : '';

    fetch(
      // Мокапи плохо работает с несколькими фильтрами, по факту ког корректен(можно отследить по запросу в network), но данный бэкэенд отрабатывает некорректно
      `https://6239edd3bbe20c3f66cc651e.mockapi.io/pizzas?page=${currentPage}&limit=8&${category}&sortBy=${sortBy}&order=${order}${search}`,
    )
      .then((response) => response.json())
      .then((pizzas) => {
        setPizzaItem(pizzas);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sortType, searchItem, currentPage]);

  return (
    <div className="container">
      <div className="content__top">
        <Categories category={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? pizzaSkeletons : pizzas}</div>
      <Pagination onChangePage={(number) => setCurrentPage(number)} />
    </div>
  );
};
