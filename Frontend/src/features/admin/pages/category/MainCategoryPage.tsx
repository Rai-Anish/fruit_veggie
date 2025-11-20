import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { columns } from '@/features/admin/components/category/columns'
import { DataTable } from '../../components/category/data-table'
import MainCategoryForm from '../../components/category/MainCategoryForm'

const MainCategoryPage = () => {
  return (
    <div className="flex gap-x-5">
      <Card className="flex-1/3">
        <CardHeader>Add New Category</CardHeader>
        <CardContent>
          <MainCategoryForm />
        </CardContent>
      </Card>
      <div className="flex-2/3">
        <DataTable columns={columns} />
      </div>
    </div>
  )
}

export default MainCategoryPage
