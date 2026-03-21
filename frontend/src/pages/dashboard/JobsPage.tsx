import { useEffect, useState } from 'react';
import { useJobStore, Job } from '@/stores/jobStore';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, Plus, Pencil, Trash2, X, Briefcase,
  MapPin, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'Legal', 'Customer Support', 'Data', 'Other'];
const WORK_POLICIES = ['remote', 'hybrid', 'onsite'];
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract'];
const EXPERIENCE_LEVELS = ['junior', 'mid-level', 'senior', 'lead'];
const JOB_TYPES = ['permanent', 'temporary', 'internship'];

const emptyJob: Partial<Job> = {
  title: '', department: 'Engineering', location: '', workPolicy: 'remote',
  employmentType: 'full-time', experienceLevel: 'mid-level', jobType: 'permanent',
  salaryRange: '', description: '', isActive: true,
};

const SelectField = ({ label, field, value, onChange, options }: { label: string; field: string; value: string; onChange: (field: string, val: string) => void; options: string[] }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <select
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring capitalize"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-card capitalize">{opt.replace(/-/g, ' ')}</option>
      ))}
    </select>
  </div>
);

export default function JobsPage() {
  const { jobs, pagination, isLoading, error, fetchJobs, createJob, updateJob, deleteJob, clearError } = useJobStore();
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const openCreate = () => { setEditingJob({ ...emptyJob }); setShowModal(true); setFormError(''); };
  const openEdit = (job: Job) => { setEditingJob({ ...job }); setShowModal(true); setFormError(''); };
  const closeModal = () => { setShowModal(false); setEditingJob(null); };

  const handleSave = async () => {
    if (!editingJob?.title || !editingJob?.location || !editingJob?.description) {
      setFormError('Title, Location, and Description are required.'); return;
    }
    setFormError('');
    const isEdit = !!(editingJob as Job)?._id;
    let success: boolean;
    if (isEdit) {
      success = await updateJob((editingJob as Job)._id, editingJob);
    } else {
      success = await createJob(editingJob);
    }
    if (success) closeModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await deleteJob(id);
    }
  };

  const handlePageChange = (page: number) => { fetchJobs(page); };

  const updateField = (field: string, value: string | boolean) => {
    setEditingJob((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Openings</h1>
          <p className="text-muted-foreground mt-1">Manage all your open positions.</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add Job</Button>
      </div>

      {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive mb-4">{error}</div>}

      {isLoading && jobs.length === 0 ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : jobs.length === 0 ? (
        <Card className="border-dashed border-white/20 bg-transparent shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">No jobs yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first job posting to get started.</p>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add Your First Job</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:border-[#6366F1]/30 hover:shadow-[0_8px_32px_-8px_rgba(99,102,241,0.15)] transition-all duration-300 group">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-base">{job.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.department}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.employmentType}</span>
                        <span className="capitalize">{job.workPolicy}</span>
                        {job.salaryRange && <span>{job.salaryRange}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(job)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(job._id)} className="hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button variant="outline" size="sm" disabled={!pagination.hasPrev} onClick={() => handlePageChange(pagination.page - 1)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</span>
              <Button variant="outline" size="sm" disabled={!pagination.hasNext} onClick={() => handlePageChange(pagination.page + 1)}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-10 p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-2xl border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{(editingJob as Job)?._id ? 'Edit Job' : 'Create New Job'}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-5 h-5" /></Button>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {formError && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">{formError}</div>}

                  <div className="space-y-2">
                    <Label>Job Title *</Label>
                    <Input value={editingJob?.title || ''} onChange={(e) => updateField('title', e.target.value)} placeholder="Senior Frontend Developer" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Department" field="department" value={(editingJob as any)?.department || ''} onChange={updateField} options={DEPARTMENTS} />
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Input value={editingJob?.location || ''} onChange={(e) => updateField('location', e.target.value)} placeholder="San Francisco, CA / Remote" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Work Policy" field="workPolicy" value={(editingJob as any)?.workPolicy || ''} onChange={updateField} options={WORK_POLICIES} />
                    <SelectField label="Employment Type" field="employmentType" value={(editingJob as any)?.employmentType || ''} onChange={updateField} options={EMPLOYMENT_TYPES} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Experience Level" field="experienceLevel" value={(editingJob as any)?.experienceLevel || ''} onChange={updateField} options={EXPERIENCE_LEVELS} />
                    <SelectField label="Job Type" field="jobType" value={(editingJob as any)?.jobType || ''} onChange={updateField} options={JOB_TYPES} />
                  </div>

                  <div className="space-y-2">
                    <Label>Salary Range</Label>
                    <Input value={editingJob?.salaryRange || ''} onChange={(e) => updateField('salaryRange', e.target.value)} placeholder="$120,000 - $160,000" />
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <textarea
                      value={editingJob?.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Describe the role, responsibilities, requirements..."
                      rows={6}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingJob?.isActive ?? true}
                      onChange={(e) => updateField('isActive', e.target.checked)}
                      className="rounded border-input"
                    />
                    <Label htmlFor="isActive">Job is active and visible to candidates</Label>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {(editingJob as Job)?._id ? 'Update Job' : 'Create Job'}
                    </Button>
                    <Button variant="outline" onClick={closeModal}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
