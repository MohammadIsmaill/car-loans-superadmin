export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 px-8 mt-auto">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Term of Use</a>
          <span className="text-gray-500">© 2025 All rights reserved</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <span>🌐</span> English
          </button>
          <button className="hover:text-primary transition-colors">··· SAR</button>
        </div>
      </div>
    </footer>
  );
}
