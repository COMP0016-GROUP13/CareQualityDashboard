import { shallow, mount } from 'enzyme';
import SearchFilter from './SearchFilter.js';
import React from 'react';
describe('SearchFilter', () => {
  it('renders', () => {
    const wrapper = shallow(
      <SearchFilter
        data={['aaa', 'bbb', 'ccc']}
        setSearchTerm={''}
        searchTerm={''}
      />
    );
    expect(wrapper.exists()).toBe(true);
  });
});
