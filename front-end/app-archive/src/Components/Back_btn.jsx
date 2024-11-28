import React from 'react'
import { Link } from 'react-router-dom'
import { CircleArrowLeft } from 'lucide-react'

export default function Back_btn() {
  return (
    <div className="fixed right-1 top-1/2 transform -translate-y-1/2">
      <Link to="/settings" className="btn bg-blue-500 text-white rounded-2xl btn-primary">
        <CircleArrowLeft size={24} />
      </Link>
    </div>
  )
}
