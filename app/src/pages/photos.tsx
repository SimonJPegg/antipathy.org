import * as React from "react"
// @ts-ignore
import * as styles from './index.module.css'
import Layout from "../component/layout";
import {graphql, Link} from "gatsby";
import {GatsbyImage, getImage, ImageDataLike} from "gatsby-plugin-image";

interface PhotosProps {
    data: {
        allMdx: {
            nodes: {
                frontmatter: {
                    title: string
                    slug: string
                    photo: {
                        childImageSharp: {
                            gatsbyImageData: ImageDataLike
                        }
                    }
                }
            }[]
        }
    }
}

export const query = graphql`
    query {
        allMdx {
            nodes {
                frontmatter {
                    title
                    slug
                    photo {
                        childImageSharp {
                            gatsbyImageData(
                                width: 200
                                height: 200
                                placeholder: BLURRED
                                formats: [AUTO, AVIF]
                            )
                        }
                    }
                }
            }
        }
    }
`

const PhotosComponent: React.FunctionComponent<PhotosProps> = (props) => {
    return (
        <Layout pageTitle="About">
            <div style={{margin: "auto", width: "50%"}}>
                {props.data.allMdx.nodes.map(node => {
                    // @ts-ignore
                    const photo = getImage(node.frontmatter.photo)
                    return <Link key={node.frontmatter.slug} to={`/${node.frontmatter.slug}`}><GatsbyImage key={node.frontmatter.slug} alt={node.frontmatter.title} image={photo!}/></Link>
                })}
            </div>
        </Layout>
    )
}

export default PhotosComponent
