import * as React from 'react'
import { Link } from 'gatsby'
// @ts-ignore
import * as styles from './navigation.module.css'

type NavigationProps = {
    title: string
}


const Navigation: React.FunctionComponent<NavigationProps> = (props: NavigationProps) =>  {

    return (
        <div className={styles.nav}>
            <div className={styles.navHeader}>
                <div className={styles.navTitle}>{props.title}</div>
            </div>
            <div className={styles.navLinks}>
                <Link to="/photos">Photos</Link>
                <Link to="/about">About</Link>
                <Link to="/usage">Usage</Link>
            </div>
        </div>
    );
}

export default Navigation