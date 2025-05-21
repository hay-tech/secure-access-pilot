
import { z } from 'zod';
import { jobFunctionDefinitions } from '../data/mockData';

// Define form schema with access type and temporary duration
export const accessRequestSchema = z.object({
  jobFunction: z.string().min(1, { message: "Please select a job function" }),
  resources: z.array(z.string()).min(1, { message: "Please select at least one resource" }),
  justification: z.string()
    .min(10, { message: "Please provide a detailed justification (at least 10 characters)" })
    .max(500, { message: "Justification is too long (maximum 500 characters)" }),
  environmentFilter: z.string().optional(),
  cloudProvider: z.string().optional(),
  cloudWorkload: z.string().optional(),
  securityClassification: z.string().optional(),
  clusters: z.array(z.string()).optional(),
  accessType: z.enum(['permanent', 'temporary'], {
    required_error: "Please select an access type",
  }),
  tempDuration: z.string().optional(),
  projectName: z.string().optional(),
});

// Add conditional validation for tempDuration when accessType is 'temporary'
export const conditionalAccessRequestSchema = z.intersection(
  accessRequestSchema,
  z.object({
    tempDuration: z.string().optional(),
    projectName: z.string().optional(),
  })
).refine(
  (data) => !(data.accessType === 'temporary' && !data.tempDuration),
  {
    message: "Duration is required for temporary access",
    path: ['tempDuration'],
  }
).refine(
  (data) => {
    // Check if job function has "project" in the name and require projectName
    const selectedJob = jobFunctionDefinitions.find(jf => jf.id === data.jobFunction);
    if (selectedJob && selectedJob.title.toLowerCase().includes('project') && !data.projectName) {
      return false;
    }
    return true;
  },
  {
    message: "Project name is required for this job function",
    path: ['projectName'],
  }
);

export type AccessRequestFormValues = z.infer<typeof conditionalAccessRequestSchema>;
