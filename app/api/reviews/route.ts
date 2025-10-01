import { NextRequest, NextResponse } from "next/server"
import { mockReviews } from "@/lib/mock-data"
import { createReviewSchema } from "@/lib/schemas/review.schema"

/**
 * GET /api/reviews - Fetch all reviews
 */
export async function GET() {
  try {
    // TODO: Replace with actual database query
    // const reviews = await db.review.findMany()
    
    return NextResponse.json(mockReviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/reviews - Create a new review
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createReviewSchema.parse(body)
    
    // TODO: Replace with actual database insert
    // const newReview = await db.review.create({ data: validatedData })
    
    const newReview = {
      id: `REV-${Date.now()}`,
      ...validatedData,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    
    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}

