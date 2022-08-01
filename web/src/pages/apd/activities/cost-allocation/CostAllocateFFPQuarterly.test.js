import React from 'react';
import { renderWithConnection, act, screen } from 'apd-testing-library';
import userEvent from '@testing-library/user-event';

import {
  plain as CostAllocateFFPQuarterly,
  makeMapStateToProps,
  mapDispatchToProps
} from './CostAllocateFFPQuarterly';

import {
  setFFPForInHouseCostsForFiscalQuarter,
  setFFPForContractorCostsForFiscalQuarter
} from '../../../../redux/actions/editActivity';
import { ariaAnnounceFFPQuarterly } from '../../../../redux/actions/aria';

const quarterlyFFP = {
  2013: {
    1: {
      combined: { dollars: 35769 },
      contractors: { dollars: 7392, percent: 0.85 },
      inHouse: { dollars: 9384, percent: 0.37 }
    },
    2: {
      combined: { dollars: 5298 },
      contractors: { dollars: 4258, percent: 0.35 },
      inHouse: { dollars: 25, percent: 0.83 }
    },
    3: {
      combined: { dollars: 952863 },
      contractors: { dollars: 72533522, percent: 0.19 },
      inHouse: { dollars: 278, percent: 0.27 }
    },
    4: {
      combined: { dollars: 953638 },
      contractors: { dollars: 9275, percent: 0.99 },
      inHouse: { dollars: 2357, percent: 0.72 }
    },
    subtotal: {
      combined: { dollars: 3475 },
      contractors: { dollars: 972465, percent: 0.99 },
      inHouse: { dollars: 47939, percent: 0.72 }
    }
  },
  2014: {
    1: {
      combined: { dollars: 846 },
      contractors: { dollars: 3457, percent: 0.85 },
      inHouse: { dollars: 2753, percent: 0.37 }
    },
    2: {
      combined: { dollars: 4856 },
      contractors: { dollars: 2345, percent: 0.35 },
      inHouse: { dollars: 3754, percent: 0.83 }
    },
    3: {
      combined: { dollars: 4976 },
      contractors: { dollars: 26, percent: 0.19 },
      inHouse: { dollars: 2754, percent: 0.27 }
    },
    4: {
      combined: { dollars: 4976 },
      contractors: { dollars: 2458, percent: 0.99 },
      inHouse: { dollars: 3865, percent: 0.72 }
    },
    subtotal: {
      combined: { dollars: 27364 },
      contractors: { dollars: 457, percent: 0.99 },
      inHouse: { dollars: 987125, percent: 0.72 }
    }
  }
};

const defaultProps = {
  activityIndex: 0,
  aKey: 'key',
  announce: jest.fn(),
  isViewOnly: false,
  setContractorFFP: jest.fn(),
  setInHouseFFP: jest.fn(),
  year: '2013'
};

const setup = async (props = {}) => {
  let util;
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    util = renderWithConnection(
      <CostAllocateFFPQuarterly {...defaultProps} {...props} />,
      {
        initialState: {
          apd: {
            data: {
              years: ['2013', '2014']
            },
            adminCheck: false
          },
          budget: {
            activities: {
              ['key']: {
                quarterlyFFP: { ...quarterlyFFP }
              }
            }
          }
        }
      }
    );
  });
  const user = userEvent.setup();
  return {
    util,
    user
  };
};

describe('the cost allocation quarterly FFP component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('shows something', async () => {
    const { util } = await setup();

    expect(screen.getByLabelText('Introduction')).toHaveValue(
      'it is really cool'
    );
  });

  // it('gracefully falls back if the quarterly FFP is not ready', () => {
  //   expect(
  //     shallow(
  //       <CostAllocateFFPQuarterly
  //         activityIndex={3}
  //         aKey="activity key"
  //         announce={announce}
  //         isViewOnly={false}
  //         quarterlyFFP={null}
  //         setContractorFFP={setContractorFFP}
  //         setInHouseFFP={setInHouseFFP}
  //         year="13"
  //       />
  //     )
  //   ).toMatchSnapshot();
  // });
  //
  //   it('renders as expected', () => {
  //     expect(component).toMatchSnapshot();
  //   });
  //
  //   it('maps state to props', () => {
  //     const state = {
  //       apd: { data: { years } },
  //       budget: { activities: { 'activity key': { quarterlyFFP } } }
  //     };
  //
  //     const mapStateToProps = makeMapStateToProps();
  //     expect(mapStateToProps(state, { aKey: 'activity key' })).toEqual({
  //       quarterlyFFP,
  //       years
  //     });
  //   });
  //
  //   it('handles changes to in-house quarterly FFP', () => {
  //     // The first four are in-house for quarters 1-4; remember that these
  //     // are 0-indexed, so at(2) gives us the 3rd quarter input
  //     component
  //       .find('PercentField')
  //       .at(2)
  //       .simulate('change', { target: { value: 88 } });
  //
  //     expect(setInHouseFFP).toHaveBeenCalledWith(3, '13', 3, 88);
  //     expect(announce).toHaveBeenCalledWith('activity key', '13', 3, 'inHouse');
  //   });
  //
  //   it('handles changes to in-house quarterly FFP', () => {
  //     component
  //       .find('PercentField')
  //       .at(4)
  //       .simulate('change', { target: { value: 19 } });
  //
  //     expect(setContractorFFP).toHaveBeenCalledWith(3, '13', 1, 19);
  //     expect(announce).toHaveBeenCalledWith(
  //       'activity key',
  //       '13',
  //       1,
  //       'contractors'
  //     );
  //   });
  //
  //   it('maps dispatch actions to props', () => {
  //     expect(mapDispatchToProps).toEqual({
  //       announce: ariaAnnounceFFPQuarterly,
  //       setContractorFFP: setFFPForContractorCostsForFiscalQuarter,
  //       setInHouseFFP: setFFPForInHouseCostsForFiscalQuarter
  //     });
  //   });
});
