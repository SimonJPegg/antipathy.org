import * as React from "react"
import type { HeadFC } from "gatsby"
// @ts-ignore
import * as styles from './index.module.css'
import {Link} from "gatsby";


const IndexPage = () => {

  return (
    <main className={styles.titleimage}>
      <div >
        <div className={styles.caption}>
          <span className={styles.border} >Antipathy.org
            <br/>Photograhy
            <br/><Link to="/photos">ENTER SITE</Link>
          </span>
        </div>
      </div>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Antipathy.org - Photography</title>
