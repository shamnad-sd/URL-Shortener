export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#123c31]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center text-sm text-gray-200">
          <p>&copy; {currentYear} LinkVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
