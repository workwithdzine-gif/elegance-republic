import { ArrowLeft, MailCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ResetPassword() {
  const [sent, setSent] = useState(false)
  return <div className="er-simple-auth">{sent ? <div className="er-simple-auth__card"><MailCheck/><p className="er-kicker">Check your inbox</p><h1>Reset link sent.</h1><p>In this frontend demo, no real email is sent. The flow is ready to connect to an authentication API.</p><Link className="er-btn er-btn--dark" to="/account">Return to sign in</Link></div> : <form className="er-simple-auth__card" onSubmit={(event) => { event.preventDefault(); setSent(true) }}><p className="er-kicker">Account recovery</p><h1>Reset your password</h1><p>Enter your account email and we will send password reset instructions.</p><label className="er-field"><span>Email address</span><input type="email" required autoFocus/></label><button className="er-btn er-btn--dark">Send reset link</button><Link className="er-text-link" to="/account"><ArrowLeft/> Back to sign in</Link></form>}</div>
}

