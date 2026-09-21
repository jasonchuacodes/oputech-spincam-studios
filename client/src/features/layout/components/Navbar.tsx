import { Menu } from 'lucide-react'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="bg-white flex h-16 items-center justify-between border-b border-gray-200 px-6 lg:hidden">
      <button
        onClick={onMenuClick}
        className="hover:bg-muted flex gap-2 rounded p-1"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>
      <span className="text-md font-semibold">Spincam</span>
    </header>
  )
}
