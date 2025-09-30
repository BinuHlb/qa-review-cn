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

export default function AddMemberFirmPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    establishedYear: "",
    status: "pending",
    type: "accounting",
    location: "",
    region: "north_america",
    contactPhone: "",
    contactEmail: "",
    employeeCount: "",
    partnerCount: "",
    riskLevel: "low",
    complianceScore: "",
    totalReviews: "",
    specializations: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],
    description: "",
    notes: ""
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
    console.log("Creating member firm:", formData)
    // TODO: Implement create member firm functionality
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <FormLayout
      title="Add New Member Firm"
      description="Register a new member firm with complete information"
      backUrl="/admin/member-firms"
      backLabel="Back to Member Firms"
      onSubmit={handleSubmit}
      submitLabel="Create Firm"
      submitIcon={<Save className="h-4 w-4 mr-2" />}
      isLoading={isLoading}
    >
      {/* Basic Information */}
      <FormSection title="Basic Information">
        <GridForm columns={2}>
          <FormField label="Firm Name" required>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter firm name"
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

          <FormField label="Website">
            <Input
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="Enter website URL"
            />
          </FormField>

          <FormField label="Established Year" required>
            <Input
              type="number"
              value={formData.establishedYear}
              onChange={(e) => handleInputChange("establishedYear", e.target.value)}
              placeholder="Enter established year"
              min="1800"
              max="2024"
              required
            />
          </FormField>
        </GridForm>
      </FormSection>

      {/* Status and Type */}
      <FormSection title="Status and Type">
        <GridForm columns={2}>
          <FormField label="Status" required>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Firm Type" required>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accounting">Accounting</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
                <SelectItem value="tax">Tax</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="advisory">Advisory</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Risk Level" required>
            <Select value={formData.riskLevel} onValueChange={(value) => handleInputChange("riskLevel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Region" required>
            <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north_america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia_pacific">Asia Pacific</SelectItem>
                <SelectItem value="latin_america">Latin America</SelectItem>
                <SelectItem value="middle_east_africa">Middle East & Africa</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </GridForm>
      </FormSection>

      {/* Location and Contact */}
      <FormSection title="Location and Contact">
        <GridForm columns={2}>
          <FormField label="Location" required>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter location"
              required
            />
          </FormField>

          <FormField label="Contact Phone" required>
            <Input
              value={formData.contactPhone}
              onChange={(e) => handleInputChange("contactPhone", e.target.value)}
              placeholder="Enter contact phone"
              required
            />
          </FormField>

          <FormField label="Contact Email" required>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              placeholder="Enter contact email"
              required
            />
          </FormField>
        </GridForm>
      </FormSection>

      {/* Firm Statistics */}
      <FormSection title="Firm Statistics">
        <GridForm columns={2}>
          <FormField label="Employee Count" required>
            <Input
              type="number"
              value={formData.employeeCount}
              onChange={(e) => handleInputChange("employeeCount", e.target.value)}
              placeholder="Enter employee count"
              min="1"
              required
            />
          </FormField>

          <FormField label="Partner Count" required>
            <Input
              type="number"
              value={formData.partnerCount}
              onChange={(e) => handleInputChange("partnerCount", e.target.value)}
              placeholder="Enter partner count"
              min="1"
              required
            />
          </FormField>

          <FormField label="Compliance Score" required>
            <Input
              type="number"
              value={formData.complianceScore}
              onChange={(e) => handleInputChange("complianceScore", e.target.value)}
              placeholder="Enter compliance score (0-100)"
              min="0"
              max="100"
              required
            />
          </FormField>

          <FormField label="Total Reviews" required>
            <Input
              type="number"
              value={formData.totalReviews}
              onChange={(e) => handleInputChange("totalReviews", e.target.value)}
              placeholder="Enter total reviews"
              min="0"
              required
            />
          </FormField>
        </GridForm>
      </FormSection>

      {/* Specializations and Certifications */}
      <FormSection title="Specializations and Certifications">
        <GridForm columns={1}>
          <DynamicTags
            label="Specializations"
            placeholder="Add specialization"
            tags={formData.specializations}
            onTagsChange={(tags) => handleTagsChange("specializations", tags)}
            maxTags={10}
          />

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

      {/* Description and Notes */}
      <FormSection title="Description and Notes">
        <GridForm columns={1}>
          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter firm description"
              rows={4}
            />
          </FormField>

          <FormField label="Notes">
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Enter additional notes"
              rows={3}
            />
          </FormField>
        </GridForm>
      </FormSection>
    </FormLayout>
  )
}