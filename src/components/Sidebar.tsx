'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  Map, 
  Grid, 
  Star, 
  Bookmark, 
  PlusCircle, 
  Info,
  ImageIcon,
  Building2,
  Music,
  Clock,
  Palette,
  Theater,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const categories = [
    { 
      id: 'mural', 
      label: 'Murals',
      icon: <ImageIcon className="w-5 h-5 text-blue-500" />
    },
    { 
      id: 'museum', 
      label: 'Museums',
      icon: <Building2 className="w-5 h-5 text-purple-500" />
    },
    { 
      id: 'music_venue', 
      label: 'Music Venues',
      icon: <Music className="w-5 h-5 text-pink-500" />
    },
    { 
      id: 'historic_place', 
      label: 'Historic Places',
      icon: <Clock className="w-5 h-5 text-amber-500" />
    },
    { 
      id: 'gallery', 
      label: 'Galleries',
      icon: <Palette className="w-5 h-5 text-emerald-500" />
    },
    { 
      id: 'theater', 
      label: 'Theaters',
      icon: <Theater className="w-5 h-5 text-red-500" />
    },
  ];

  const navItems = [
    { href: '/', label: 'Home / Map View', icon: <Map className="w-5 h-5 text-indigo-500" /> },
    { href: '/categories', label: 'Explore Categories', icon: <Grid className="w-5 h-5 text-violet-500" />, hasSubmenu: true },
    { href: '/contributions', label: 'My Contributions', icon: <Star className="w-5 h-5 text-yellow-500" /> },
    { href: '/saved', label: 'Saved Places', icon: <Bookmark className="w-5 h-5 text-rose-500" /> },
    { href: '/submit', label: 'Submit a Location', icon: <PlusCircle className="w-5 h-5 text-green-500" /> },
    { href: '/about', label: 'About / Project Info', icon: <Info className="w-5 h-5 text-cyan-500" /> },
  ];

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', categoryId);
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-800">CultureMap KC</h1>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded-lg hover:bg-gray-100"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100
                          ${pathname === item.href ? 'bg-gray-100' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          {!isCollapsed && <span>{item.label}</span>}
                        </div>
                        {!isCollapsed && (
                          <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                      
                      {/* Categories submenu */}
                      {isCategoriesOpen && !isCollapsed && (
                        <ul className="mt-2 ml-8 space-y-2">
                          {categories.map((category) => (
                            <li key={category.id}>
                              <button
                                onClick={() => handleCategoryClick(category.id)}
                                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                              >
                                {category.icon}
                                <span>{category.label}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100
                        ${pathname === item.href ? 'bg-gray-100' : ''}`}
                    >
                      {item.icon}
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
} 