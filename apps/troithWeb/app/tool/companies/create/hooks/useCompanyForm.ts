import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next-nprogress-bar'
import { useToast } from '@troith/shared/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { companiesKeys } from '@troithWeb/app/tool/queryKeys/companies'
import { CompanyFormFields } from '@troithWeb/app/tool/companies/create/validations'
import { Company } from '@prisma/client'

const createCompany = async (data: CompanyFormFields & { userId: string }): Promise<Company> => {
  const { userId, ...companyData } = data
  const res = await fetch('/api/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...companyData, user: { connect: { id: userId } } })
  })
  if (!res.ok) throw new Error('Failed to create company')
  return res.json()
}

const updateCompany = async (id: string, data: CompanyFormFields): Promise<Company> => {
  const res = await fetch(`/api/company/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to update company')
  return res.json()
}

export const useCompanyForm = (companyId?: string) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEditing = !!companyId

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CompanyFormFields) => {
      if (isEditing) {
        return updateCompany(companyId, data)
      }
      return createCompany({ ...data, userId: session?.user?.id ?? '' })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companiesKeys.all })
      toast({
        title: isEditing ? 'Company updated' : 'Company created',
        description: isEditing ? 'Your company has been updated successfully.' : 'Your company has been created successfully.'
      })
      router.push('/tool/companies')
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: isEditing ? 'Unable to update the company right now.' : 'Unable to create the company right now.'
      })
    }
  })

  return { submitCompany: mutate, isPending }
}
