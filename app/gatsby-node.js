const path = require("path")
const postTemplate = path.resolve(`./src/pages/templates/photo.tsx`)

exports.createPages = async ({ graphql, actions, reporter }) => {
    const { createPage } = actions

    const result = await graphql(`
    query {
      allMdx {
        nodes {
          id
          frontmatter {
            slug
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `)

    if (result.errors) {
        reporter.panicOnBuild('Error loading MDX result', result.errors)
    }

    const photos = result.data.allMdx.nodes
    photos.forEach(node => {
        createPage({
            path: node.frontmatter.slug,
            component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
            context: { id: node.id },
        })
    })
}