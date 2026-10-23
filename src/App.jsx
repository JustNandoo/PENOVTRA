import Nav from './components/Nav'
import Hero from './components/Hero'
import { Problem, About } from './components/About'
import Explorer from './components/Explorer'
import HowItWorks from './components/HowItWorks'
import Ecosystem from './components/Ecosystem'
import Sdg from './components/Sdg'
import Journey from './components/Journey'
import Team from './components/Team'
import { Closing, Footer } from './components/Closing'

export default function App() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Problem />
        <About />
        <Explorer />
        <HowItWorks />
        <Ecosystem />
        <Sdg />
        <Journey />
        {/*<Team />*/}
        <Closing />
      </main>
      <Footer />
    </>
  )
}
