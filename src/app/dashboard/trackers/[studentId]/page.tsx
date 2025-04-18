import TrackerList from '@/components/dashboard/TrackerList'
import React from 'react'

export default function page({ params }: { params: { studentId: string } }) {
  return (
    <div className="p-6">
      <TrackerList studentId={params.studentId} />
    </div>
  )
}
