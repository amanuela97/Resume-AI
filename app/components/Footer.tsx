import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-background py-4 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2V8H20" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="ml-2 text-gray-800 font-semibold">Resume-AI</span>
                </div>
                <nav className="flex space-x-4">
                    <Link href="/faq" className="text-gray-800 hover:underline text-sm">
                        FAQ
                    </Link>
                    <Link href="/terms" className="text-gray-800 hover:underline text-sm">
                        Terms
                    </Link>
                    <Link href="/ai-policy" className="text-gray-800 hover:underline text-sm">
                        AI Policy
                    </Link>
                    <Link href="/privacy" className="text-gray-800 hover:underline text-sm">
                        Privacy
                    </Link>
                </nav>
            </div>
        </footer>
    )
}