
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { 
  Calendar, 
  Users, 
  Settings, 
  User,
  Clock
} from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { 
        title: "Dashboard", 
        path: "/dashboard", 
        icon: <Calendar className="mr-2 h-5 w-5" /> 
      },
      { 
        title: "My Profile", 
        path: "/profile", 
        icon: <User className="mr-2 h-5 w-5" /> 
      },
    ];
    
    const roleSpecificItems = {
      customer: [
        { 
          title: "Book Appointment", 
          path: "/book", 
          icon: <Calendar className="mr-2 h-5 w-5" /> 
        },
        { 
          title: "My Appointments", 
          path: "/appointments", 
          icon: <Clock className="mr-2 h-5 w-5" /> 
        }
      ],
      provider: [
        { 
          title: "My Schedule", 
          path: "/schedule", 
          icon: <Calendar className="mr-2 h-5 w-5" /> 
        },
        { 
          title: "Availability", 
          path: "/availability", 
          icon: <Clock className="mr-2 h-5 w-5" /> 
        }
      ],
      admin: [
        { 
          title: "All Appointments", 
          path: "/all-appointments", 
          icon: <Calendar className="mr-2 h-5 w-5" /> 
        },
        { 
          title: "Manage Users", 
          path: "/users", 
          icon: <Users className="mr-2 h-5 w-5" /> 
        },
        { 
          title: "System Settings", 
          path: "/system-settings", 
          icon: <Settings className="mr-2 h-5 w-5" /> 
        }
      ]
    };
    
    return [
      ...commonItems, 
      ...(user?.role ? roleSpecificItems[user.role] : [])
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="fixed left-0 z-20 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200 md:translate-x-0">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="mb-6">
          <div className="px-4 py-2">
            <h5 className="text-sm font-medium text-gray-500 uppercase">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </h5>
          </div>
        </div>
        
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-primary hover:bg-opacity-10 hover:text-primary transition-colors",
                  {
                    "bg-primary bg-opacity-10 text-primary font-medium": location.pathname === item.path,
                  }
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
