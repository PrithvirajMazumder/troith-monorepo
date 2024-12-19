import { Loader } from 'lucide-react'

export default function CreateItemsLoader() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Loader className="animate-spin w-4 h-4" />
      <p className="text-sm mt-2">Loading...</p>
    </div>
  )
}
