import { apiRequest } from './client';

export interface StaffMemberDto {
  id: number;
  userId?: number;
  name: string;
  email: string;
  position: string;
  role: string;
  status: string;
  phone?: string;
}

export const staffApi = {
  getStaff: (slug = 'ember-and-olive') =>
    apiRequest<StaffMemberDto[]>(`/admin/staff?slug=${slug}`),

  inviteStaff: (email: string, role: string, position?: string) =>
    apiRequest<StaffMemberDto>(`/admin/staff/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, role, position }),
    }),

  updateRole: (membershipId: number, role: string) =>
    apiRequest<StaffMemberDto>(`/admin/staff/${membershipId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
};
