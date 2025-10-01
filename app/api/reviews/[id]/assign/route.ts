import { NextRequest, NextResponse } from "next/server"
import { assignReviewerSchema } from "@/lib/schemas/review.schema"
import { mockReviews } from "@/lib/mock-data"

/**
 * POST /api/reviews/[id]/assign - Assign a reviewer to a review
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    
    // Validate request body
    const validatedData = assignReviewerSchema.parse({ reviewId: id, ...body })
    
    // TODO: Replace with actual database update
    // const updatedReview = await db.review.update({
    //   where: { id },
    //   data: { reviewerId: validatedData.reviewerId }
    // })
    
    const review = mockReviews.find(r => r.id === id)
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      )
    }
    
    const updatedReview = {
      ...review,
      reviewerId: validatedData.reviewerId,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    
    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error assigning reviewer:", error)
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to assign reviewer" },
      { status: 500 }
    )
  }
}

