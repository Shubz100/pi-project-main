// app/api/updateUser/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json()

        if (!userData || !userData.telegramId) {
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId: userData.telegramId },
            data: {
                piAmount: userData.piAmount,
                paymentAddress: userData.paymentAddress,
                PiAddress: userData.PiAddress
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
