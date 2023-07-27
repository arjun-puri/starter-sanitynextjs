import { PortableText } from '@portabletext/react'
import { useRouter } from 'next/router'
import { useEffect,useState } from 'react'

import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getPost,
} from '~/lib/sanity.queries'
import { formatDate } from '~/utils'

export default function CsrPost({ draftMode = false, params = {} }) {
  const router = useRouter()
  const { slug } = router.query
  const [ post, setPost ] = useState({})
  const [ loading, setLoading ] = useState(false)

  async function handlePostFetch(client, slug) {
    const post = await getPost(client, slug)
    setPost(post)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    const client = getClient(draftMode ? { token: readToken } : undefined)
    slug && handlePostFetch(client, slug)
  }, [draftMode, slug])

  return (
    <Container>
      { !loading ? (
          <section className="post">
          <div className="post__container">
            <h1 className="post__title">{post.title}</h1>
            <p className="post__excerpt">{post.excerpt}</p>
            <p className="post__date">{formatDate(post._createdAt)}</p>
            <div className="post__content">
              <PortableText value={post.body} />
            </div>
          </div>
        </section>
        ) : 
        (<section>Loading...</section>)
      } 
    </Container>
  )
}