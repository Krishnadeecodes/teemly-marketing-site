import { Link } from 'react-router-dom'
import Reveal from '../home/Reveal.jsx'
import '../home/proof.css'

export default function Proof() {
  return (
    <section className="h-proof" aria-labelledby="h-proof-title">
      <div className="h-wrap">
        <h2 id="h-proof-title" className="h-sr-only">
          Customer story
        </h2>
        <Reveal as="div" className="h-proof-card">
          <div>
            <span className="h-illus">Placeholder — pending a verified, approved customer quote</span>
            <blockquote>
              &ldquo;Customer quote goes here: one specific decision Teemly helped them make, and what changed as a
              result.&rdquo;
            </blockquote>
            <cite>Name, Title, Company</cite>
          </div>
          <div className="h-proof-side">
            <strong>—</strong>
            <p>Verified result from the same customer</p>
            <Link to="/customers" className="h-textlink">
              Read customer stories
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
