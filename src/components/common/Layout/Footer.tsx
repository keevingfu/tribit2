import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-600">
            © {currentYear} Tribit Content Marketing Platform. All rights reserved.
          </div>
          
          {/* Links */}
          <div className="flex space-x-6 text-sm">
            <a
              href="#privacy"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              隐私政策
            </a>
            <a
              href="#terms"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              服务条款
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              联系我们
            </a>
            <a
              href="#help"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <span>帮助中心</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;