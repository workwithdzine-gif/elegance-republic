import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return <div className="er-not-found"><p>404</p><h1>This page has<br/>left the collection.</h1><span>The link may have moved, expired, or never existed.</span><Link className="er-btn er-btn--dark" to="/"><ArrowLeft/> Return home</Link></div>
}

