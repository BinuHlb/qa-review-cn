"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle,
  Eye,
  Calendar,
  Building,
  Users,
  Mail,
  Phone,
  Star,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react"
import { type MemberFirm } from "@/lib/member-firms-mock-data"

interface MemberFirmReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberFirm: MemberFirm | null
  onAccept?: (firmId: string, notes: string) => void
  onReject?: (firmId: string, notes: string) => void
}

export function MemberFirmReviewDialog({
  open,
  onOpenChange,
  memberFirm,
  onAccept,
  onReject
}: MemberFirmReviewDialogProps) {
  const [reviewNotes, setReviewNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)

  const handleAccept = async () => {
    if (!memberFirm) return
    setIsProcessing(true)
    try {
      await onAccept?.(memberFirm.id, reviewNotes)
      setReviewNotes("")
      setSelectedDocument(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Error accepting review:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!memberFirm) return
    setIsProcessing(true)
    try {
      await onReject?.(memberFirm.id, reviewNotes)
      setReviewNotes("")
      setSelectedDocument(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Error rejecting review:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = (docName: string) => {
    console.log("Downloading document:", docName)
    // TODO: Implement actual download
  }

  const handleViewDocument = (docId: string) => {
    setSelectedDocument(docId)
  }

  const handleCloseDocument = () => {
    setSelectedDocument(null)
  }

  // Mock documents
  const mockDocuments = [
    {
      id: "1",
      name: "Financial_Report_2024.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2024-01-15"
    },
    {
      id: "2",
      name: "Compliance_Checklist.xlsx",
      type: "Excel",
      size: "856 KB",
      uploadDate: "2024-01-18"
    },
    {
      id: "3",
      name: "Audit_Summary.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadDate: "2024-01-20"
    }
  ]

  if (!memberFirm) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Review Member Firm - {memberFirm.name}
          </DialogTitle>
          <DialogDescription>
            Review the documents and provide your decision with optional notes
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Firm Summary */}
          <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-background to-muted/20">
            {/* Header Section */}
            <div className="p-4 border-b bg-background/50 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {memberFirm.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-foreground truncate">
                      {memberFirm.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Building className="h-3 w-3" />
                      <span className="truncate">{memberFirm.location}</span>
                      <span>•</span>
                      <span>{memberFirm.country}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {memberFirm.type}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs px-2.5 py-0.5 ${
                      memberFirm.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}
                  >
                    {memberFirm.status.charAt(0).toUpperCase() + memberFirm.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
              <div className="group relative overflow-hidden rounded-lg bg-background p-3 border hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                    <div className="h-7 w-7 rounded-md bg-blue-50 flex items-center justify-center">
                      <Users className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <p className="text-xs font-medium">Employees</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{memberFirm.employeeCount}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg bg-background p-3 border hover:border-purple-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                    <div className="h-7 w-7 rounded-md bg-purple-50 flex items-center justify-center">
                      <Building className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <p className="text-xs font-medium">Partners</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{memberFirm.partnerCount}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg bg-background p-3 border hover:border-green-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                    <div className="h-7 w-7 rounded-md bg-green-50 flex items-center justify-center">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <p className="text-xs font-medium">Compliance</p>
                  </div>
                  <p className="text-xl font-bold text-green-600">{memberFirm.complianceScore}%</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg bg-background p-3 border hover:border-orange-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                    <div className="h-7 w-7 rounded-md bg-orange-50 flex items-center justify-center">
                      <FileText className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                    <p className="text-xs font-medium">Reviews</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{memberFirm.totalReviews}</p>
                </div>
              </div>
            </div>

            {/* Quick Info Bar */}
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background border">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground truncate max-w-[180px]" title={memberFirm.contactEmail}>
                    {memberFirm.contactEmail}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background border">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{memberFirm.contactPhone}</span>
                </div>
                {memberFirm.specializations.length > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 border border-blue-200">
                    <Star className="h-3 w-3 text-blue-600" />
                    <span className="text-blue-700 font-medium">
                      {memberFirm.specializations.length} Specialization{memberFirm.specializations.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Review Documents
            </h3>
            
            <div className="space-y-2">
              {mockDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {doc.uploadDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant={selectedDocument === doc.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleViewDocument(doc.id)}
                      className="h-8"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(doc.name)}
                      className="h-8"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Preview Area */}
            {selectedDocument ? (
              <div className="relative border rounded-lg overflow-hidden bg-white">
                {/* Preview Header */}
                <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">
                      {mockDocuments.find(d => d.id === selectedDocument)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      title="Fullscreen"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseDocument}
                      className="h-7 w-7 p-0"
                      title="Close"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Document Content */}
                <div className="relative bg-gray-50 min-h-[400px] max-h-[500px] overflow-auto">
                  {(() => {
                    const doc = mockDocuments.find(d => d.id === selectedDocument)
                    if (!doc) return null

                    // PDF Document Preview
                    if (doc.type === "PDF") {
                      return (
                        <div className="p-8 bg-white m-4 shadow-sm rounded-lg">
                          <div className="space-y-6">
                            {/* Mock PDF Content */}
                            <div className="space-y-2">
                              <h2 className="text-xl font-bold text-gray-900">{doc.name.replace('.pdf', '')}</h2>
                              <div className="h-0.5 bg-blue-600 w-16" />
                            </div>
                            
                            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                              <p className="font-semibold text-base">Executive Summary</p>
                              <p>
                                This document provides a comprehensive overview of the financial performance and compliance status 
                                for the fiscal year 2024. All requirements have been met according to the established guidelines 
                                and industry standards.
                              </p>
                              
                              <p className="font-semibold text-base mt-6">Key Findings</p>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>Revenue growth of 15% year-over-year</li>
                                <li>Full compliance with regulatory requirements</li>
                                <li>Successful completion of all audit checkpoints</li>
                                <li>Implementation of new quality control measures</li>
                              </ul>

                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                                <p className="font-semibold text-blue-900 mb-2">Compliance Status</p>
                                <p className="text-blue-800">
                                  All compliance metrics have been satisfied. The firm demonstrates strong adherence 
                                  to regulatory standards and best practices.
                                </p>
                              </div>

                              <p className="font-semibold text-base mt-6">Financial Highlights</p>
                              <div className="grid grid-cols-2 gap-4 mt-3">
                                <div className="p-3 bg-gray-50 rounded border">
                                  <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                                  <p className="text-lg font-bold">$12.5M</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border">
                                  <p className="text-xs text-gray-500 mb-1">Net Profit</p>
                                  <p className="text-lg font-bold">$2.8M</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border">
                                  <p className="text-xs text-gray-500 mb-1">Operating Margin</p>
                                  <p className="text-lg font-bold">22.4%</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border">
                                  <p className="text-xs text-gray-500 mb-1">Growth Rate</p>
                                  <p className="text-lg font-bold">15%</p>
                                </div>
                              </div>

                              <p className="text-xs text-gray-500 mt-8 pt-4 border-t">
                                Document ID: {doc.id} | Generated: {doc.uploadDate} | Page 1 of 1
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    // Excel Document Preview
                    if (doc.type === "Excel") {
                      return (
                        <div className="p-4">
                          <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                            {/* Excel Tabs */}
                            <div className="flex border-b bg-gray-50">
                              <div className="px-4 py-2 text-xs font-medium text-blue-600 border-b-2 border-blue-600 bg-white">
                                Summary
                              </div>
                              <div className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">
                                Details
                              </div>
                              <div className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">
                                Analysis
                              </div>
                            </div>

                            {/* Excel Content */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-gray-100 border-b">
                                    <th className="px-3 py-2 text-left font-semibold border-r">Item</th>
                                    <th className="px-3 py-2 text-left font-semibold border-r">Status</th>
                                    <th className="px-3 py-2 text-left font-semibold border-r">Score</th>
                                    <th className="px-3 py-2 text-left font-semibold border-r">Comments</th>
                                    <th className="px-3 py-2 text-left font-semibold">Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2 border-r">Financial Controls</td>
                                    <td className="px-3 py-2 border-r"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Compliant</span></td>
                                    <td className="px-3 py-2 border-r font-medium">95%</td>
                                    <td className="px-3 py-2 border-r text-gray-600">Excellent</td>
                                    <td className="px-3 py-2">2024-01-15</td>
                                  </tr>
                                  <tr className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2 border-r">Risk Management</td>
                                    <td className="px-3 py-2 border-r"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Compliant</span></td>
                                    <td className="px-3 py-2 border-r font-medium">92%</td>
                                    <td className="px-3 py-2 border-r text-gray-600">Very Good</td>
                                    <td className="px-3 py-2">2024-01-16</td>
                                  </tr>
                                  <tr className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2 border-r">Audit Procedures</td>
                                    <td className="px-3 py-2 border-r"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Compliant</span></td>
                                    <td className="px-3 py-2 border-r font-medium">98%</td>
                                    <td className="px-3 py-2 border-r text-gray-600">Outstanding</td>
                                    <td className="px-3 py-2">2024-01-17</td>
                                  </tr>
                                  <tr className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2 border-r">Quality Control</td>
                                    <td className="px-3 py-2 border-r"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Review</span></td>
                                    <td className="px-3 py-2 border-r font-medium">88%</td>
                                    <td className="px-3 py-2 border-r text-gray-600">Good</td>
                                    <td className="px-3 py-2">2024-01-18</td>
                                  </tr>
                                  <tr className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2 border-r">Documentation</td>
                                    <td className="px-3 py-2 border-r"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Compliant</span></td>
                                    <td className="px-3 py-2 border-r font-medium">94%</td>
                                    <td className="px-3 py-2 border-r text-gray-600">Excellent</td>
                                    <td className="px-3 py-2">2024-01-19</td>
                                  </tr>
                                  <tr className="bg-blue-50 font-semibold">
                                    <td className="px-3 py-2 border-r">Overall Compliance</td>
                                    <td className="px-3 py-2 border-r"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Compliant</span></td>
                                    <td className="px-3 py-2 border-r text-blue-600">93.4%</td>
                                    <td className="px-3 py-2 border-r text-gray-600">Very Good</td>
                                    <td className="px-3 py-2">2024-01-20</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="p-3 bg-gray-50 border-t text-xs text-gray-500">
                              <p>Sheet: Summary | Last modified: {doc.uploadDate}</p>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return null
                  })()}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-6 bg-muted/20 min-h-[200px] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click "View" on any document to preview it here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Document viewer will display PDF and Excel files
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Review Notes */}
          <div className="space-y-2">
            <Label htmlFor="review-notes" className="text-sm font-semibold">
              Review Notes (Optional)
            </Label>
            <Textarea
              id="review-notes"
              name="reviewNotes"
              placeholder="Add your review comments, observations, or reasons for your decision..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

