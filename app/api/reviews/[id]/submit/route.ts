import { NextResponse } from "next/server"
import { mockReviews } from "@/lib/mock-data"

/**
 * POST /api/reviews/[id]/submit - Submit a review
 */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // TODO: Replace with actual database update
    // const updatedReview = await db.review.update({
    //   where: { id },
    //   data: { 
    //     status: 'Completed',
    //     lastUpdated: new Date()
    //   }
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
      status: 'Completed' as const,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    
    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error submitting review:", error)
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    )
  }
}

