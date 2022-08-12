import * as React from 'react'
import { graphql } from 'gatsby'
import { useStaticQuery } from 'gatsby'
// @ts-ignore
import * as styles from './layout.module.css'
import Footer from "./footer";
import Navigation from "./navigation";

type LayoutProps = {
    pageTitle: string
    children: React.ReactNode
}

const Layout: React.FunctionComponent<LayoutProps> = (props: LayoutProps) =>  {

    const data = useStaticQuery(graphql`
        query {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `)

    return (
        <div className={styles.site}>
            <title> {data.site.siteMetadata.title} : {props.pageTitle} </title>
            <Navigation title={data.site.siteMetadata.title} />
            <div className={styles.siteContent}>{props.children}</div>
            <Footer />
        </div>
    );
}

export default Layout
