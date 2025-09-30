"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Shield,
  Users,
  Star,
  Settings
} from "lucide-react"
import Link from "next/link"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  maxWorkload: number
  color: string
  userCount: number
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Partner",
    description: "Senior partner with full administrative access and strategic oversight responsibilities.",
    permissions: ["view_all", "edit_all", "delete_all", "assign_reviews", "manage_users", "system_settings"],
    maxWorkload: 8,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    userCount: 1
  },
  {
    id: "2",
    name: "Lead Reviewer",
    description: "Senior reviewer with team leadership responsibilities and advanced review capabilities.",
    permissions: ["view_all", "edit_assigned", "assign_reviews", "manage_team", "approve_reviews"],
    maxWorkload: 15,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    userCount: 2
  },
  {
    id: "3",
    name: "Senior Reviewer",
    description: "Experienced reviewer with advanced review capabilities and mentoring responsibilities.",
    permissions: ["view_all", "edit_assigned", "mentor_junior", "approve_reviews"],
    maxWorkload: 18,
    color: "bg-green-100 text-green-800 border-green-200",
    userCount: 3
  },
  {
    id: "4",
    name: "Reviewer",
    description: "Standard reviewer with basic review capabilities and assigned review responsibilities.",
    permissions: ["view_assigned", "edit_assigned", "submit_reviews"],
    maxWorkload: 12,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    userCount: 4
  }
]

