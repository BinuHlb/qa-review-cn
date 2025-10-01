import { NextRequest, NextResponse } from "next/server"
import { createCommentSchema } from "@/lib/schemas/review.schema"

import { type Comment } from "@/lib/schemas/review.schema"

// Temporary in-memory storage (replace with database)
const comments = new Map<string, Comment[]>()

/**
 * GET /api/comments?reviewId=xxx - Fetch comments for a review
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
    // const reviewComments = await db.comment.findMany({
    //   where: { reviewId }
    // })
    
    const reviewComments = comments.get(reviewId) || []
    
    return NextResponse.json(reviewComments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/comments - Create a new comment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createCommentSchema.parse(body)
    
    // TODO: Replace with actual database insert
    // const newComment = await db.comment.create({ data: validatedData })
    
    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...validatedData,
      timestamp: new Date().toISOString(),
    }
    
    // Store in memory (temporary)
    const reviewComments = comments.get(validatedData.reviewId) || []
    reviewComments.push(newComment)
    comments.set(validatedData.reviewId, reviewComments)
    
    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}

