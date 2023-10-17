import React from 'react'
import { BiGroup } from 'react-icons/bi'
import { FcList } from 'react-icons/fc';
import { GrAchievement } from 'react-icons/gr'

type Props = {
    row: any;
}

function StagePill({ row }: Props) {
  return (
    <div key={row.$id} className={`${row.default ? 'opacity-100 animate-pulse font-black': row.complete ? 'opacity-100 text-red-900 font-semibold ':'opacity-40 font-semibold ' } flex items-center space-x-1 tracking-wider`}>
        <GrAchievement className="w-5 h-5" />
        <span className="text-xs uppercase">{row.name}</span>
    </div>
  )
}

export default StagePill