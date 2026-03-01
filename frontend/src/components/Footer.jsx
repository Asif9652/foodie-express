import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github, UtensilsCrossed, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 mt-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Selection */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-primary-600 p-2 rounded-xl">
                                <UtensilsCrossed className="text-white w-5 h-5" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight">FoodieExpress</span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-xs">
                            Savor the flavor, fast and easy. Your favorite meals delivered right to your doorstep, with care and style.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg">Quick Links</h3>
                        <div className="flex flex-col gap-3 text-gray-400">
                            <Link to="/" className="hover:text-primary-500 transition-colors text-sm">Home</Link>
                            <Link to="/restaurants" className="hover:text-primary-500 transition-colors text-sm">Restaurants</Link>
                            <Link to="/offers" className="hover:text-primary-500 transition-colors text-sm">Best Offers</Link>
                            <Link to="/support" className="hover:text-primary-500 transition-colors text-sm">Customer Support</Link>
                        </div>
                    </div>

                    {/* Legal */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg">Legal</h3>
                        <div className="flex flex-col gap-3 text-gray-400">
                            <Link to="/terms" className="hover:text-primary-500 transition-colors text-sm">Terms & Conditions</Link>
                            <Link to="/privacy" className="hover:text-primary-500 transition-colors text-sm">Privacy Policy</Link>
                            <Link to="/cookies" className="hover:text-primary-500 transition-colors text-sm">Cookie Settings</Link>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg">Newsletter</h3>
                        <p className="text-gray-400 text-sm">
                            Subscribe to get latest updates and offers.
                        </p>
                        <div className="flex gap-2 p-1.5 bg-gray-800 rounded-xl relative">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="bg-transparent text-sm w-full outline-none px-3"
                            />
                            <button className="bg-primary-600 p-2 rounded-lg hover:bg-primary-700 transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} FoodieExpress. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
