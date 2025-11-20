import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

import { AdminNavLinks, type NavLinkItem } from './NavLink'
import { AppIcon } from '@/assets/icons/AppIcon'
import { useMemo, useState } from 'react'
import { AppRoutes } from '@/router/route'

const SidebarApp = () => {
  const location = useLocation()

  const isParentActive = (item: NavLinkItem, currentPath: string): boolean => {
    const adminBasePath = AppRoutes.ADMIN

    if (item.url) {
      const fullItemUrl = `${adminBasePath}/${item.url}`
      if (currentPath === fullItemUrl) {
        return true
      }
    }

    if (item.children) {
      return item.children.some((child) => {
        if (child.url) {
          const fullChildUrl = `${adminBasePath}/${child.url}`

          return currentPath.startsWith(fullChildUrl)
        }
        return false
      })
    }
    return false
  }

  const getNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 w-full py-2 rounded-md transition-colors',
      !isActive && 'hover:bg-accent hover:text-accent-foreground',

      isActive &&
        'bg-sidebar-primary text-sidebar-primary-foreground font-semibold',
      'px-3'
    )
  const initialOpenParentLabel = useMemo(() => {
    for (const item of AdminNavLinks) {
      if (item.children && isParentActive(item, location.pathname)) {
        return item.label
      }
    }
    return null
  }, [location.pathname])

  const [openMenuItem, setOpenMenuItem] = useState<string | null>(
    initialOpenParentLabel
  )

  return (
    <Sidebar className="border-none">
      <SidebarHeader>
        <div className="flex justify-end">
          <SidebarTrigger className="md:invisible visible" />
        </div>
        <img
          src="/logo.png"
          className="md:w-32 md:h-32 w-24 h-24"
          alt="Company Logo"
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {AdminNavLinks.map((item, index) => (
          <SidebarGroup key={item.label}>
            <SidebarMenu>
              {item.children ? (
                <Collapsible
                  className="group/collapsible"
                  open={openMenuItem === item.label}
                  onOpenChange={(isOpen) => {
                    setOpenMenuItem(isOpen ? item.label : null)
                  }}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuItem
                      className={cn(
                        'hover:cursor-pointer flex items-center justify-between py-2 rounded-md transition-colors',
                        !isParentActive(item, location.pathname) &&
                          'hover:bg-accent hover:text-accent-foreground',
                        isParentActive(item, location.pathname) &&
                          'bg-sidebar-primary text-sidebar-primary-foreground font-semibold'
                      )}
                    >
                      <span className="flex gap-3 px-3 items-center">
                        <AppIcon size={20} icon={item.logo} />
                        {item.label}
                      </span>
                      <ChevronRight
                        className="w-fit h-fit transition-transform group-data-[state=open]/collapsible:rotate-90 px-4"
                        size={20}
                      />
                    </SidebarMenuItem>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((subItem) => {
                        const Icon = subItem.logo
                        return (
                          <SidebarMenuSubItem key={subItem.label}>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                aria-disabled={subItem.disabled}
                                to={subItem.url || '#'}
                                className={cn(
                                  location.pathname ===
                                    `${AppRoutes.ADMIN}/${subItem.url}` &&
                                    '!text-red-500'
                                )}
                              >
                                {Icon && <Icon size={20} />} {subItem.label}
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuItem>
                  <NavLink to={item.url || '#'} className={getNavLinkClasses}>
                    <span className="flex items-center gap-3">
                      <AppIcon size={20} icon={item.logo} />
                      {item.label}
                    </span>
                  </NavLink>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
            {index < AdminNavLinks.length - 1 && <SidebarSeparator />}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

export default SidebarApp
