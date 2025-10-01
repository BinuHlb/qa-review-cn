import { NextRequest, NextResponse } from "next/server"
import { type Attachment } from "@/lib/schemas/review.schema"

// Temporary in-memory storage (replace with database)
const attachments = new Map<string, Attachment[]>()

/**
 * GET /api/attachments?reviewId=xxx - Fetch attachments for a review
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reviewId = searchParams.get("reviewId")
    
    if (!reviewId) {
      return NextResponse.json(
        { error: "reviewId is required" },
        { status: 400 }
      )
    }
    
    // TODO: Replace with actual database query
    // const reviewAttachments = await db.attachment.findMany({
    //   where: { reviewId }
    // })
    
    const reviewAttachments = attachments.get(reviewId) || []
    
    return NextResponse.json(reviewAttachments)
  } catch (error) {
    console.error("Error fetching attachments:", error)
    return NextResponse.json(
      { error: "Failed to fetch attachments" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/attachments - Upload a file
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const reviewId = formData.get("reviewId") as string
    
    if (!file || !reviewId) {
      return NextResponse.json(
        { error: "File and reviewId are required" },
        { status: 400 }
      )
    }
    
    // TODO: Upload file to storage (S3, Cloudinary, etc.)
    // const fileUrl = await uploadToStorage(file)
    
    // TODO: Save attachment to database
    // const newAttachment = await db.attachment.create({
    //   data: {
    //     reviewId,
    //     name: file.name,
    //     size: file.size,
    //     type: file.type,
    //     url: fileUrl,
    //     uploadedBy: session.user.name,
    //     uploadedById: session.user.id,
    //   }
    // })
    
    const newAttachment = {
      id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reviewId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: `/uploads/${file.name}`, // Mock URL
      uploadedBy: "Current User",
      uploadedById: "user-1",
      uploadedAt: new Date().toISOString(),
    }
    
    // Store in memory (temporary)
    const reviewAttachments = attachments.get(reviewId) || []
    reviewAttachments.push(newAttachment)
    attachments.set(reviewId, reviewAttachments)
    
    return NextResponse.json(newAttachment, { status: 201 })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}

