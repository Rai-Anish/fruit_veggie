import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { columns } from '@/features/admin/components/subcategory/columns'
import { DataTable } from '../../components/subcategory/data-table'
import SubCategoryForm from '../../components/subcategory/SubCategoryForm'

const SubCategoryPage = () => {
  return (
    <div className="flex gap-x-5">
      <Card className="flex-1/3">
        <CardHeader>Add New Sub Category</CardHeader>
        <CardContent>
          <SubCategoryForm />
        </CardContent>
      </Card>
      <div className="flex-2/3">
        <DataTable columns={columns} />
      </div>
    </div>
  )
}

export default SubCategoryPage
