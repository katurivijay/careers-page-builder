import { useState, useEffect } from 'react';
import { useCompanyStore } from '@/stores/companyStore';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { motion } from 'framer-motion';
import { Loader2, Save, Building2 } from 'lucide-react';

export default function CompanyProfilePage() {
  const { company, isLoading, error, createCompany, updateCompany, fetchCompany, clearError } = useCompanyStore();

  const [form, setForm] = useState({
    name: '',
    website: '',
    description: '',
    industry: '',
    size: '',
    founded: '',
    headquarters: '',
    logo: '',
  });

  const [success, setSuccess] = useState('');
  const isEdit = !!company;

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || '',
        website: company.website || '',
        description: company.description || '',
        industry: company.industry || '',
        size: company.size || '',
        founded: company.founded || '',
        headquarters: company.headquarters || '',
        logo: company.logo || '',
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    clearError();

    let result: boolean;
    if (isEdit) {
      result = await updateCompany(form);
    } else {
      result = await createCompany(form);
    }

    if (result) {
      setSuccess(isEdit ? 'Company updated successfully!' : 'Company created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
        <p className="text-muted-foreground mt-1">
          {isEdit ? 'Update your company information.' : 'Set up your company profile to get started.'}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>{isEdit ? 'Edit Company' : 'Create Company'}</CardTitle>
              <CardDescription>This information will appear on your careers page.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400"
              >
                {success}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={form.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://acme.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Tell candidates about your company..."
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={form.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  placeholder="Technology"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <select
                  id="size"
                  value={form.size}
                  onChange={(e) => handleChange('size', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="" className="bg-card">Select size</option>
                  <option value="1-10" className="bg-card">1-10 employees</option>
                  <option value="11-50" className="bg-card">11-50 employees</option>
                  <option value="51-200" className="bg-card">51-200 employees</option>
                  <option value="201-500" className="bg-card">201-500 employees</option>
                  <option value="501-1000" className="bg-card">501-1000 employees</option>
                  <option value="1000+" className="bg-card">1000+ employees</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="founded">Founded Year</Label>
                <Input
                  id="founded"
                  value={form.founded}
                  onChange={(e) => handleChange('founded', e.target.value)}
                  placeholder="2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headquarters">Headquarters</Label>
                <Input
                  id="headquarters"
                  value={form.headquarters}
                  onChange={(e) => handleChange('headquarters', e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={form.logo}
                onChange={(e) => handleChange('logo', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL to your company logo (Cloudinary or any public URL).
              </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEdit ? 'Save Changes' : 'Create Company'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </motion.div>
  );
}
