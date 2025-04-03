import React from 'react'
import { ScreenLayout } from '../layouts/ScreenLayout'
import { InfoCard } from '../layouts/InfoCard'

export const Clients = () => {
  return (
    <ScreenLayout>
        <InfoCard>
            <h1 className="text-xl text-center font-bold text-gray-800">Clients</h1>
        </InfoCard>
    </ScreenLayout>
  )
}

