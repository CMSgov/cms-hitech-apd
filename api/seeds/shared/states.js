const stateEntries = [
  { id: 'al', name: 'Alabama' },
  { id: 'ak', name: 'Alaska' },
  { id: 'az', name: 'Arizona' },
  { id: 'ar', name: 'Arkansas' },
  { id: 'ca', name: 'California' },
  { id: 'co', name: 'Colorado' },
  { id: 'ct', name: 'Connecticut' },
  { id: 'de', name: 'Delaware' },
  { id: 'fl', name: 'Florida' },
  { id: 'ga', name: 'Georgia' },
  { id: 'hi', name: 'Hawaii' },
  { id: 'id', name: 'Idaho' },
  { id: 'ia', name: 'Iowa' },
  { id: 'il', name: 'Illinois' },
  { id: 'in', name: 'Indiana' },
  { id: 'ks', name: 'Kansas' },
  { id: 'ky', name: 'Kentucky' },
  { id: 'la', name: 'Louisiana' },
  { id: 'me', name: 'Maine' },
  { id: 'md', name: 'Maryland' },
  { id: 'ma', name: 'Massachusetts' },
  { id: 'mi', name: 'Michigan' },
  { id: 'mn', name: 'Minnesota' },
  { id: 'ms', name: 'Mississippi' },
  { id: 'mo', name: 'Missouri' },
  { id: 'mt', name: 'Montana' },
  { id: 'ne', name: 'Nebraska' },
  { id: 'nc', name: 'North Carolina' },
  { id: 'nd', name: 'North Dakota' },
  { id: 'nh', name: 'New Hampshire' },
  { id: 'nj', name: 'New Jersey' },
  { id: 'nm', name: 'New Mexico' },
  { id: 'nv', name: 'Nevada' },
  { id: 'ny', name: 'New York' },
  { id: 'oh', name: 'Ohio' },
  { id: 'ok', name: 'Oklahoma' },
  { id: 'or', name: 'Oregon' },
  { id: 'pa', name: 'Pennsylvania' },
  { id: 'ri', name: 'Rhode Island' },
  { id: 'sc', name: 'South Carolina' },
  { id: 'sd', name: 'South Dakota' },
  { id: 'tn', name: 'Tennessee' },
  { id: 'tx', name: 'Texas' },
  { id: 'ut', name: 'Utah' },
  { id: 'vt', name: 'Vermont' },
  { id: 'va', name: 'Virginia' },
  { id: 'wa', name: 'Washington' },
  { id: 'wv', name: 'West Virginia' },
  { id: 'wi', name: 'Wisconsin' },
  { id: 'wy', name: 'Wyoming' },

  // Federal district
  { id: 'dc', name: 'District of Columbia' },

  // Territories
  { id: 'as', name: 'American Samoa' },
  { id: 'gu', name: 'Guam' },
  { id: 'mp', name: 'Northern Mariana Islands' },
  { id: 'pr', name: 'Puerto Rico' },
  { id: 'vi', name: 'U.S. Virgin Islands' }
];

const vermontOffice = {
  address: 'Department of Vermont Health Access',
  city: 'Waterbury',
  zip: '05671-1010'
};

const vermontPocs = [
  {
    name: 'Jane Doe',
    position: 'Director',
    email: 'jane.doe@vermont.gov'
  },
  {
    name: 'Richard Roe',
    position: 'CIO',
    email: 'richard.roe@vermont.gov'
  }
];

exports.seed = async (knex) => {
  await knex('states').insert(stateEntries);

  await knex
    .table('states')
    .where({ id: 'vt' })
    .update({
      medicaid_office: JSON.stringify(vermontOffice),
      state_pocs: JSON.stringify(vermontPocs)
    });
};
