import * as React from "react"
// @ts-ignore
import * as styles from './index.module.css'
import Layout from "../component/layout";

interface AboutProps {

}

const AboutComponent: React.FunctionComponent<AboutProps> = () => {

    return (
        <Layout pageTitle="About">
            <div style={{margin: "auto", width: "50%"}}>
                <h2>About me</h2>
                <p>I can't imagine why you'd want to know this, but I’m a 40 (something) year old geek from Belfast.
                    I take terrible pictures and write terrible code.</p>
                <p>You can usually find me on:</p>
                <ul>
                    <li><a href="https://twitter.com/#!/_fluffybacon_">Twiter</a></li>
                    <li><a href="https://github.com/SimonJPegg">Github</a></li>
                </ul>
                <p>Or, if you really want to email me:  <a href="mailto:&#099;&#105;&#097;&#114;&#097;&#110;&#064;&#097;&#110;&#116;&#105;&#112;&#097;&#116;&#104;&#121;&#046;&#111;&#114;&#103;">
                        &#099;&#105;&#097;&#114;&#097;&#110;&#064;&#097;&#110;&#116;&#105;&#112;&#097;&#116;&#104;&#121;&#046;&#111;&#114;&#103;
                    </a>
                </p>
            </div>
        </Layout>
    )
}

export default AboutComponent
