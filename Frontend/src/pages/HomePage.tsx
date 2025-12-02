import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import Topbar from '@/components/topbar'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { selectUser } from '@/features/auth/store/selectors'

import { useAppSelector } from '@/store/hooks'

type Props = {}

const HomePage = (props: Props) => {
  const user = useAppSelector(selectUser)
  const { mutate: logout } = useLogout()

  return (
    <div>
      <Topbar user={user} onLogout={logout} />
      <Navbar />
      <Footer />
    </div>
  )
}

export default HomePage
