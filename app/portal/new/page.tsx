'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast, Toaster } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from 'lucide-react';

type AccessLevel = 'reader' | 'editor' | 'admin';

interface UserInvite {
  email: string;
  accessLevel: AccessLevel;
}

const ACCESS_LEVELS: { label: string; value: AccessLevel }[] = [
  { label: 'Reader', value: 'reader' },
  { label: 'Editor', value: 'editor' },
  { label: 'Admin', value: 'admin' },
];

export default function CreatePortal() {
  const router = useRouter();
  const supabase = createClient();
  const [portalName, setPortalName] = useState('');
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState<UserInvite[]>([{ email: '', accessLevel: 'reader' }]);

  // Add a new empty invite field when the last field has content
  const checkAndAddNewField = () => {
    const lastInvite = invites[invites.length - 1];
    if (lastInvite && lastInvite.email.trim() !== '') {
      setInvites([...invites, { email: '', accessLevel: 'reader' }]);
    }
  };

  // Remove empty fields except the last one when submitting
  const cleanupInvites = () => {
    const nonEmptyInvites = invites.filter((invite, index) => {
      if (index === invites.length - 1) return true; // Keep the last one
      return invite.email.trim() !== ''; // Remove empty ones except last
    });
    setInvites(nonEmptyInvites);
  };

  // Update invite field and check if we need to add a new one
  const updateInviteField = (index: number, field: keyof UserInvite, value: string) => {
    const updated = invites.map((invite, i) => {
      if (i === index) {
        return { ...invite, [field]: value };
      }
      return invite;
    });
    setInvites(updated);
    
    if (field === 'email' && index === invites.length - 1) {
      checkAndAddNewField();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!portalName.trim()) {
        throw new Error('Portal name is required');
      }

      // Clean up invites before submission
      cleanupInvites();

      // Filter out empty email fields and validate emails
      const validInvites = invites.filter(invite => invite.email.trim() !== '');
      const invalidEmails = validInvites.filter(invite => !invite.email.includes('@'));
      
      if (invalidEmails.length > 0) {
        toast.error('Please enter valid email addresses');
        return;
      }

      // Check for duplicate emails
      const uniqueEmails = new Set(validInvites.map(invite => invite.email));
      if (uniqueEmails.size !== validInvites.length) {
        toast.error('Duplicate email addresses found');
        return;
      }

      // Format invites for the create_portal function
      const formattedInvites = validInvites.map(invite => [invite.email, invite.accessLevel]);

      const { data, error } = await supabase
        .rpc('create_portal', {
          p_portal_name: portalName,
          p_user_emails: formattedInvites
        });

      if (error) {
        if (error.message.includes('Free plan users can only create one portal')) {
          toast.error('Free plan users can only create one portal. Please upgrade to create more.');
        } else {
          toast.error(error.message || 'Failed to create portal');
        }
        return;
      }

      toast.success('Portal created successfully!');
      router.push(`/portal/${data}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Toaster position="bottom-right" />
      <Card>
        <CardHeader>
          <CardTitle>Create New Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="portalName">Portal Name</Label>
              <Input
                id="portalName"
                value={portalName}
                onChange={(e) => setPortalName(e.target.value)}
                placeholder="Enter portal name"
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Invite Users</Label>
              <div className="space-y-3">
                {invites.map((invite, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Input
                        value={invite.email}
                        onChange={(e) => updateInviteField(index, 'email', e.target.value)}
                        placeholder="Enter email address"
                        type="email"
                      />
                    </div>
                    <div className="w-[140px]">
                      <Select
                        value={invite.accessLevel}
                        onValueChange={(value: AccessLevel) => updateInviteField(index, 'accessLevel', value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCESS_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Portal'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
