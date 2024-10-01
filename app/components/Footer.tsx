import Link from 'next/link'
import { FileChartColumn } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-background py-4 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                    <FileChartColumn className="h-6 w-6" />
                    <span className="ml-2 font-semibold">Resume-AI</span>
                </div>
                <nav className="flex flex-wrap justify-center sm:justify-end space-x-4">
                    <Link href="/faq" className="hover:underline text-sm mb-2 sm:mb-0">
                        FAQ
                    </Link>
                    <Link href="/terms" className="hover:underline text-sm mb-2 sm:mb-0">
                        Terms
                    </Link>
                    <Link href="/ai-policy" className="hover:underline text-sm mb-2 sm:mb-0">
                        AI Policy
                    </Link>
                    <Link href="/privacy" className="hover:underline text-sm mb-2 sm:mb-0">
                        Privacy
                    </Link>
                </nav>
            </div>
        </footer>
    )
}