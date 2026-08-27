import kontoretImage from '../assets/kontoret.jpg'

export default function DefaultScreen() {
  return (
    <section className="default-screen" style={{ backgroundImage: `url(${kontoretImage})` }}>
      <div className="default-screen-panel">
        <h1 className="default-screen-title">Velkommen til WEBKOM-KONTORET</h1>
        <p className="default-screen-text">Her bygger vi Abakus.no!</p>
      </div>
    </section>
  )
}
