import { BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function VerifyEmail() {
  return <div className="er-simple-auth"><div className="er-simple-auth__card"><BadgeCheck/><p className="er-kicker">Email verified</p><h1>You are all set.</h1><p>Your email address has been verified for this frontend demonstration.</p><Link className="er-btn er-btn--dark" to="/account">Continue to account</Link></div></div>
}

