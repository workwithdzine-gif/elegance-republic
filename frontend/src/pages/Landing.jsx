import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Landing() {
  const [time, setTime] = useState('')
  const [modal, setModal] = useState(false)
  const [note, setNote] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date()))
    tick(); const interval = window.setInterval(tick, 1000)
    const offer = window.setTimeout(() => { if (!localStorage.getItem('elegance-republic-welcome-offer')) setModal(true) }, 1200)
    return () => { window.clearInterval(interval); window.clearTimeout(offer) }
  }, [])
  const signup = (event) => { event.preventDefault(); const email = new FormData(event.currentTarget).get('email'); localStorage.setItem('elegance-republic-welcome-offer', email); setNote('Your 15% welcome offer is ready.'); window.setTimeout(() => setModal(false), 900) }
  return <div className="landing"><main><section className="lp-hero"><video className="lp-hero__media" autoPlay muted loop playsInline preload="auto" aria-label="Elegance Republic new season editorial"><source src="https://res.cloudinary.com/zyup6grh/video/upload/f_auto,q_auto,w_1920/v1784245899/10349046-uhd_4096_2160_25fps_yrfghs.mp4" type="video/mp4"/></video><div className="lp-hero__scrim"/><div className="lp-hero__center"><Link className="lp-wordmark" to="/">elegance republic.</Link><nav className="lp-nav"><Link to="/home?tab=men">Men</Link><Link to="/home?tab=women">Women</Link><Link to="/home?tab=shop">Shop</Link><Link to="/home?tab=new">New Arrival</Link></nav></div><p className="lp-clock lp-label">Karachi: <span className="lp-clock__time">{time}</span></p></section><Footer/></main>{modal && <div className="lp-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><div className="lp-modal__card"><img className="lp-modal__media" src="/images/hero/promo-summer.jpg" alt=""/><div className="lp-modal__body"><p className="lp-label">Welcome Offer</p><h2 className="lp-modal__title" id="welcome-title">Enjoy 15% off your first order.</h2><form className="lp-modal__form" onSubmit={signup}><input className="lp-modal__input" type="email" name="email" placeholder="name@email.com" required/><button className="lp-modal__submit">Signup</button></form><p className="lp-modal__note" role="status">{note}</p></div><button className="lp-modal__close" onClick={() => setModal(false)} aria-label="Close"><X/></button></div></div>}</div>
}