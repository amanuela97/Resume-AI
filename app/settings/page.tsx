"use client";

import React from 'react'
import { useState } from 'react';
import AccountSettings from "../components/AccountSettings";
import Payment from "../components/Payment";
import { User, CreditCard } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

export default function Settings() {

    const [activeSetting, setActiveSetting] = useState('account')

    const settingsOptions = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'payment', label: 'Payment', icon: CreditCard },
    ]


    return (
        <div className="container mx-auto p-4">
            <Card className="w-full">
                <CardContent className="p-0">
                    <div className="flex">
                        <div className="w-64 border-r">
                            {settingsOptions.map((option) => (
                                <Button
                                    key={option.id}
                                    variant={activeSetting === option.id ? "secondary" : "ghost"}
                                    className="w-full justify-start rounded-none h-12"
                                    onClick={() => setActiveSetting(option.id)}
                                >
                                    <option.icon className="mr-2 h-5 w-5" />
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                        <div className="flex-1 p-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center">
                                {settingsOptions.find(option => option.id === activeSetting)?.icon && (
                                    React.createElement(
                                        settingsOptions.find(option => option.id === activeSetting)!.icon,
                                        { className: "mr-2 h-6 w-6" }
                                    )
                                )}
                                {settingsOptions.find(option => option.id === activeSetting)?.label} Settings
                            </h2>
                            <Separator className="my-4" />
                            {activeSetting === 'account' && <AccountSettings />}
                            {activeSetting === 'payment' && <Payment />}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
