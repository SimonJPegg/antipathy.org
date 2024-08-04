import * as React from "react"
// @ts-ignore
import * as styles from './index.module.css'
import Layout from "../component/layout";

interface UsageProps {

}

const UsageComponent: React.FunctionComponent<UsageProps> = () => {

    return (
        <Layout pageTitle="About">
            <div style={{margin: "auto", width: "50%"}}>
                <h2>USAGE</h2>
                <br/>
                All the photos on this site are released under a Creative Commons Attribution NonCommercial
                ShareAlike 3.0 License.
                <br/><br/>
                Which means;
                <br/>
                <h2>You are free:</h2>
                <ul>
                    <li>To Share — to copy, distribute and transmit the any of the photographs on this site</li>
                    <li>To Remix — create new stuff, using these photos</li>
                </ul>
                <h2>Under the following conditions:</h2>
                <ul>
                    <li>Attribution — You have to credit me when you do so, or provide a link to this site.</li>
                    <li>Noncommercial — You may not use these photos for commercial purposes.</li>
                    <li>Share Alike — If you alter, transform, or build upon these photos, you may distribute the
                        resulting work only under the same or similar license to this one.
                    </li>
                </ul>
                <h2>With the understanding that:</h2>
                <ul>
                    <li>Waiver — Any of the above conditions can be waived if you get permission from me.</li>
                    <li>Other Rights — In no way are any of the following rights affected by the license:
                        <ul>
                            <li>Your fair dealing or fair use rights, or other applicable copyright exceptions and
                                limitations;
                            </li>
                            <li>The author’s moral rights;</li>
                            <li>Rights other persons may have either in the photos themselves or in how they are
                                used,
                                such as publicity or privacy rights.
                            </li>
                        </ul>
                    </li>
                </ul>
                <h3>Notice</h3>
                For any reuse or distribution, you must make clear to others the license terms of this work.
                The best way to do this is with a link to this web page.
                You can get more info <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode">here</a>.
            </div>
        </Layout>
    )
}

export default UsageComponent