import budget from './budget';
import { UPDATE_BUDGET } from '../actions/apd';

describe('budget reducer', () => {
  const initialState = {
    combined: {
      total: {
        total: 0,
        federal: 0,
        state: 0
      }
    },
    hie: {
      combined: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      },
      contractors: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      },
      expenses: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      },
      statePersonnel: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      }
    },
    hit: {
      combined: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      },
      contractors: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      },
      expenses: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      },
      statePersonnel: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      }
    },
    mmis: {
      combined: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      },
      contractors: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      },
      expenses: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      },
      statePersonnel: {
        total: {
          total: 0,
          federal: 0,
          state: 0
        }
      }
    },
    years: []
  };

  it('should handle initial state', () => {
    expect(budget(undefined, {})).toEqual(initialState);
  });

  it('computes new budget data from state', () => {
    expect(
      budget(null, {
        type: UPDATE_BUDGET,
        state: {
          apd: {
            data: {
              years: ['1931', '1932', '1933']
            }
          },
          activities: {
            byId: {
              hieOne: {
                fundingSource: 'HIE',
                costFFP: {
                  '1931': {
                    fed: 50,
                    state: 50,
                    other: 0
                  },
                  '1932': {
                    fed: 10,
                    state: 10,
                    other: 80
                  },
                  '1933': {
                    fed: 99,
                    state: 0,
                    other: 1
                  }
                },
                contractorResources: [
                  {
                    years: {
                      '1931': 9643,
                      '1932': 3517,
                      '1933': 5322
                    }
                  },
                  {
                    years: {
                      '1931': 3155,
                      '1932': 8622,
                      '1933': 7365
                    }
                  },
                  {
                    years: {
                      '1931': 3226,
                      '1932': 8352,
                      '1933': 9598
                    }
                  }
                ],
                expenses: [
                  {
                    years: {
                      '1931': 9825,
                      '1932': 1638,
                      '1933': 5892
                    }
                  },
                  {
                    years: {
                      '1931': 8522,
                      '1932': 9578,
                      '1933': 1738
                    }
                  }
                ],
                statePersonnel: [
                  {
                    years: {
                      '1931': { amt: 7823 },
                      '1932': { amt: 8296 },
                      '1933': { amt: 2398 }
                    }
                  },
                  {
                    years: {
                      '1931': { amt: 3258 },
                      '1932': { amt: 7473 },
                      '1933': { amt: 3636 }
                    }
                  }
                ]
              },
              hieTwo: {
                fundingSource: 'HIE',
                costFFP: {
                  '1931': {
                    fed: 1,
                    state: 1,
                    other: 98
                  },
                  '1932': {
                    fed: 13,
                    state: 31,
                    other: 56
                  },
                  '1933': {
                    fed: 74,
                    state: 19,
                    other: 7
                  }
                },
                contractorResources: [
                  {
                    years: {
                      '1931': 100000,
                      '1932': 100000,
                      '1933': 100000
                    }
                  }
                ],
                expenses: [
                  {
                    years: {
                      '1931': 100000,
                      '1932': 100000,
                      '1933': 100000
                    }
                  }
                ],
                statePersonnel: [
                  {
                    years: {
                      '1931': { amt: 100000 },
                      '1932': { amt: 100000 },
                      '1933': { amt: 100000 }
                    }
                  }
                ]
              },
              hitOne: {
                fundingSource: 'HIT',
                costFFP: {
                  '1931': {
                    fed: 3,
                    state: 5,
                    other: 92
                  },
                  '1932': {
                    fed: 12,
                    state: 37,
                    other: 51
                  },
                  '1933': {
                    fed: 78,
                    state: 14,
                    other: 8
                  }
                },
                contractorResources: [
                  {
                    years: {
                      '1931': 100000,
                      '1932': 100000,
                      '1933': 100000
                    }
                  }
                ],
                expenses: [
                  {
                    years: {
                      '1931': 100000,
                      '1932': 100000,
                      '1933': 100000
                    }
                  }
                ],
                statePersonnel: [
                  {
                    years: {
                      '1931': { amt: 100000 },
                      '1932': { amt: 100000 },
                      '1933': { amt: 100000 }
                    }
                  }
                ]
              },
              mmisOne: {
                fundingSource: 'MMIS',
                costFFP: {
                  '1931': {
                    fed: 1,
                    state: 1,
                    other: 98
                  },
                  '1932': {
                    fed: 13,
                    state: 31,
                    other: 56
                  },
                  '1933': {
                    fed: 74,
                    state: 19,
                    other: 7
                  }
                },
                contractorResources: [
                  {
                    years: {
                      '1931': 100000,
                      '1932': 100000,
                      '1933': 100000
                    }
                  }
                ],
                expenses: [
                  {
                    years: {
                      '1931': 100000,
                      '1932': 100000,
                      '1933': 100000
                    }
                  }
                ],
                statePersonnel: [
                  {
                    years: {
                      '1931': { amt: 100000 },
                      '1932': { amt: 100000 },
                      '1933': { amt: 100000 }
                    }
                  }
                ]
              }
            }
          }
        }
      })
    ).toEqual({
      combined: {
        '1931': {
          total: 945452,
          federal: 37726,
          state: 43726
        },
        '1932': {
          total: 947476,
          federal: 118747.6,
          state: 301747.6
        },
        '1933': {
          total: 935949,
          federal: 713589.51,
          state: 156000
        },
        total: {
          total: 2828877,
          federal: 870063.11,
          state: 501473.6
        }
      },
      hie: {
        combined: {
          '1931': {
            total: 345452,
            federal: 25726,
            state: 25726
          },
          '1932': {
            total: 347476,
            federal: 43747.6,
            state: 97747.6
          },
          '1933': {
            total: 335949,
            federal: 257589.51,
            state: 57000
          },
          total: {
            total: 1028877,
            federal: 327063.11,
            state: 180473.6
          }
        },
        contractors: {
          '1931': {
            total: 116024,
            federal: 9012,
            state: 9012
          },
          '1932': {
            total: 120491,
            federal: 15049.1,
            state: 33049.1
          },
          '1933': {
            total: 122285,
            federal: 96062.15,
            state: 19000
          },
          total: {
            total: 358800,
            federal: 120123.25,
            state: 61061.1
          }
        },
        expenses: {
          '1931': {
            total: 118347,
            federal: 10173.5,
            state: 10173.5
          },
          '1932': {
            total: 111216,
            federal: 14121.6,
            state: 32121.6
          },
          '1933': {
            total: 107630,
            federal: 81553.7,
            state: 19000
          },
          total: {
            total: 337193,
            federal: 105848.8,
            state: 61295.1
          }
        },
        statePersonnel: {
          '1931': {
            total: 111081,
            federal: 6540.5,
            state: 6540.5
          },
          '1932': {
            total: 115769,
            federal: 14576.9,
            state: 32576.9
          },
          '1933': {
            total: 106034,
            federal: 79973.66,
            state: 19000
          },
          total: {
            total: 332884,
            federal: 101091.06,
            state: 58117.4
          }
        }
      },
      hit: {
        combined: {
          '1931': {
            total: 300000,
            federal: 9000,
            state: 15000
          },
          '1932': {
            total: 300000,
            federal: 36000,
            state: 111000
          },
          '1933': {
            total: 300000,
            federal: 234000,
            state: 42000
          },
          total: {
            total: 900000,
            federal: 279000,
            state: 168000
          }
        },
        contractors: {
          '1931': {
            total: 100000,
            federal: 3000,
            state: 5000
          },
          '1932': {
            total: 100000,
            federal: 12000,
            state: 37000
          },
          '1933': {
            total: 100000,
            federal: 78000,
            state: 14000
          },
          total: {
            total: 300000,
            federal: 93000,
            state: 56000
          }
        },
        expenses: {
          '1931': {
            total: 100000,
            federal: 3000,
            state: 5000
          },
          '1932': {
            total: 100000,
            federal: 12000,
            state: 37000
          },
          '1933': {
            total: 100000,
            federal: 78000,
            state: 14000
          },
          total: {
            total: 300000,
            federal: 93000,
            state: 56000
          }
        },
        statePersonnel: {
          '1931': {
            total: 100000,
            federal: 3000,
            state: 5000
          },
          '1932': {
            total: 100000,
            federal: 12000,
            state: 37000
          },
          '1933': {
            total: 100000,
            federal: 78000,
            state: 14000
          },
          total: {
            total: 300000,
            federal: 93000,
            state: 56000
          }
        }
      },
      mmis: {
        combined: {
          '1931': {
            total: 300000,
            federal: 3000,
            state: 3000
          },
          '1932': {
            total: 300000,
            federal: 39000,
            state: 93000
          },
          '1933': {
            total: 300000,
            federal: 222000,
            state: 57000
          },
          total: {
            total: 900000,
            federal: 264000,
            state: 153000
          }
        },
        contractors: {
          '1931': {
            total: 100000,
            federal: 1000,
            state: 1000
          },
          '1932': {
            total: 100000,
            federal: 13000,
            state: 31000
          },
          '1933': {
            total: 100000,
            federal: 74000,
            state: 19000
          },
          total: {
            total: 300000,
            federal: 88000,
            state: 51000
          }
        },
        expenses: {
          '1931': {
            total: 100000,
            federal: 1000,
            state: 1000
          },
          '1932': {
            total: 100000,
            federal: 13000,
            state: 31000
          },
          '1933': {
            total: 100000,
            federal: 74000,
            state: 19000
          },
          total: {
            total: 300000,
            federal: 88000,
            state: 51000
          }
        },
        statePersonnel: {
          '1931': {
            total: 100000,
            federal: 1000,
            state: 1000
          },
          '1932': {
            total: 100000,
            federal: 13000,
            state: 31000
          },
          '1933': {
            total: 100000,
            federal: 74000,
            state: 19000
          },
          total: {
            total: 300000,
            federal: 88000,
            state: 51000
          }
        }
      },
      years: []
    });
  });
});
