import { Check } from 'lucide-react'
import { useStore } from '../store/StoreContext'

export default function Toast() {
  const { toast } = useStore()
  return toast ? <div className="er-toast" role="status"><Check size={17}/><span>{toast}</span></div> : null
}

