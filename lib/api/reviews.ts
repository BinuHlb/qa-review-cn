/**
 * API client for reviews management
 * Handles all HTTP requests to the reviews API
 */

import { type Review, type CreateReview, type UpdateReview, type AssignReviewer } from "@/lib/schemas/review.schema"

const API_BASE = "/api/reviews"

export class ReviewsAPI {
  /**
   * Fetch all reviews
   */
  static async getAll(): Promise<Review[]> {
    const response = await fetch(API_BASE, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Fetch a single review by ID
   */
  static async getById(id: string): Promise<Review> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch review: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Create a new review
   */
  static async create(data: CreateReview): Promise<Review> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to create review: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Update an existing review
   */
  static async update(id: string, data: Partial<UpdateReview>): Promise<Review> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update review: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Delete a review
   */
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete review: ${response.statusText}`)
    }
  }

  /**
   * Assign a reviewer to a review
   */
  static async assignReviewer(data: AssignReviewer): Promise<Review> {
    const response = await fetch(`${API_BASE}/${data.reviewId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to assign reviewer: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Submit a review
   */
  static async submit(id: string): Promise<Review> {
    const response = await fetch(`${API_BASE}/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Failed to submit review: ${response.statusText}`)
    }

    return response.json()
  }
}

