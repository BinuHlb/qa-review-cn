import { NextResponse } from "next/server"

/**
 * GET /api/attachments/[id]/download - Download an attachment
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Fetch attachment from database
    const { id: _id } = await params
    // const attachment = await db.attachment.findUnique({ where: { id } })
    // const fileBuffer = await fetchFromStorage(attachment.url)
    
    // Mock response for development
    return NextResponse.json(
      { error: "Download functionality requires storage setup" },
      { status: 501 }
    )
    
    // Production implementation:
    // return new NextResponse(fileBuffer, {
    //   headers: {
    //     "Content-Type": attachment.type,
    //     "Content-Disposition": `attachment; filename="${attachment.name}"`,
    //   },
    // })
  } catch (error) {
    console.error("Error downloading attachment:", error)
    return NextResponse.json(
      { error: "Failed to download attachment" },
      { status: 500 }
    )
  }
}

