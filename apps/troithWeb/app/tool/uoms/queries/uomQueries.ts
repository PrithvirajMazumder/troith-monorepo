export const fetchUoms = async (companyId: string) => {
  const response = await fetch(`/api/uoms/company/${companyId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch UOMs')
  }
  return response.json()
}

export const UomQueries = {
  all: (companyId: string) => ({
    queryKey: ['uoms', companyId],
    queryFn: () => fetchUoms(companyId)
  })
}
