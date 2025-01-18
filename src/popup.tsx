import { useState } from "react"

import "./styles/global.css"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div className="sct-flex sct-flex-col sct-p-16 sct-bg-red-400">
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <footer>Crafted by @PlasmoHQ</footer>
    </div>
  )
}

export default IndexPopup
