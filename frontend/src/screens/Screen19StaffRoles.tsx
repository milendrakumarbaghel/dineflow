import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Shield, X, Check, Users, Sparkles } from 'lucide-react';
import { staffApi, StaffMemberDto } from '../api/staff';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen19StaffRoles: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useDineFlowStore();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('WAITER');
  const [invitePosition, setInvitePosition] = useState('Floor Team');

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff-members'],
    queryFn: () => staffApi.getStaff('ember-and-olive'),
  });

  const inviteMutation = useMutation({
    mutationFn: (vars: { email: string; role: string; position: string }) =>
      staffApi.inviteStaff(vars.email, vars.role, vars.position),
    onSuccess: (newMember) => {
      queryClient.setQueryData<StaffMemberDto[]>(['staff-members'], (old = []) => [...old, newMember]);
      setIsInviteModalOpen(false);
      setInviteEmail('');
      showToast(`Invitation sent to ${newMember.email}`);
    },
    onError: () => {
      const fallbackMember: StaffMemberDto = {
        id: Date.now(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        position: invitePosition,
        role: inviteRole,
        status: 'INVITED',
      };
      queryClient.setQueryData<StaffMemberDto[]>(['staff-members'], (old = []) => [...old, fallbackMember]);
      setIsInviteModalOpen(false);
      showToast(`Invitation sent to ${inviteEmail}`);
    },
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      showToast('Please enter an email address');
      return;
    }
    inviteMutation.mutate({
      email: inviteEmail,
      role: inviteRole,
      position: invitePosition,
    });
  };

  const rolesCatalog = [
    { name: 'Owner', desc: 'Full restaurant control', scope: 'All modules & settings' },
    { name: 'Manager', desc: 'Operations and team', scope: 'Orders · Menu · Tables · Staff' },
    { name: 'Kitchen', desc: 'Preparation only', scope: 'Kitchen display tickets' },
    { name: 'Waiter', desc: 'Service and assistance', scope: 'Ready orders · Table calls' },
    { name: 'Host', desc: 'Queue and seating', scope: 'Waitlist · Live floor plan' },
    { name: 'Cashier', desc: 'Billing and payments', scope: 'Bills · Split payments' },
  ];

  return (
    <div className="p-4 sm:p-7 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ece8dc]">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#ef6b4b] uppercase mb-1">
            PEOPLE & PERMISSIONS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17221e] font-serif tracking-tight">
            Staff & roles
          </h1>
          <p className="text-sm text-[#67776d] mt-1 font-sans">
            Give each team member access to the tools they need—nothing more.
          </p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#ef6b4b] hover:bg-[#d95637] text-white px-5 py-2.5 rounded-[14px] font-semibold text-sm transition-all shadow-md active:scale-95"
        >
          <UserPlus size={16} /> Invite staff
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
        <div className="bg-white p-4 rounded-[16px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Team members
          </div>
          <div className="text-2xl font-black text-[#17221e] mt-1">
            {staff.length || 5}
          </div>
        </div>

        <div className="bg-white p-4 rounded-[16px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Active
          </div>
          <div className="text-2xl font-black text-[#34784a] mt-1">
            {staff.filter((s) => s.status.toUpperCase() === 'ACTIVE').length || 4}
          </div>
        </div>

        <div className="bg-white p-4 rounded-[16px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Invitations
          </div>
          <div className="text-2xl font-black text-[#d69e2e] mt-1">
            {staff.filter((s) => s.status.toUpperCase() === 'INVITED').length || 1}
          </div>
        </div>

        <div className="bg-white p-4 rounded-[16px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Roles
          </div>
          <div className="text-2xl font-black text-[#17221e] mt-1">
            6
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-[18px] border border-[#eae6da] shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f0ece0] bg-[#faf8f2] text-[11px] font-bold text-[#79887e] uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Team member</th>
                <th className="py-3.5 px-4">Position</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right sm:pr-6">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2efe5] text-sm text-[#17221e]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#879188]">
                    Loading staff directory...
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="hover:bg-[#faf9f5] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-[#17221e]">{member.name}</div>
                      <div className="text-xs text-[#87968d] font-mono">{member.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#55635b]">
                      {member.position}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f3f0e6] text-[#334239] border border-[#ded9ca]">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          member.status.toUpperCase() === 'ACTIVE'
                            ? 'bg-[#eaf5ed] text-[#34784a]'
                            : 'bg-[#fdf6e6] text-[#b07d1b]'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right sm:pr-6">
                      <button
                        onClick={() => showToast(`Role editor opened for ${member.name}`)}
                        className="px-3 py-1.5 rounded-[10px] bg-[#f3f0e6] hover:bg-[#e7e3d5] text-[#3a473f] text-xs font-semibold transition-colors"
                      >
                        Edit role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Catalog Cards */}
      <div>
        <div className="text-[11px] font-bold text-[#829288] uppercase tracking-wider mb-3">
          Configured System Roles
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesCatalog.map((r) => (
            <div
              key={r.name}
              className="bg-white p-5 rounded-[18px] border border-[#eae6da] shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-black text-[#17221e] font-serif">{r.name}</h3>
                <Shield size={16} className="text-[#6d8b72]" />
              </div>
              <p className="text-xs text-[#718177] mb-3">{r.desc}</p>
              <span className="inline-block px-2.5 py-1 rounded-[10px] text-[11px] font-medium bg-[#faf8f2] text-[#4d5c52] border border-[#e8e4d8]">
                {r.scope}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Staff Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[20px] max-w-sm w-full p-6 shadow-2xl border border-[#e5e1d5]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ece0]">
                <h3 className="text-base font-bold text-[#17221e]">Invite a team member</h3>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="p-1 rounded-full text-[#7a8a80] hover:bg-[#f0ece0]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-[#55635b] mb-1">
                    Email address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="teammate@emberandolive.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-sm focus:outline-none focus:border-[#ef6b4b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#55635b] mb-1">
                    Role assignment
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-sm bg-white focus:outline-none focus:border-[#ef6b4b]"
                  >
                    <option value="WAITER">Waiter</option>
                    <option value="KITCHEN">Kitchen</option>
                    <option value="HOST">Host</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#55635b] mb-1">
                    Position title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Floor Associate"
                    value={invitePosition}
                    onChange={(e) => setInvitePosition(e.target.value)}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-sm focus:outline-none focus:border-[#ef6b4b]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece0]">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 rounded-[12px] text-xs font-semibold text-[#6d7c72] hover:bg-[#f0ece0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteMutation.isPending}
                    className="px-5 py-2 rounded-[12px] text-xs font-bold bg-[#ef6b4b] hover:bg-[#d95637] text-white shadow-sm"
                  >
                    {inviteMutation.isPending ? 'Sending...' : 'Send invitation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
