import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Gallery', to: '/gallery' },
  { label: 'Journal', to: '/journal' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'Exhibitions', to: '/exhibitions' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: '#',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.140-.828 3.330-.236.995.499 1.806 1.476 1.806 1.771 0 3.132-1.867 3.132-4.562 0-2.387-1.716-4.055-4.165-4.055-2.836 0-4.5 2.126-4.5 4.326 0 .856.33 1.774.74 2.276a.3.3 0 01.069.286c-.076.31-.243.996-.275 1.134-.044.183-.147.222-.34.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: 'Behance',
    href: '#',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M22 7h-7M22 11h-7M17 7v8M2 18V6h7.5a3 3 0 010 6H2m0 0h8a3 3 0 010 6H2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-[rgba(201,168,76,0.1)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 border border-[#c9a84c] rotate-45 flex items-center justify-center">
                <span className="text-[#c9a84c] text-xs font-bold -rotate-45">R</span>
              </div>
              <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl font-semibold text-[#f5f0e8]">
                Reyarts
              </span>
            </div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-[#999999] text-lg italic leading-relaxed mb-6">
              "Art is not what you see, but what you make others see."
            </p>
            <p className="text-[#777777] text-sm">— Reya Saran</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="section-label mb-5">Explore</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[#999999] hover:text-[#c9a84c] transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="section-label mb-5">Connect</h4>
            <div className="flex gap-4 mb-6">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center border border-[rgba(201,168,76,0.2)] text-[#999999] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-300 hover:scale-110"
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-[#777777] text-sm mb-2">Inquiries & Commissions</p>
            <a href="mailto:reya@reyarts.com" className="text-[#c9a84c] text-sm hover:underline">
              reya@reyarts.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(201,168,76,0.08)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#555555] text-xs">
            © {new Date().getFullYear()} Reyarts. All artworks by Reya Saran. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-4 h-[1px] bg-[#c9a84c] opacity-60" />
            <span className="text-[#555555] text-xs px-2">Crafted with passion</span>
            <div className="w-4 h-[1px] bg-[#c9a84c] opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
}
