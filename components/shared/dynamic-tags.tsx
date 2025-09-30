"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface DynamicTagsProps {
  label: string
  placeholder: string
  tags: string[]
  onTagsChange: (tags: string[]) => void
  maxTags?: number
  className?: string
}

export function DynamicTags({ 
  label, 
  placeholder, 
  tags, 
  onTagsChange, 
  maxTags,
  className = "" 
}: DynamicTagsProps) {
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && (!maxTags || tags.length < maxTags)) {
      onTagsChange([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
          disabled={maxTags ? tags.length >= maxTags : false}
        />
        <Button type="button" onClick={addTag} size="sm" disabled={maxTags ? tags.length >= maxTags : false}>
          Add
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeTag(index)}
              />
            </Badge>
          ))}
        </div>
      )}
      {maxTags && (
        <p className="text-xs text-muted-foreground">
          {tags.length}/{maxTags} tags
        </p>
      )}
    </div>
  )
}
