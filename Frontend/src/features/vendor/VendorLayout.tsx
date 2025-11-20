import { SidebarProvider } from '@/components/ui/sidebar'
import { Outlet } from 'react-router-dom'
import AppSidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const VendorLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="md:p-4 w-full min-h-screen bg-sidebar">
        <Card className="w-full rounded-none md:rounded-xl h-full md:px-6 px-2 py-0 md:py-6 border-none bg-background">
          <CardHeader className="gap-0 md:pt-0 pt-2">
            <Navbar />
          </CardHeader>
          <Separator />
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </SidebarProvider>
  )
}

export default VendorLayout
