import { useState } from 'react'
import { Link } from 'react-router-dom'

function Column({ title, links }) {
  return <div className="ft__col"><p className="ft__label">({title})</p><ul>{links.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}</ul></div>
}

export default function Footer() {
  const [message, setMessage] = useState('')
  const subscribe = (event) => {
    event.preventDefault()
    const email = new FormData(event.currentTarget).get('email')
    if (!email) return
    localStorage.setItem('elegance-republic-welcome-offer', email)
    event.currentTarget.reset()
    setMessage("Thanks — you're on the list.")
  }
  return (
    <footer className="ft">
      <div className="ft__top">
        <div className="ft__lead">
          <p className="ft__label">Subscribe to our newsletter</p>
          <form className="ft__form" onSubmit={subscribe}><input className="ft__input" type="email" name="email" placeholder="Your email" required aria-label="Email address"/><button className="ft__submit">Join</button></form>
          <p className="ft__note" role="status">{message}</p>
          <address className="ft__contact"><p>24-C, Main Boulevard, Gulberg III, Lahore</p><a href="tel:+924235771234">+92 42 3577 1234</a></address>
          <ul className="ft__social"><li><a href="https://instagram.com" aria-label="Instagram">IG</a></li><li><a href="https://facebook.com" aria-label="Facebook">FB</a></li><li><a href="https://wa.me/924235771234" aria-label="WhatsApp">WA</a></li></ul>
        </div>
        <Column title="Customer Care" links={[["Account & Orders", "/account"], ["Wishlist", "/wishlist"], ["Contact", "/contact"], ["Cart", "/cart"]]}/>
        <Column title="Navigate" links={[["Men", "/?tab=men"], ["Women", "/?tab=women"], ["Shop", "/shop"], ["New Arrival", "/collection?collection=new-arrivals"]]}/>
        <Column title="Help" links={[["Delivery & Returns", "/contact#delivery"], ["Size Guide", "/contact#size-guide"], ["Privacy", "/contact#privacy"], ["Terms", "/contact#terms"]]}/>
      </div>
      <p className="ft__mark" aria-hidden="true">elegance republic.</p>
      <p className="ft__badge">designed by D,zine</p>
    </footer>
  )
}

