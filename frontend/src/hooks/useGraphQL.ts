import { gql, useQuery, useMutation } from '@apollo/client';

// --- Queries ---

const GET_TENANTS = gql`
  query GetTenants($orgId: ID!) { tenants(orgId: $orgId) { id name email phone timisScore } }
`;
const GET_UNITS = gql`
  query GetUnits($propertyId: ID!) { units(propertyId: $propertyId) { id name type rent status } }
`;
const GET_LEASES = gql`
  query GetLeases($orgId: ID!) { leases(orgId: $orgId) { id tenantId unitId startDate endDate rent status } }
`;
const GET_PAYMENTS = gql`
  query GetPayments($leaseId: ID!) { payments(leaseId: $leaseId) { id amount date method status mpesaRef } }
`;
const GET_TIMIS_SCORE = gql`
  query GetTimisScore($tenantId: ID!) { timisScore(tenantId: $tenantId) { score breakdown { category points } updatedAt } }
`;

// --- Mutations ---

const CREATE_TENANT = gql`
  mutation CreateTenant($input: TenantInput!) { createTenant(input: $input) { id name } }
`;
const CREATE_UNIT = gql`
  mutation CreateUnit($input: UnitInput!) { createUnit(input: $input) { id name } }
`;
const CREATE_LEASE = gql`
  mutation CreateLease($input: LeaseInput!) { createLease(input: $input) { id status } }
`;
const RECORD_PAYMENT = gql`
  mutation RecordPayment($input: PaymentInput!) { recordPayment(input: $input) { id status mpesaRef } }
`;

// --- Typed hooks ---

export const useTenants = (orgId: string) => useQuery(GET_TENANTS, { variables: { orgId } });
export const useUnits = (propertyId: string) => useQuery(GET_UNITS, { variables: { propertyId } });
export const useLeases = (orgId: string) => useQuery(GET_LEASES, { variables: { orgId } });
export const usePayments = (leaseId: string) => useQuery(GET_PAYMENTS, { variables: { leaseId } });
export const useTimisScoreQuery = (tenantId: string) => useQuery(GET_TIMIS_SCORE, { variables: { tenantId } });

export const useCreateTenant = () => useMutation(CREATE_TENANT);
export const useCreateUnit = () => useMutation(CREATE_UNIT);
export const useCreateLease = () => useMutation(CREATE_LEASE);
export const useRecordPayment = () => useMutation(RECORD_PAYMENT);