export default function ReviewerRolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxWorkload: "",
    color: "bg-gray-100 text-gray-800 border-gray-200"
  })
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const availablePermissions = [
    { id: "view_all", name: "View All Reviews", description: "Can view all reviews in the system" },
    { id: "view_assigned", name: "View Assigned Reviews", description: "Can only view assigned reviews" },
    { id: "edit_all", name: "Edit All Reviews", description: "Can edit any review in the system" },
    { id: "edit_assigned", name: "Edit Assigned Reviews", description: "Can only edit assigned reviews" },
    { id: "delete_all", name: "Delete All Reviews", description: "Can delete any review in the system" },
    { id: "assign_reviews", name: "Assign Reviews", description: "Can assign reviews to other reviewers" },
    { id: "manage_users", name: "Manage Users", description: "Can manage user accounts and permissions" },
    { id: "manage_team", name: "Manage Team", description: "Can manage team members and assignments" },
    { id: "mentor_junior", name: "Mentor Junior Reviewers", description: "Can mentor and guide junior reviewers" },
    { id: "approve_reviews", name: "Approve Reviews", description: "Can approve and finalize reviews" },
    { id: "submit_reviews", name: "Submit Reviews", description: "Can submit completed reviews" },
    { id: "system_settings", name: "System Settings", description: "Can modify system-wide settings" }
  ]

  const colorOptions = [
    { value: "bg-purple-100 text-purple-800 border-purple-200", label: "Purple" },
    { value: "bg-blue-100 text-blue-800 border-blue-200", label: "Blue" },
    { value: "bg-green-100 text-green-800 border-green-200", label: "Green" },
    { value: "bg-gray-100 text-gray-800 border-gray-200", label: "Gray" },
    { value: "bg-orange-100 text-orange-800 border-orange-200", label: "Orange" },
    { value: "bg-pink-100 text-pink-800 border-pink-200", label: "Pink" }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      maxWorkload: role.maxWorkload.toString(),
      color: role.color
    })
    setSelectedPermissions(role.permissions)
    setIsAddingRole(false)
  }

  const handleAddRole = () => {
    setIsAddingRole(true)
    setEditingRole(null)
    setFormData({
      name: "",
      description: "",
      maxWorkload: "",
      color: "bg-gray-100 text-gray-800 border-gray-200"
    })
    setSelectedPermissions([])
  }

  const handleSaveRole = () => {
    if (editingRole) {
      // Update existing role
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id 
          ? {
              ...role,
              name: formData.name,
              description: formData.description,
              maxWorkload: parseInt(formData.maxWorkload),
              color: formData.color,
              permissions: selectedPermissions
            }
          : role
      ))
    } else {
      // Add new role
      const newRole: Role = {
        id: (roles.length + 1).toString(),
        name: formData.name,
        description: formData.description,
        maxWorkload: parseInt(formData.maxWorkload),
        color: formData.color,
        permissions: selectedPermissions,
        userCount: 0
      }
      setRoles(prev => [...prev, newRole])
    }
    
    // Reset form
    setEditingRole(null)
    setIsAddingRole(false)
    setFormData({
      name: "",
      description: "",
      maxWorkload: "",
      color: "bg-gray-100 text-gray-800 border-gray-200"
    })
    setSelectedPermissions([])
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId))
  }

  const handleCancel = () => {
    setEditingRole(null)
    setIsAddingRole(false)
    setFormData({
      name: "",
      description: "",
      maxWorkload: "",
      color: "bg-gray-100 text-gray-800 border-gray-200"
    })
    setSelectedPermissions([])
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="relative overflow-y-auto">
          <Card className="shadow-none border-none">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Link href="/admin/reviewers">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Reviewers
                  </Button>
                </Link>
                <div>
                  <CardTitle>Reviewer Roles</CardTitle>
                  <CardDescription>
                    Manage reviewer roles, permissions, and access levels
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Role Button */}
              <div className="flex justify-end">
                <Button onClick={handleAddRole}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </div>

              {/* Roles Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {roles.map((role) => (
                  <Card key={role.id} className="shadow-none border-none bg-neutral-50 hover:bg-neutral-100 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <Shield className="h-5 w-5 text-neutral-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{role.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {role.userCount} user{role.userCount !== 1 ? 's' : ''}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id)}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Role Badge */}
                      <Badge className={`${role.color} text-xs px-2 py-0.5`}>
                        {role.name}
                      </Badge>

                      {/* Description */}
                      <div className="text-sm text-neutral-600">
                        {role.description}
                      </div>

                      {/* Max Workload */}
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3 text-neutral-500" />
                        <span className="text-neutral-500">Max Workload:</span>
                        <span className="font-medium text-neutral-900">{role.maxWorkload}</span>
                      </div>

                      {/* Permissions Count */}
                      <div className="flex items-center gap-2 text-xs">
                        <Settings className="h-3 w-3 text-neutral-500" />
                        <span className="text-neutral-500">Permissions:</span>
                        <span className="font-medium text-neutral-900">{role.permissions.length}</span>
                      </div>

                      {/* Key Permissions */}
                      <div className="space-y-1">
                        <div className="text-xs text-neutral-500 font-medium">Key Permissions</div>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs px-2 py-0.5">
                              {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              +{role.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add/Edit Role Form */}
              {(isAddingRole || editingRole) && (
                <Card className="shadow-none border-none bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {editingRole ? `Edit ${editingRole.name}` : "Add New Role"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="roleName">Role Name *</Label>
                        <Input
                          id="roleName"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter role name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxWorkload">Max Workload *</Label>
                        <Input
                          id="maxWorkload"
                          type="number"
                          value={formData.maxWorkload}
                          onChange={(e) => handleInputChange("maxWorkload", e.target.value)}
                          placeholder="Enter max workload"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Enter role description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Select value={formData.color} onValueChange={(value) => handleInputChange("color", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Permissions *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {availablePermissions.map((permission) => (
                          <div
                            key={permission.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedPermissions.includes(permission.id)
                                ? 'bg-blue-100 border-blue-300'
                                : 'bg-white border-neutral-200 hover:bg-neutral-50'
                            }`}
                            onClick={() => handlePermissionToggle(permission.id)}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                                className="rounded"
                              />
                              <div>
                                <div className="text-sm font-medium">{permission.name}</div>
                                <div className="text-xs text-neutral-500">{permission.description}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button onClick={handleSaveRole}>
                        <Save className="h-4 w-4 mr-2" />
                        {editingRole ? "Update Role" : "Create Role"}
                      </Button>
                      <Button onClick={handleCancel} variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
