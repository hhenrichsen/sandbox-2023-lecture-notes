import { useState } from "react";
import { trpc } from "../util/trpc";

function Posts(): JSX.Element {
  const mutation = trpc.addPost.useMutation();
  const query = trpc.postList.useQuery();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = (): void => {
    mutation.mutate({
      title,
      content,
    });
  };

  const posts = query.data ?? [];

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>Likes: {post.likes}</p>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
      <form onSubmit={handlePost}>
        <input
          id="post-title"
          onChange={(v) => {
            setTitle(v.target.value);
          }}
          placeholder="Title"
          value={title}
        />
        <input
          id="post-content"
          onChange={(v) => {
            setContent(v.target.value);
          }}
          placeholder="Content"
          value={content}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Posts;
