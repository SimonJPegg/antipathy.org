import * as React from 'react'
import { Link } from 'gatsby'
// @ts-ignore
import * as styles from './footer.module.css'

type FooterProps = {}

const Footer: React.FunctionComponent<FooterProps> = (_: FooterProps) =>  {
    return (
        <footer className={styles.footer}>
            <span className={styles.textMuted}>
                This site is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike
                3.0 Unported License.
                Permissions beyond the scope of this license may be available
                <Link to="/usage">here</Link>
            </span>
        </footer>
    )
}

export default Footer