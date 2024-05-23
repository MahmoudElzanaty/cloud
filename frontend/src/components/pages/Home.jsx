import { useEffect, useState } from 'react'
import axios from 'axios'

import SinglePost from '../SinglePost'

import { useNavigate } from 'react-router-dom'


function App() {

  const [posts, setPosts] = useState([])
  let navigate = useNavigate();

  useEffect(() => {
    async function getPosts() {
      const result = await axios.get("/api/posts")
      setPosts(result.data)
    }
    getPosts()
  }, [])

  const deletePostClicked = async ({imageName}) => {
    console.log(`deletePostClicked = (${imageName})`)
    if (!imageName) {
      console.log('The imageName is undefined');
      return;
    }
    await axios.delete("/api/posts/" + imageName)
    setPosts(posts.filter(post => post.imageName !== imageName))
  }

  const postActions = {

    deletePostClicked
  }


  return (
      <div className="App">

        <div className="flex flex-col space-y-100 items-center divide-y">
          {posts.map(post => (
              <div key={`post-${post._id}`} className="px-5 py-14">

                <SinglePost className="relative" post={post} {...postActions}></SinglePost>

              </div>
          ))}
        </div>

      </div>
  )
}

export default App