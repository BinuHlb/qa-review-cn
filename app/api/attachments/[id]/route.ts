import { NextResponse } from "next/server"

/**
 * DELETE /api/attachments/[id] - Delete an attachment
 */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Delete file from storage
    // const { id } = await context.params
    // const attachment = await db.attachment.findUnique({ where: { id } })
    // await deleteFromStorage(attachment.url)
    // await db.attachment.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting attachment:", error)
    return NextResponse.json(
      { error: "Failed to delete attachment" },
      { status: 500 }
    )
  }
}

