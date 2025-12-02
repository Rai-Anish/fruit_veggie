import { Link } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import Container from './ui/container'
import { CircleUserRound, ShoppingCart } from 'lucide-react'
import { SearchBar } from './homepage/search-bar'

type TopbarProps = {
  user: {
    _id: string
    fullName: string
    email: string
    role: 'customer' | 'vendor' | 'admin'
    lastLogin: string
  } | null
  onLogout: () => void
}

const Topbar = ({ user, onLogout }: TopbarProps) => {
  return (
    <div className="w-full py-4 bg-green-600">
      <Container>
        <div className="flex items-center justify-between text-white gap-4">
          {/* Logo */}
          <span className="text-base md:text-xl 2xl:text-3xl font-semibold">
            fruit&veggie
          </span>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Search..."
              onSearch={(q) => console.log('Searching:', q)}
              className="bg-white rounded-lg"
            />
          </div>

          {/* Right Menu Items */}
          <div className="flex items-center justify-center gap-3">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-medium text-base flex items-center data-[state=open]:text-white hover:cursor-pointer ">
                    <Link
                      to={{ pathname: '/login' }}
                      className="flex gap-x-1.5"
                    >
                      <CircleUserRound className="h-6 w-6 " />{' '}
                      {user ? user.fullName : 'Sign In'}
                    </Link>
                  </NavigationMenuTrigger>
                  {user?.fullName && (
                    <NavigationMenuContent>
                      <NavigationMenuLink>
                        <Link to="/account">Account Information</Link>
                      </NavigationMenuLink>

                      <NavigationMenuLink>
                        <Link to="/address">Address Book</Link>
                      </NavigationMenuLink>

                      <NavigationMenuLink>
                        <Link to="/orders">Orders</Link>
                      </NavigationMenuLink>

                      {/* LOGOUT */}
                      <NavigationMenuLink asChild>
                        <button
                          onClick={onLogout}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 hover:text-black"
                        >
                          Logout
                        </button>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  )}
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Cart */}
            <div className="flex items-center gap-x-2">
              <div className="relative">
                <span className="absolute px-1 py-0.5 leading-none text-sm rounded-full bg-white text-black -right-2.5 -top-2.5">
                  0
                </span>
                <ShoppingCart className="w-8 h-8" />
              </div>
              <span>Cart</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Topbar
