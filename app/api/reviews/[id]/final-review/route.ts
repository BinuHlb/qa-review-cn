import { NextRequest, NextResponse } from "next/server"
import { mockReviews } from "@/lib/mock-data"

/**
 * POST /api/reviews/[id]/final-review - Confirm final review with grade
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    
    const { finalGrade, adminNotes } = body
    
    if (!finalGrade) {
      return NextResponse.json(
        { error: "Final grade is required" },
        { status: 400 }
      )
    }

    // TODO: Replace with actual database update
    // const updatedReview = await db.review.update({
    //   where: { id },
    //   data: { 
    //     currentGrade: finalGrade,
    //     status: 'Finalized',
    //     adminNotes,
    //     finalizedAt: new Date(),
    //     finalizedBy: session.user.id
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
      currentGrade: finalGrade,
      status: 'Finalized' as const,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    
    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error confirming final review:", error)
    return NextResponse.json(
      { error: "Failed to confirm final review" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/reviews/[id]/reject - Reject review and send back for revision
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    
    const { rejectionReason } = body
    
    if (!rejectionReason?.trim()) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      )
    }

    // TODO: Replace with actual database update
    // const updatedReview = await db.review.update({
    //   where: { id },
    //   data: { 
    //     status: 'Rejected',
    //     rejectionReason,
    //     rejectedAt: new Date(),
    //     rejectedBy: session.user.id
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
      status: 'Rejected' as const,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    
    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error rejecting review:", error)
    return NextResponse.json(
      { error: "Failed to reject review" },
      { status: 500 }
    )
  }
}
