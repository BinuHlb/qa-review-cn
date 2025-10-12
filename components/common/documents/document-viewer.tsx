"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2
} from "lucide-react"

export interface Document {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadedAt: string
  type: string
  url?: string
}

interface DocumentViewerProps {
  documents: Document[]
  onDownload?: (doc: Document) => void
  showUpload?: boolean
  onUpload?: (files: File[]) => void
}

export function DocumentViewer({ 
  documents, 
  onDownload,
  showUpload = false,
  onUpload
}: DocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(100)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleViewDocument = (docId: string) => {
    setSelectedDocument(docId)
  }

  const handleCloseDocument = () => {
    setSelectedDocument(null)
    if (isFullscreen) {
      exitFullscreen()
    }
  }

  const handleDownload = (doc: Document) => {
    if (onDownload) {
      onDownload(doc)
    } else {
      console.log('Downloading:', doc.name)
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50))
  }

  const enterFullscreen = async () => {
    if (previewRef.current) {
      try {
        await previewRef.current.requestFullscreen()
        setIsFullscreen(true)
      } catch (err) {
        console.error('Error entering fullscreen:', err)
      }
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
      setIsFullscreen(false)
    } catch (err) {
      console.error('Error exiting fullscreen:', err)
    }
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Review Documents
      </h3>
      
      {/* Document List */}
      <div className="space-y-2">
        {documents.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No documents available
          </div>
        ) : (
          documents.map((doc) => (
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
          ))
        )}
      </div>

      {/* Document Preview Area */}
      {selectedDocument ? (
        <div 
          ref={previewRef}
          className={`relative border rounded-lg overflow-hidden ${
            isFullscreen ? 'bg-black' : 'bg-white'
          }`}
        >
          {/* Preview Header */}
          <div className={`flex items-center justify-between p-3 border-b ${
            isFullscreen ? 'bg-gray-900 text-white border-gray-700' : 'bg-muted/30'
          }`}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className={`h-4 w-4 flex-shrink-0 ${
                isFullscreen ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className="font-medium text-sm truncate">
                {documents.find(d => d.id === selectedDocument)?.name}
              </span>
              {isFullscreen && (
                <span className="text-xs text-gray-400 ml-2">
                  {zoom}%
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className={`h-7 w-7 p-0 ${
                  isFullscreen ? 'hover:bg-gray-800 text-white' : ''
                }`}
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className={`h-7 w-7 p-0 ${
                  isFullscreen ? 'hover:bg-gray-800 text-white' : ''
                }`}
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className={`h-7 w-7 p-0 ${
                  isFullscreen ? 'hover:bg-gray-800 text-white' : ''
                }`}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDocument}
                className={`h-7 w-7 p-0 ${
                  isFullscreen ? 'hover:bg-gray-800 text-white' : ''
                }`}
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Document Content */}
          <div 
            className={`relative overflow-auto ${
              isFullscreen 
                ? 'bg-gray-900 min-h-screen max-h-screen' 
                : 'bg-gray-50 min-h-[300px] max-h-[400px]'
            }`}
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            {(() => {
              const doc = documents.find(d => d.id === selectedDocument)
              if (!doc) return null

              // Determine document type
              const isPDF = doc.type?.includes('pdf') || doc.name?.endsWith('.pdf')
              const isExcel = doc.type?.includes('sheet') || doc.name?.endsWith('.xlsx') || doc.name?.endsWith('.xls')

              // PDF Document Preview
              if (isPDF) {
                return (
                  <div className={`p-6 m-3 shadow-sm rounded-lg ${
                    isFullscreen ? 'bg-white max-w-4xl mx-auto' : 'bg-white'
                  }`}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{doc.name.replace('.pdf', '')}</h2>
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
                  <div className={`p-3 ${isFullscreen ? 'max-w-5xl mx-auto' : ''}`}>
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
  )
}

