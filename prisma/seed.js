

/* prisma/seed.js */
// Run with: node prisma/seed.js
// (or: npx prisma db seed, depending on your package.json)

const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Reset (safe for dev)
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = bcrypt.hashSync("password123", 10);

  // 3 users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const author = await prisma.user.create({
    data: {
      name: "Author User",
      email: "author@example.com",
      passwordHash,
      role: Role.AUTHOR,
    },
  });

  const reader = await prisma.user.create({
    data: {
      name: "Reader User",
      email: "reader@example.com",
      passwordHash,
      role: Role.USER,
    },
  });

  // 20 DSA posts (mostly published)
  const postsData = [
    {
      title: "Big-O in real life: what it actually helps you decide",
      published: true,
      authorId: author.id,
      content:
        "Big-O isn’t about exact seconds — it’s about how your code scales as input grows.\n\n" +
        "• O(1): direct lookup (like reading arr[i])\n" +
        "• O(log n): cutting the search space (binary search)\n" +
        "• O(n): one pass\n" +
        "• O(n log n): efficient sorting\n" +
        "• O(n²): nested loops that grow fast\n\n" +
        "My rule of thumb: if n can be 100k+, avoid O(n²). If it’s small (like <= 1000), readability can win.\n\n" +
        "Mini check: if you see 2 loops, ask: are they independent (O(n+m)) or nested (O(n²))?",
    },
    {
      title: "Arrays vs Linked Lists: when the tradeoff matters",
      published: true,
      authorId: author.id,
      content:
        "Arrays give you fast random access because memory is contiguous. Linked lists trade that away to make inserts/removes in the middle cheaper *if you already have the node*.\n\n" +
        "Use arrays when you need: indexing, cache friendliness, scanning a lot.\n" +
        "Use linked lists when you need: frequent inserts/removes at known positions, and you don’t care about random access.\n\n" +
        "In interview problems, arrays win way more often than linked lists. Linked lists show up mostly to test pointer handling (reverse list, detect cycle, merge lists).",
    },
    {
      title: "Two Pointers: the ‘walk from both ends’ superpower",
      published: true,
      authorId: author.id,
      content:
        "Two pointers is a pattern where you keep two indices and move them intelligently.\n\n" +
        "Common uses:\n" +
        "1) Sorted arrays: find pair sum, remove duplicates, merge\n" +
        "2) Strings: palindrome checks\n" +
        "3) Partitioning: move smaller items left, bigger right\n\n" +
        "Key idea: each pointer moves at most n times → usually O(n).\n\n" +
        "Quick mental model: ‘one pass, but with two hands’.",
    },
    {
      title: "Sliding Window: fastest way to scan subarrays",
      published: true,
      authorId: author.id,
      content:
        "Sliding window is for problems about a *contiguous* range: longest/shortest, max sum, at most k, etc.\n\n" +
        "Template idea:\n" +
        "- Expand right pointer to include new element\n" +
        "- While invalid, shrink from left\n" +
        "- Update answer\n\n" +
        "It’s basically ‘two pointers + a rule for validity’.\n\n" +
        "Examples: longest substring without repeating chars, minimum window substring, max sum of size k.",
    },
    {
      title: "Hash Maps: turning searches into O(1) lookups",
      published: true,
      authorId: author.id,
      content:
        "A hash map lets you store key → value so you can check existence quickly.\n\n" +
        "Typical uses in DSA:\n" +
        "- frequency counting (anagrams, majority element)\n" +
        "- seen-set (two sum, duplicates, cycle detection in graphs)\n" +
        "- mapping indices (prefix sums)\n\n" +
        "Caution: ‘O(1)’ is average-case; it’s still the right choice most of the time.",
    },
    {
      title: "Stacks: why they show up everywhere",
      published: true,
      authorId: admin.id,
      content:
        "Stacks are LIFO. In problems, they usually represent ‘the most recent unresolved thing’.\n\n" +
        "Classic stack problems:\n" +
        "- Valid parentheses\n" +
        "- Next greater element\n" +
        "- Evaluate reverse polish notation\n" +
        "- Monotonic stack for histogram / trapping rain water\n\n" +
        "If you’re scanning left→right and you need to ‘go back’ to the last useful item: stack.",
    },
    {
      title: "Queues + Deques: the underrated tool",
      published: true,
      authorId: admin.id,
      content:
        "Queues (FIFO) are perfect for level-order traversal (BFS). A deque (double-ended queue) helps when you need push/pop on both ends.\n\n" +
        "Where deques shine:\n" +
        "- Sliding window maximum (monotonic deque)\n" +
        "- 0-1 BFS\n\n" +
        "If a problem says ‘process in the order received’: queue. If it says ‘keep only useful candidates as you slide’: deque.",
    },
    {
      title: "Binary Search: it’s not just for ‘find x’",
      published: true,
      authorId: author.id,
      content:
        "Binary search works whenever your answer space is ordered (monotonic).\n\n" +
        "Two big categories:\n" +
        "1) Search in sorted data (classic)\n" +
        "2) Search on answer (min capacity, max speed, smallest feasible value)\n\n" +
        "Rule: if ‘can we do it with X?’ flips from false→true at some point, binary search the X.",
    },
    {
      title: "Recursion: how to not get lost",
      published: true,
      authorId: author.id,
      content:
        "Recursion is just ‘solve smaller version of the same problem’.\n\n" +
        "To stay sane:\n" +
        "1) Define the subproblem clearly (what does f(n) mean?)\n" +
        "2) Base case (when do we stop?)\n" +
        "3) Progress (are we moving toward base?)\n\n" +
        "Then trust it. Most recursion bugs are missing base cases or not shrinking input.",
    },
    {
      title: "Memoization vs Tabulation: DP without the pain",
      published: true,
      authorId: author.id,
      content:
        "Dynamic Programming is for overlapping subproblems + optimal substructure.\n\n" +
        "Memoization (top-down): recursion + cache.\n" +
        "Tabulation (bottom-up): build answers iteratively.\n\n" +
        "Quick tell: if your recursion repeats the same call a lot, cache it.\n\n" +
        "Examples: Fibonacci, min cost climbing stairs, coin change.",
    },
    {
      title: "Prefix Sums: the secret to fast range queries",
      published: true,
      authorId: admin.id,
      content:
        "Prefix sum lets you compute sum of any subarray in O(1) after O(n) precompute.\n\n" +
        "If prefix[i] = sum(arr[0..i-1]), then sum(l..r) = prefix[r+1] - prefix[l].\n\n" +
        "Use cases:\n" +
        "- range sum queries\n" +
        "- subarray sum equals k (with hash map)\n" +
        "- 2D prefix sums for matrices\n\n" +
        "If you see lots of range sums, think prefix.",
    },
    {
      title: "Sorting: what recruiters actually expect you to know",
      published: true,
      authorId: admin.id,
      content:
        "You don’t need to implement quicksort from scratch, but you *should* know when sorting helps.\n\n" +
        "Sorting is a ‘structure builder’ — it enables two pointers, binary search, grouping duplicates, and greedy strategies.\n\n" +
        "Mental checklist: can I sort to make the problem monotonic or to bring related items together?",
    },
    {
      title: "Trees 101: traversals and what they’re good for",
      published: true,
      authorId: author.id,
      content:
        "Tree traversals:\n" +
        "- Preorder: process node before children (copy tree, serialize)\n" +
        "- Inorder: sorted output for BST\n" +
        "- Postorder: process children before node (delete/free, compute sizes)\n" +
        "- Level-order (BFS): layer by layer\n\n" +
        "If a question mentions ‘hierarchy’, ‘nested’, or ‘parent/child’, it’s probably a tree.",
    },
    {
      title: "Binary Search Trees: when ‘sorted’ becomes a data structure",
      published: true,
      authorId: author.id,
      content:
        "BST property: left < node < right. Inorder traversal gives sorted order.\n\n" +
        "In interviews, BST problems often reduce to inorder logic, range queries, or validating the property.\n\n" +
        "Heads up: unbalanced BST can degrade to O(n). Balanced trees keep O(log n).",
    },
    {
      title: "Heaps / Priority Queues: always grab the next best",
      published: true,
      authorId: admin.id,
      content:
        "A heap is great when you repeatedly need min or max.\n\n" +
        "Common problems:\n" +
        "- top K elements\n" +
        "- merge K sorted lists\n" +
        "- scheduling (pick soonest finishing)\n" +
        "- Dijkstra’s shortest path\n\n" +
        "Think ‘stream of items + keep best candidates’.",
    },
    {
      title: "Graphs: BFS vs DFS in plain terms",
      published: true,
      authorId: author.id,
      content:
        "BFS explores in waves → shortest path in unweighted graphs.\n" +
        "DFS goes deep → great for connectivity, cycles, components, topo sort.\n\n" +
        "When you see ‘minimum steps’ or ‘shortest path’ (unweighted): BFS.\n" +
        "When you see ‘is it possible’, ‘explore all’, ‘detect cycle’: DFS.",
    },
    {
      title: "Topological Sort: ordering tasks with dependencies",
      published: true,
      authorId: author.id,
      content:
        "Topo sort applies to DAGs (directed acyclic graphs).\n\n" +
        "Use it when you have dependencies like ‘A must happen before B’.\n\n" +
        "Two approaches:\n" +
        "- Kahn’s algorithm (BFS with indegree)\n" +
        "- DFS postorder stack\n\n" +
        "If there’s a cycle, topo order doesn’t exist.",
    },
    {
      title: "Greedy Algorithms: when ‘best now’ is actually correct",
      published: true,
      authorId: admin.id,
      content:
        "Greedy means you pick the locally best choice and hope it leads to global best.\n\n" +
        "It works when the problem has a structure that guarantees it (like interval scheduling).\n\n" +
        "Tip: sort first, then greedily pick. If you can prove ‘this choice never blocks an optimal solution’, you’re good.",
    },
    {
      title: "Backtracking: clean way to generate possibilities",
      published: true,
      authorId: author.id,
      content:
        "Backtracking is DFS over the solution space. You build a partial solution, and if it breaks rules, you stop early.\n\n" +
        "Common problems:\n" +
        "- permutations / combinations\n" +
        "- subsets\n" +
        "- sudoku / n-queens\n\n" +
        "Pruning is the difference between ‘works’ and ‘times out’.",
    },
    {
      title: "Draft: How I practice DSA without burning out",
      published: false,
      authorId: author.id,
      content:
        "This is a personal draft.\n\n" +
        "My approach: 20–30 min a day, focus on patterns (two pointers, sliding window, BFS/DFS), and keep a notes file with templates + mistakes.\n\n" +
        "If I miss a day, I just continue. Consistency beats intensity.",
    },
    {
      title: "Draft: Notes to self before interviews",
      published: false,
      authorId: admin.id,
      content:
        "Draft checklist:\n" +
        "- clarify input/output with examples\n" +
        "- talk through brute force first\n" +
        "- optimize with a pattern\n" +
        "- test edge cases\n\n" +
        "Also: keep it calm. The goal is communication + problem solving, not perfection.",
    },
  ];

  const createdPosts = [];
  for (const data of postsData) {
    const post = await prisma.post.create({ data });
    createdPosts.push(post);
  }

  // Comments (a bit of life)
  const commentPairs = [
    {
      postTitle: "Big-O in real life: what it actually helps you decide",
      authorId: reader.id,
      content:
        "This helps a lot. I always mixed up O(n+m) vs O(n²). The ‘independent vs nested’ tip is 🔥.",
    },
    {
      postTitle: "Sliding Window: fastest way to scan subarrays",
      authorId: reader.id,
      content:
        "Sliding window finally clicked when you said ‘two pointers + validity rule’. Keeping that phrase.",
    },
    {
      postTitle: "Binary Search: it’s not just for ‘find x’",
      authorId: author.id,
      content:
        "Searching on the answer is the one that leveled me up. Worth practicing with ‘capacity’ style problems.",
    },
    {
      postTitle: "Graphs: BFS vs DFS in plain terms",
      authorId: admin.id,
      content:
        "If it’s ‘minimum steps’, BFS. If it’s ‘is it possible’, DFS. Simple and accurate.",
    },
  ];

  const comments = [];
  for (const c of commentPairs) {
    const post = createdPosts.find((p) => p.title === c.postTitle);
    if (!post) continue;
    const comment = await prisma.comment.create({
      data: {
        content: c.content,
        authorId: c.authorId,
        postId: post.id,
      },
    });
    comments.push(comment);
  }

  // Likes (a few examples)
  // Note: Like has unique constraints: (userId, postId) and (userId, commentId)
  const likeOps = [];

  const postByTitle = (title) => createdPosts.find((p) => p.title === title);

  const p1 = postByTitle("Big-O in real life: what it actually helps you decide");
  const p2 = postByTitle("Sliding Window: fastest way to scan subarrays");
  const p3 = postByTitle("Heaps / Priority Queues: always grab the next best");

  if (p1) {
    likeOps.push(prisma.like.create({ data: { userId: reader.id, postId: p1.id } }));
    likeOps.push(prisma.like.create({ data: { userId: author.id, postId: p1.id } }));
  }
  if (p2) {
    likeOps.push(prisma.like.create({ data: { userId: reader.id, postId: p2.id } }));
  }
  if (p3) {
    likeOps.push(prisma.like.create({ data: { userId: admin.id, postId: p3.id } }));
    likeOps.push(prisma.like.create({ data: { userId: reader.id, postId: p3.id } }));
  }

  // Like the first comment too
  if (comments[0]) {
    likeOps.push(prisma.like.create({ data: { userId: admin.id, commentId: comments[0].id } }));
  }

  await prisma.$transaction(likeOps);

  // Update likesCount fields to match what we just inserted
  // (Keeping counts correct helps the UI look consistent after seeding.)
  for (const post of createdPosts) {
    const count = await prisma.like.count({ where: { postId: post.id } });
    if (count > 0) {
      await prisma.post.update({ where: { id: post.id }, data: { likesCount: count } });
    }
  }

  for (const comment of comments) {
    const count = await prisma.like.count({ where: { commentId: comment.id } });
    if (count > 0) {
      await prisma.comment.update({
        where: { id: comment.id },
        data: { likesCount: count },
      });
    }
  }

  console.log("✅ Seed finished");
  console.log(`Users: 3 | Posts: ${createdPosts.length} | Comments: ${comments.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });