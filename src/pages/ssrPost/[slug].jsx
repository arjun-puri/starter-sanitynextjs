import { PortableText } from '@portabletext/react'

import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getPost,
} from '~/lib/sanity.queries'
import { formatDate } from '~/utils'

export const getServerSideProps = process.env.SKIP_SSR ? undefined : async function ({ draftMode = false, params = {} }) {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const post = await getPost(client, params.slug)

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      post,
    },
  }
}

export default function ProjectSlugRoute(props) {
  const post = props.post

  return (
    <Container>
      <section className="post">
        <div className="post__container">
          <h1 className="post__title">{post?.title}</h1>
          <p className="post__excerpt">{post?.excerpt}</p>
          <p className="post__date">{formatDate(post?._createdAt)}</p>
          <div className="post__content">
            <PortableText value={post?.body} />
          </div>
        </div>
      </section>
    </Container>
  )
}
