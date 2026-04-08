import React from 'react';
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">ShopSphere</h3>
            <p className="text-gray-400 mb-4">
              Your trusted online shopping destination for quality products at great prices.
            </p>
            <div className="flex gap-4">
              <Facebook size={20} className="hover:text-blue-500 cursor-pointer transition" />
              <Twitter size={20} className="hover:text-blue-400 cursor-pointer transition" />
              <Instagram size={20} className="hover:text-pink-500 cursor-pointer transition" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/shop" className="hover:text-white transition">Shop</a></li>
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Returns</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition">Track Order</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span>info@shopsphere.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-bold mb-3">Policies</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 rounded text-gray-900"
                />
                <button className="btn-primary px-4">Subscribe</button>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm border-t border-gray-700 pt-6">
            <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
            <p className="mt-2">Made with ❤️ for amazing shopping experience</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;