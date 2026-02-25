import axios from 'axios';
import authToken from './auth-token';

const client = () => {
  return axios.create({
    headers: {
      Authorization: authToken.getToken() && `Bearer ${authToken.getToken()}`,
    },
  });
};

export const api = {
  itemRequest: '/mock-data/item-request-mock.json',
  itemRequestDocTimeline: '/mock-data/item-request-doc-timeline.json',
  rfq: '/mock-data/rfq-mock.json',
  vendorComparison: '/mock-data/rfq-vendor-comparison-mock.json',
  requiredItem: '/mock-data/required-item-mock.json',
  vendors: '/mock-data/vendors-mock.json',
  consolidationContracts: '/mock-data/consolidation-contract-mock.json',
  quotationHistories: '/mock-data/quotation-histories-mock.json',

  finalQuotation: '/mock-data/final-quotation-mock.json',

  masterDataItem: '/mock-data/item-mock.json',
  masterDataDepartement: '/mock-data/departement-tree-mock.json',

  user: '/mock-data/user-mock.json',
  role: '/mock-data/role-mock.json',
  permissionKey: '/mock-data/permission-key-mock.json',
  roleMember: '/mock-data/role-member-mock.json',

  profile: '/mock-data/profile-mock.json',

  vendorRfq: '/mock-data/vendor-rfq-mock.json',
  vendorRfqDetail: '/mock-data/vendor-rfq-detail-mock.json',
  vendorRfqInvitation: '/mock-data/vendor-rfq-invitation-mock.json',

  roleLookup: '/mock-data/role-lookup-mock.json',
  departementLookup: '/mock-data/departement-mock.json',
  employeeLookup: '/mock-data/employee-lookup-mock.json',
  userLookup: '/mock-data/user-lookup-mock.json',
  quotationHistoriesLookup: '/mock-data/',
  contractLookup: '/mock-data/',
  itemCategoryLookup: '/mock-data/',
  itemLookup: '/mock-data/',
};

export default client;
