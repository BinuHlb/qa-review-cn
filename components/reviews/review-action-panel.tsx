"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type Review, getGradeColor } from "@/lib/mock-data"
import { type Attachment } from "@/components/shared/attachments-section"
import { GradeSelect } from "@/components/shared/grade-select"
import { useAttachments } from "@/hooks/use-attachments"
import { 
  generateInitials,
  generateAvatarColor
} from "@/lib/utils/review-utils"
import { 
  Star, 
  Send, 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react"


interface ReviewActionPanelProps {
  review: Review
  initialAttachments?: Attachment[]
  onAttachmentUpload?: (files: File[]) => Promise<Attachment[]>
  onAttachmentRemove?: (attachmentId: string) => Promise<void>
  onAttachmentDownload?: (attachment: Attachment) => Promise<void>
  showSubmitRating?: boolean
  onSubmitRating?: (reviewId: string, grade: string, notes: string) => Promise<void>
  showTechnicalDirectorRating?: boolean
  onTechnicalDirectorRating?: (reviewId: string, grade: string, notes: string) => Promise<void>
  reviewers?: Array<{ id: string; name: string; role: string; status: string }>
  onSubmit?: (data: Record<string, unknown>) => void
  onAssignReviewer?: (review: Review) => void
}

export function ReviewActionPanel({ 
  review, 
  initialAttachments = [],
  onAttachmentUpload,
  onAttachmentRemove,
  onAttachmentDownload,
  showSubmitRating = false,
  onSubmitRating,
  showTechnicalDirectorRating = false,
  onTechnicalDirectorRating
}: ReviewActionPanelProps) {
  
  const [selectedGrade, setSelectedGrade] = useState<string>(review.currentGrade)
  const [reviewNotes, setReviewNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  
  // Use review documents or initial attachments
  const initialDocs = review.documents || initialAttachments
  
  // Use dynamic attachments hook
  const {
    attachments,
    handleUpload,
    handleRemove,
    handleDownload
  } = useAttachments({
    initialAttachments: initialDocs,
    onUpload: onAttachmentUpload,
    onRemove: onAttachmentRemove,
    onDownload: onAttachmentDownload
  })

  const handleViewDocument = (docId: string) => {
    setSelectedDocument(docId)
  }

  const handleCloseDocument = () => {
    setSelectedDocument(null)
  }

  const handleSubmitRating = async () => {
    if (!selectedGrade || !onSubmitRating) return
    
    setIsSubmitting(true)
    try {
      await onSubmitRating(review.id, selectedGrade, reviewNotes)
      // Reset form after successful submission
      setReviewNotes("")
    } catch (error) {
      console.error("Failed to submit rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTechnicalDirectorRating = async () => {
    if (!selectedGrade || !onTechnicalDirectorRating) return
    
    setIsSubmitting(true)
    try {
      await onTechnicalDirectorRating(review.id, selectedGrade, reviewNotes)
      // Reset form after successful submission
      setReviewNotes("")
    } catch (error) {
      console.error("Failed to submit technical director rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }





  return (
    <div className="h-full flex flex-col bg-background overflow-hidden p-6">
      {/* Selected Review Header */}
      <div className="flex-shrink-0 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className={`${generateAvatarColor(review.memberFirm)} text-sm font-semibold`}>
              {generateInitials(review.memberFirm)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-neutral-900 truncate" title={review.memberFirm}>
              {review.memberFirm}
            </h3>
            <p className="text-sm text-neutral-500 truncate" title={review.type}>
              {review.type}
            </p>
          </div>
        </div>
      </div>

      {/* Current Grade - Highlighted */}
      <div className="flex-shrink-0 my-4 bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${getGradeColor(review.currentGrade)} p-3 rounded-lg`}>
              <Star className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Current Rating</p>
              <p className="text-2xl font-bold text-neutral-900 mt-0.5">Rating {review.currentGrade}</p>
            </div>
          </div>
          <div className="text-center">
            <Badge className={`${getGradeColor(review.currentGrade)} text-base px-4 py-1.5 font-semibold`}>
              {review.currentGrade}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {review.currentGrade === '1' ? 'Best' :
               review.currentGrade === '2' ? 'Good' :
               review.currentGrade === '3' ? 'Ok' :
               review.currentGrade === '4' ? 'Bad' :
               'Poor'}
            </p>
          </div>
        </div>
      </div>

      {/* Review Documents - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Review Documents
          </h3>
          
          {/* Document List */}
          <div className="space-y-2">
            {attachments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(doc.uploadedAt).toLocaleDateString()}
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
                    onClick={() => handleDownload(doc)}
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
                    {attachments.find(d => d.id === selectedDocument)?.name}
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
              <div className="relative bg-gray-50 min-h-[300px] max-h-[400px] overflow-auto">
                {(() => {
                  const doc = attachments.find(d => d.id === selectedDocument)
                  if (!doc) return null

                  // Determine document type
                  const isPDF = doc.type?.includes('pdf') || doc.name?.endsWith('.pdf')
                  const isExcel = doc.type?.includes('sheet') || doc.name?.endsWith('.xlsx') || doc.name?.endsWith('.xls')

                  // PDF Document Preview
                  if (isPDF) {
                    return (
                      <div className="p-6 bg-white m-3 shadow-sm rounded-lg">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h2 className="text-lg font-bold text-gray-900">{doc.name.replace('.pdf', '')}</h2>
                            <div className="h-0.5 bg-blue-600 w-12" />
                          </div>
                          
                          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                            <p className="font-semibold">Executive Summary</p>
                            <p>
                              This document provides a comprehensive overview of the quality assurance review. 
                              All requirements have been met according to established guidelines and industry standards.
                            </p>
                            
                            <p className="font-semibold mt-4">Key Findings</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>All compliance requirements satisfied</li>
                              <li>Quality standards met across all areas</li>
                              <li>Successful completion of review checkpoints</li>
                              <li>Recommendations for continuous improvement</li>
                            </ul>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                              <p className="font-semibold text-blue-900 mb-1">Review Status</p>
                              <p className="text-blue-800 text-xs">
                                All review criteria have been assessed. The firm demonstrates adherence 
                                to quality standards and best practices.
                              </p>
                            </div>

                            <p className="text-xs text-gray-500 mt-6 pt-3 border-t">
                              Document ID: {doc.id} | Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  // Excel Document Preview
                  if (isExcel) {
                    return (
                      <div className="p-3">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                          {/* Excel Tabs */}
                          <div className="flex border-b bg-gray-50">
                            <div className="px-3 py-1.5 text-xs font-medium text-blue-600 border-b-2 border-blue-600 bg-white">
                              Summary
                            </div>
                            <div className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">
                              Details
                            </div>
                          </div>

                          {/* Excel Content */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-gray-100 border-b">
                                  <th className="px-2 py-1.5 text-left font-semibold border-r">Item</th>
                                  <th className="px-2 py-1.5 text-left font-semibold border-r">Status</th>
                                  <th className="px-2 py-1.5 text-left font-semibold border-r">Score</th>
                                  <th className="px-2 py-1.5 text-left font-semibold">Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b hover:bg-gray-50">
                                  <td className="px-2 py-1.5 border-r">Financial Controls</td>
                                  <td className="px-2 py-1.5 border-r"><span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">Pass</span></td>
                                  <td className="px-2 py-1.5 border-r font-medium">95%</td>
                                  <td className="px-2 py-1.5">{new Date().toLocaleDateString()}</td>
                                </tr>
                                <tr className="border-b hover:bg-gray-50">
                                  <td className="px-2 py-1.5 border-r">Quality Standards</td>
                                  <td className="px-2 py-1.5 border-r"><span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">Pass</span></td>
                                  <td className="px-2 py-1.5 border-r font-medium">92%</td>
                                  <td className="px-2 py-1.5">{new Date().toLocaleDateString()}</td>
                                </tr>
                                <tr className="border-b hover:bg-gray-50">
                                  <td className="px-2 py-1.5 border-r">Documentation</td>
                                  <td className="px-2 py-1.5 border-r"><span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">Pass</span></td>
                                  <td className="px-2 py-1.5 border-r font-medium">98%</td>
                                  <td className="px-2 py-1.5">{new Date().toLocaleDateString()}</td>
                                </tr>
                                <tr className="bg-blue-50 font-semibold">
                                  <td className="px-2 py-1.5 border-r">Overall</td>
                                  <td className="px-2 py-1.5 border-r"><span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">Pass</span></td>
                                  <td className="px-2 py-1.5 border-r text-blue-600">95%</td>
                                  <td className="px-2 py-1.5">{new Date().toLocaleDateString()}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="p-2 bg-gray-50 border-t text-xs text-gray-500">
                            Sheet: Summary | Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
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
            <div className="border rounded-lg p-6 bg-muted/20 min-h-[150px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click &quot;View&quot; to preview documents
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Rating Form - Fixed at Bottom */}
      {(showSubmitRating || showTechnicalDirectorRating) && (
        <div className="flex-shrink-0 mt-4 pt-4 border-t">
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-neutral-900">
                {showTechnicalDirectorRating 
                  ? "Technical Director Rating" 
                  : "Submit Review Rating"}
              </h3>
            </div>

            {showTechnicalDirectorRating && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800">
                  <strong>Reviewer:</strong> {review.reviewer}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Review the submitted work and provide your technical assessment
                </p>
              </div>
            )}

            {/* Grade Selection */}
            <GradeSelect
              value={selectedGrade}
              onValueChange={setSelectedGrade}
              label={showTechnicalDirectorRating ? "Technical Director Grade" : "Your Grade"}
              placeholder="Select grade"
              required={true}
            />

            {/* Review Notes */}
            <div className="space-y-2">
              <Label htmlFor="reviewNotes" className="text-xs font-medium text-muted-foreground">
                {showTechnicalDirectorRating ? "Technical Feedback (Optional)" : "Review Notes (Optional)"}
              </Label>
              <Textarea
                id="reviewNotes"
                name="reviewNotes"
                placeholder={showTechnicalDirectorRating 
                  ? "Add your technical assessment and feedback..."
                  : "Add your review comments and findings..."}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="text-sm resize-none bg-white"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={showTechnicalDirectorRating ? handleTechnicalDirectorRating : handleSubmitRating}
              disabled={isSubmitting || !selectedGrade}
              className="w-full h-9 bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting 
                ? "Submitting..." 
                : showTechnicalDirectorRating 
                  ? "Submit Technical Rating" 
                  : "Submit Rating"}
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}

