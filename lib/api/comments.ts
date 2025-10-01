/**
 * API client for comments management
 */

import { type Comment, type CreateComment } from "@/lib/schemas/review.schema"

const API_BASE = "/api/comments"

export class CommentsAPI {
  /**
   * Fetch comments for a review
   */
  static async getByReviewId(reviewId: string): Promise<Comment[]> {
    const response = await fetch(`${API_BASE}?reviewId=${reviewId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Create a new comment
   */
  static async create(data: CreateComment): Promise<Comment> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to create comment: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Delete a comment
   */
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.statusText}`)
    }
  }
}

