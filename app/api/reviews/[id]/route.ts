import { NextRequest, NextResponse } from "next/server"
import { mockReviews } from "@/lib/mock-data"
import { updateReviewSchema } from "@/lib/schemas/review.schema"

/**
 * GET /api/reviews/[id] - Fetch a single review
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // TODO: Replace with actual database query
    // const review = await db.review.findUnique({ where: { id } })
    
    const review = mockReviews.find(r => r.id === id)
    
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(review)
  } catch (error) {
    console.error("Error fetching review:", error)
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/reviews/[id] - Update a review
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateReviewSchema.parse({ id, ...body })
    
    // TODO: Replace with actual database update
    // const updatedReview = await db.review.update({
    //   where: { id },
    //   data: validatedData
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
      ...validatedData,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    
    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error updating review:", error)
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/reviews/[id] - Delete a review
 */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // TODO: Replace with actual database delete
    // await db.review.delete({ where: { id } })
    
    const review = mockReviews.find(r => r.id === id)
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    )
  }
}

