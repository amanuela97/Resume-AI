import React from 'react'
import { CardContent, CardFooter } from './ui/card'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import Image from 'next/image'
import { useAppStore } from '@/app/store';
import ProtectedRoute from './ProtectedRoute'

export default function AccountSettings() {
    const { user } = useAppStore();

    return (
        <ProtectedRoute>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                            src={user?.photoURL || "/placeholder.svg"}
                            alt="User avatar"
                            width={100}
                            height={100}
                            className="rounded-full object-cover"
                        />
                    </div>
                    <Separator orientation="vertical" className="h-12 bg-gray-400" />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">{user?.displayName}</span>
                        <span className="text-sm text-muted-foreground">{user?.email}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="bg-red-500 hover:bg-red-600">
                    Delete Account
                </Button>
            </CardFooter>
        </ProtectedRoute>
    )
}
