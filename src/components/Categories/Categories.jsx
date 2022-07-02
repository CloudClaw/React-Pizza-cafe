import React from 'react';

export const Categories = ({ category, onChangeCategory }) => {
  const categoryArray = ['все', 'Мясные', 'Вегетарианские', 'Гриль', 'Острые', 'Закрытые'];

  return (
    <div className="categories">
      <ul>
        {categoryArray.map((categoryName, index) => {
          return (
            <li
              onClick={() => onChangeCategory(index)}
              key={`${categoryName}_${index}`}
              className={category == index ? 'active' : ''}>
              {categoryName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
