"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormLayout } from "@/components/shared/form-layout"
import { FormSection } from "@/components/shared/form-section"
import { FormField } from "@/components/shared/form-field"
import { GridForm } from "@/components/shared/grid-form"
import { DynamicTags } from "@/components/shared/dynamic-tags"
import { Save } from "lucide-react"

export default function AddReviewerPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "senior_reviewer",
    status: "Active",
    specialization: "",
    experience: "",
    workload: "Available",
    location: "",
    bio: "",
    certifications: [] as string[],
    languages: [] as string[]
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTagsChange = (field: string, tags: string[]) => {
    setFormData(prev => ({ ...prev, [field]: tags }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("Creating reviewer:", formData)
    // TODO: Implement create reviewer functionality
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <FormLayout
      title="Add New Reviewer"
      description="Create a new reviewer account with all necessary details"
      backUrl="/admin/reviewers"
      backLabel="Back to Reviewers"
      onSubmit={handleSubmit}
      submitLabel="Create Reviewer"
      submitIcon={<Save className="h-4 w-4 mr-2" />}
      isLoading={isLoading}
    >
      {/* Basic Information */}
      <FormSection title="Basic Information">
        <GridForm columns={2}>
          <FormField label="Full Name" required>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter full name"
              required
            />
          </FormField>

          <FormField label="Email Address" required>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
              required
            />
          </FormField>

          <FormField label="Role" required>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="senior_reviewer">Senior Reviewer</SelectItem>
                <SelectItem value="reviewer">Reviewer</SelectItem>
                <SelectItem value="associate_reviewer">Associate Reviewer</SelectItem>
                <SelectItem value="lead_reviewer">Lead Reviewer</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Status" required>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </GridForm>
      </FormSection>

      {/* Professional Details */}
      <FormSection title="Professional Details">
        <GridForm columns={2}>
          <FormField label="Specialization" required>
            <Input
              value={formData.specialization}
              onChange={(e) => handleInputChange("specialization", e.target.value)}
              placeholder="Enter specialization"
              required
            />
          </FormField>

          <FormField label="Experience (Years)" required>
            <Input
              type="number"
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              placeholder="Enter years of experience"
              min="0"
              max="50"
              required
            />
          </FormField>

          <FormField label="Workload" required>
            <Select value={formData.workload} onValueChange={(value) => handleInputChange("workload", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select workload" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Busy">Busy</SelectItem>
                <SelectItem value="Overloaded">Overloaded</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Location" required>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter location"
              required
            />
          </FormField>
        </GridForm>
      </FormSection>

      {/* Certifications and Languages */}
      <FormSection title="Certifications and Languages">
        <GridForm columns={1}>
          <DynamicTags
            label="Certifications"
            placeholder="Add certification"
            tags={formData.certifications}
            onTagsChange={(tags) => handleTagsChange("certifications", tags)}
            maxTags={10}
          />

          <DynamicTags
            label="Languages"
            placeholder="Add language"
            tags={formData.languages}
            onTagsChange={(tags) => handleTagsChange("languages", tags)}
            maxTags={10}
          />
        </GridForm>
      </FormSection>

      {/* Bio */}
      <FormSection title="Bio">
        <GridForm columns={1}>
          <FormField label="Bio">
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Enter reviewer bio"
              rows={4}
            />
          </FormField>
        </GridForm>
      </FormSection>
    </FormLayout>
  )
}