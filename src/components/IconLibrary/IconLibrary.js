/* eslint-disable no-debugger */
import React, { useEffect, useState } from 'react';
import { Search, Dropdown } from 'carbon-components-react';
import { pickBy, groupBy } from 'lodash';
import * as iconsReact from '@carbon/icons-react';

import iconMetaData from './iconMetaData';
import { filterRow, iconLibrary } from './IconLibrary.module.scss';

import IconCategory from './IconCategory';

const IconLibrary = () => {
  const [iconComponents, setIconComponents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All icons');
  const [searchInputValue, setSearchInputValue] = useState('');

  useEffect(() => {
    const iconComponentList = pickBy(
      iconsReact,
      (val, key) => key.slice(-2) === '32'
    );

    const iconArray = Object.keys(iconMetaData).map(icon => ({
      ...iconMetaData[icon],
      // If the icon is unprefixed and starts with a number, add an underscore
      Component:
        iconComponentList[isNaN(icon[0]) ? `${icon}32` : `_${icon}32`] ||
        iconComponentList[`WatsonHealth${icon}32`] ||
        iconComponentList[`Q${icon}32`],
    }));
    setIconComponents(iconArray);
  }, []);

  const filteredIcons = !searchInputValue
    ? iconComponents
    : iconComponents.filter(
        icon =>
          icon.friendly_name
            .toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          (icon.categories &&
            icon.categories[0] &&
            icon.categories[0].subcategory
              .toLowerCase()
              .includes(searchInputValue.toLowerCase())) ||
          (icon.aliases.length > 0 &&
            icon.aliases.some(alias =>
              alias.toLowerCase().includes(searchInputValue.toLowerCase())
            ))
      );

  const categories = Object.entries(
    groupBy(filteredIcons, 'categories[0].name')
  );

  const filteredCategories =
    selectedCategory === 'All icons'
      ? categories
      : categories.filter(([category]) => category === selectedCategory);

  return (
    <div className={iconLibrary}>
      <div className={filterRow}>
        <Search
          small
          light
          labelText="filter icons by searching for their name or subcategory"
          onChange={e => setSearchInputValue(e.currentTarget.value)}
          placeHolderText={`Search by descriptors like "add", or "check"`}
        />
        <Dropdown
          id="category-filter"
          direction="bottom"
          light
          initialSelectedItem="All icons"
          titleText="Category"
          onChange={({ selectedItem }) => setSelectedCategory(selectedItem)}
          label="Filter icons by category"
          items={['All icons', ...categories.map(([category]) => category)]}
        />
      </div>
      {filteredCategories.map(([category, icons]) => (
        <IconCategory key={category} category={category} icons={icons} />
      ))}
    </div>
  );
};
export default IconLibrary;
