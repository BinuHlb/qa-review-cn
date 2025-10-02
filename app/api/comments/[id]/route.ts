import { NextResponse } from "next/server"

/**
 * DELETE /api/comments/[id] - Delete a comment
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Replace with actual database delete
    const { id: _id } = await params
    // await db.comment.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    )
  }
}

