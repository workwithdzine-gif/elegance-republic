import { ChevronDown, Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  ['How long does delivery take?', 'Most orders arrive in 3–5 working days after dispatch. Remote areas may take a little longer.'],
  ['Can I exchange a size?', 'Yes. Unworn items with original tags can be requested for exchange within 14 days.'],
  ['How do I find my size?', 'Use the size guide on each product page and compare garment measurements with a well-fitting piece you own.'],
  ['Do you accept bulk and corporate orders?', 'Yes. Choose Bulk order in the contact form and include the estimated quantity and delivery date.'],
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const submit = (event) => { event.preventDefault(); event.currentTarget.reset(); setSent(true) }
  return <div className="er-contact"><div className="er-contact__grid"><section className="er-contact__intro"><p className="er-kicker">Contact</p><h1>We are here for fit, fabric, and order questions.</h1><p>Reach out for sizing help, delivery support, returns, collaborations, or bulk orders.</p><div className="er-contact-cards"><article><Phone/><div><b>Phone</b><a href="tel:+923000000000">+92 300 0000000</a></div></article><article><Mail/><div><b>Email</b><a href="mailto:support@elegancerepublic.com">support@elegancerepublic.com</a></div></article><article><MapPin/><div><b>Studio</b><span>Lahore, Pakistan</span></div></article></div></section><form className="er-contact__form" onSubmit={submit}><p className="er-kicker">Send a note</p><h2>How can we help?</h2><div className="er-form-grid"><label className="er-field"><span>Full name</span><input name="name" required/></label><label className="er-field"><span>Email</span><input type="email" name="email" required/></label><label className="er-field er-field--wide"><span>Topic</span><select name="topic"><option>Sizing</option><option>Delivery</option><option>Returns</option><option>Bulk order</option><option>Collaboration</option></select></label><label className="er-field er-field--wide"><span>Message</span><textarea name="message" rows="6" required/></label></div><button className="er-btn er-btn--dark">Send message</button>{sent && <p className="er-form-success" role="status">Thanks — your demo message has been recorded.</p>}</form></div><section className="er-faq"><div className="er-section-title"><p>Help center</p><h2>Frequently asked questions</h2></div><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown/></summary><p>{answer}</p></details>)}</div></section></div>
}

