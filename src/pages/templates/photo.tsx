import * as React from 'react'
import { GatsbyImage, ImageDataLike, getImage } from 'gatsby-plugin-image'
import {graphql} from "gatsby";
// @ts-ignore
import * as styles from './photo.module.css'
import Layout from "../../component/layout";

interface PhotoProps {
    data: {
        mdx: {
            frontmatter: {
                title: string
                photo: {
                    childImageSharp: {
                        gatsbyImageData: ImageDataLike
                    }
                }
            }
            id: string
        }
    }
}

export const query = graphql`
    query ($id: String) {
        mdx(id: {eq: $id}) {
            frontmatter {
                title
                photo {
                    childImageSharp {
                        gatsbyImageData(
                            layout: FULL_WIDTH
                            formats: [AUTO, AVIF]
                        )
                    }
                }
            }
        }
    }
`

const Photo: React.FunctionComponent<PhotoProps> = (props: PhotoProps) => {
    // @ts-ignore
    const photo = getImage(props.data.mdx.frontmatter.photo)

    return (
        <Layout pageTitle={props.data.mdx.frontmatter.title}>
            <div>
                <h2 className={styles.title}>{props.data.mdx.frontmatter.title}</h2>
                <div >
                    <GatsbyImage className={photo?.height! > photo?.width! ? styles.portrait : styles.landscape} alt={props.data.mdx.frontmatter.title} image={photo!}/>
                </div>
            </div>
        </Layout>
    )
}


export default Photo