import LogoutButton from '@/components/LogoutButton'
import { useTheme } from '@/components/ThemeProvider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SearchInput } from '@/components/ui/input'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { selectUser } from '@/features/auth/store/selectors'
import { useAppSelector } from '@/store/hooks'
import { Moon, Sun, User } from 'lucide-react'

function Navbar() {
  const { setTheme } = useTheme()
  const user = useAppSelector(selectUser)
  return (
    <Menubar className="bg-none shadow-none  md:px-10 flex justify-between items-center border-none">
      <div className="flex  items-center justify-centers">
        <SidebarTrigger className="md:invisible visible md:order-2 " />
        <SearchInput
          type="text"
          placeholder="search"
          className="max-w-64 invisible md:visible "
        />
      </div>
      <MenubarMenu>
        <MenubarTrigger>
          <Avatar>
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </MenubarTrigger>
        <MenubarContent className="mr-16 mt-1">
          <MenubarItem
            disabled
            className="flex flex-col justify-center items-start"
          >
            <span>{user?.fullName}</span>
            <span className="text-sm">{user?.email}</span>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>My Profile</MenubarItem>
          <MenubarItem>Message</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Set Theme</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem className="flex" onClick={() => setTheme('dark')}>
                <Moon /> Dark
              </MenubarItem>
              <MenubarItem onClick={() => setTheme('light')}>
                <Sun /> Light
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>
            <LogoutButton text="Logout" />
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default Navbar
