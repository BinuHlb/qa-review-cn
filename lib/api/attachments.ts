/**
 * API client for file attachments management
 */

import { type Attachment } from "@/lib/schemas/review.schema"

const API_BASE = "/api/attachments"

export class AttachmentsAPI {
  /**
   * Fetch attachments for a review
   */
  static async getByReviewId(reviewId: string): Promise<Attachment[]> {
    const response = await fetch(`${API_BASE}?reviewId=${reviewId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch attachments: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Upload a file attachment
   */
  static async upload(reviewId: string, file: File): Promise<Attachment> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("reviewId", reviewId)

    const response = await fetch(API_BASE, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Delete an attachment
   */
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete attachment: ${response.statusText}`)
    }
  }

  /**
   * Download an attachment
   */
  static async download(id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/${id}/download`, {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`)
    }

    return response.blob()
  }
}

