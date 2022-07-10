import React from 'react';
import qs from 'qs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';

import { PizzaItem } from '../components/PizzaItem/PizzaItem';
import { PizzaSkeleton } from '../components/PizzaItem/PizzaSkeleton';
import { Sort, sortList } from '../components/Sort/Sort';
import { Categories } from '../components/Categories/Categories';
import { Pagination } from '../components/Pagination/Pagination';
import { SearchContext } from '../App';

export const Home = ({}) => {
  const navigate = useNavigate();
  const categoryId = useSelector((state) => state.filterReducer.categoryId);
  const sortType = useSelector((state) => state.filterReducer.sort.sortProperty);
  const currentPage = useSelector((state) => state.filterReducer.currentPage);
  const dispatch = useDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { searchItem } = React.useContext(SearchContext);

  const [pizzaItem, setPizzaItem] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  //   .filter((obj) => obj.name.toLowerCase().includes(searchItem.toLowerCase())) для статичного массива
  const pizzas = pizzaItem.map((pizza, index) => {
    return <PizzaItem key={`${pizza}_${index}`} {...pizza} />;
  });
  const pizzaSkeletons = [...new Array(6)].map((_, index) => <PizzaSkeleton key={index} />);

  const fetchPizzas = () => {
    setIsLoading(true);

    const order = sortType.includes('-') ? 'asc' : 'desc';
    const sortBy = sortType.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchItem ? `&search=${searchItem}` : '';

    // Мокапи плохо работает с несколькими фильтрами, по факту ког корректен(можно отследить по запросу в network), но данный бэкэенд отрабатывает некорректно
    axios
      .get(
        `https://6239edd3bbe20c3f66cc651e.mockapi.io/pizzas?page=${currentPage}&limit=8&${category}&sortBy=${sortBy}&order=${order}${search}`,
      )
      .then((res) => {
        setPizzaItem(res.data);
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = sortList.find((obj) => obj.sortProperty === params.sortType);
      dispatch(
        setFilters({
          ...params,
          sort,
        }),
      );
      isSearch.current = true;
    }
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      fetchPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sortType, searchItem, currentPage]);

  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortType,
        categoryId,
        currentPage,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sortType, searchItem, currentPage]);

  return (
    <div className="container">
      <div className="content__top">
        <Categories category={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? pizzaSkeletons : pizzas}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};
