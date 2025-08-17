import { GetServerSideProps } from "next";
import Link from "next/link";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { getFollowedAuthors, toggleFollowAuthor } from "@/utils/follow";

type Props = {
  author: {
    name: string;
    bio?: string;
    avatarUrl?: string;
    slug: string;
    counts: { posts: number; followers?: number };
  };
  posts: Array<{ slug: string; title: string; publishedAt?: string; tags?: string[] }>;
};

export default function AuthorProfile({ author, posts }: Props) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <header className="flex items-start gap-4 mb-6">
        {author.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.avatarUrl}
            alt=""
            className="h-16 w-16 rounded-full ring-1 ring-black/5 object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full ring-1 ring-black/5 bg-neutral-100" />
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight">{author.name}</h1>
          {author.bio ? (
            <p className="text-sm text-neutral-700 mt-1">{author.bio}</p>
          ) : (
            <p className="text-sm text-neutral-600 mt-1">Reporter at WaterNewsGY.</p>
          )}
          <div className="mt-2 text-xs text-neutral-600">
            {author.counts.posts} {author.counts.posts === 1 ? "story" : "stories"}
            {typeof author.counts.followers === "number"
              ? ` • ${author.counts.followers} followers`
              : ""}
          </div>
          {/* Local follow toggle (visitors use localStorage; no auth required) */}
          <FollowButton name={author.name} slug={author.slug} />
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-2xl ring-1 ring-black/5 bg-white p-6">
          <h2 className="text-lg font-semibold">No stories yet</h2>
          <p className="text-sm text-neutral-600 mt-1">
            When {author.name} publishes, stories will appear here.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
            >
              Browse latest stories
            </Link>
          </div>
        </div>
      ) : (
        <section className="space-y-2">
          {posts.map((p) => (
            <article key={p.slug} className="p-3 rounded-xl ring-1 ring-black/5 bg-white hover:bg-neutral-50">
              <Link
                href={`/news/${p.slug}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded"
              >
                <div className="text-sm font-medium line-clamp-1">{p.title}</div>
                <div className="mt-1 text-[11px] text-neutral-500">
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ""}
                </div>
                {Array.isArray(p.tags) && p.tags.length ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700"
                      >
                        #{String(t).replace(/^#/, "")}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function FollowButton({ name, slug }: { name: string; slug?: string }) {
  const isBrowser = typeof window !== "undefined";
  const id = (slug || name || "").toLowerCase().trim() || "unknown";
  const followed = isBrowser ? getFollowedAuthors().has(id) : false;

  function toggle() {
    const nowFollowing = toggleFollowAuthor(id);
    if (isBrowser) {
      // quick feedback; page doesn’t re-render automatically
      alert(nowFollowing ? "Followed" : "Unfollowed");
    }
  }
  return (
    <button
      type="button"
      onClick={toggle}
      className="mt-2 inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium bg-white ring-1 ring-black/10 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
      aria-pressed={followed}
    >
      {followed ? "Following" : "Follow"}
    </button>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await dbConnect();
  const slug = String(params?.slug || "").toLowerCase();

  // Try to find a User with a compatible slug/username field
  let user = await User.findOne({
    $or: [{ slug }, { username: slug }],
  })
    .select("name bio avatarUrl slug followersCount")
    .lean()
    .catch(() => null as any);

  // Find posts that match by authorId if user exists
  let posts: any[] = [];
  if (user?._id) {
    posts = await Post.find({ authorId: user._id })
      .sort({ publishedAt: -1 })
      .limit(50)
      .select("slug title publishedAt tags")
      .lean();
  }

  const derivedName: string = user?.name ||
    slug.split("-").map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

  const author = {
    name: derivedName,
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
    slug: user?.slug || slug,
    counts: { posts: posts.length, followers: user?.followersCount },
  };

  return {
    props: {
      author: JSON.parse(JSON.stringify(author)),
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};

