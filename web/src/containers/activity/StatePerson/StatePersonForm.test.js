import { shallow, mount } from 'enzyme';
import React from 'react';

import {
  plain as StatePersonForm,
  mapDispatchToProps
} from './StatePersonForm';

import {
  setPersonnelFTEForYear,
  setPersonnelCostForYear,
  setPersonnelDescription,
  setPersonnelTitle
} from '../../../actions/editActivity';

describe('the StatePersonForm component', () => {
  const setCost = jest.fn();
  const setDescription = jest.fn();
  const setFTE = jest.fn();
  const setTitle = jest.fn();

  const component = shallow(
    <StatePersonForm
      activityIndex={6}
      index={83}
      item={{
        description: 'personnel desc',
        title: 'personnel title',
        years: {
          7473: { amt: 2398235, perc: 3 },
          7474: { amt: 72323, perc: 1 }
        }
      }}
      setCost={setCost}
      setDescription={setDescription}
      setFTE={setFTE}
      setTitle={setTitle}
    />
  );

  beforeEach(() => {
    setCost.mockClear();
    setDescription.mockClear();
    setFTE.mockClear();
    setTitle.mockClear();
  });

  test('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });

  describe('events', () => {
    test('handles changing the personnel title', () => {
      component
        .findWhere(c => c.name() === 'TextField' && c.prop('name') === 'title')
        .simulate('change', { target: { value: 'new title' } });
      expect(setTitle).toHaveBeenCalledWith(6, 83, 'new title');
    });

    test('handles changing the personnel desc', () => {
      component
        .findWhere(c => c.name() === 'TextArea' && c.prop('name') === 'desc')
        .simulate('change', { target: { value: 'new desc' } });
      expect(setDescription).toHaveBeenCalledWith(6, 83, 'new desc');
    });

    test('handles changing the personnel cost total for a year', () => {
      mount(
        <StatePersonForm
          activityIndex={6}
          index={83}
          item={{
            description: 'personnel desc',
            title: 'personnel title',
            years: {
              7473: { amt: 2398235, perc: 3 },
              7474: { amt: 72323, perc: 1 }
            }
          }}
          setCost={setCost}
          setDescription={setDescription}
          setFTE={setFTE}
          setTitle={setTitle}
        />
      )
        .find('input[name="cost"]')
        .first()
        .simulate('change', { target: { value: '110000' } });
      expect(setCost).toHaveBeenCalledWith(6, 83, '7473', 110000);
    });

    test('handles changing the personnel FTE for a year', () => {
      mount(
        <StatePersonForm
          activityIndex={6}
          index={83}
          item={{
            description: 'personnel desc',
            title: 'personnel title',
            years: {
              7473: { amt: 2398235, perc: 3 },
              7474: { amt: 72323, perc: 1 }
            }
          }}
          setCost={setCost}
          setDescription={setDescription}
          setFTE={setFTE}
          setTitle={setTitle}
        />
      )
        .find('input[name="ftes"]')
        .first()
        .simulate('change', { target: { value: '0.5' } });
      expect(setFTE).toHaveBeenCalledWith(6, 83, '7473', '0.5');
    });
  });

  it('maps dispatch actions to props', () => {
    expect(mapDispatchToProps).toEqual({
      setFTE: setPersonnelFTEForYear,
      setCost: setPersonnelCostForYear,
      setDescription: setPersonnelDescription,
      setTitle: setPersonnelTitle
    });
  });
});
