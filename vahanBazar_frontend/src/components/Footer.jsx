import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="footer-section">
            <div className="text-2xl font-bold font-sora">Vahan<span className="text-primary">Bazar</span></div>
            <p className="text-text-muted mt-4">The future of two-wheeler mobility.</p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary">FB</a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary">IN</a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary">TW</a>
            </div>
          </div>
          <div className="footer-section">
            <h4 className="font-semibold text-lg mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/vehicles?type=bike" className="text-text-muted hover:text-primary">Bikes</Link></li>
              <li><Link to="/vehicles?type=scooter" className="text-text-muted hover:text-primary">Scooters</Link></li>
              <li><Link to="/vehicles?type=ev" className="text-text-muted hover:text-primary">Electric Vehicles</Link></li>
              <li><Link to="/compare" className="text-text-muted hover:text-primary">Compare</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-text-muted hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="text-text-muted hover:text-primary">Contact</Link></li>
              <li><Link to="/careers" className="text-text-muted hover:text-primary">Careers</Link></li>
              <li><Link to="/press" className="text-text-muted hover:text-primary">Press</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-text-muted hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-text-muted hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-text-muted">
          <p>&copy; {new Date().getFullYear()} VahanBazar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;